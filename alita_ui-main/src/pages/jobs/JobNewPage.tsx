import { Box, Button, Loader, Modal, Select, Text } from "@mantine/core";
import {
  FieldGroupContainer,
  ISaveForm,
  PalmyraNewForm,
} from "@palmyralabs/rt-forms";
import { delayGenerator } from "@palmyralabs/ts-utils";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaCircleUser } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useHandleError } from "../../components/util/util";
import ButtonSwitch from "../../components/widget/ButtonSwitch";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { TextArea, TextField } from "../../template/mantineForm";
import { IPageInput } from "../../template/Types";
import { useTenantFormStore } from "../../wire/AppStoreFactory";
import { useNavigation } from "../../wire/errorToast";

const JobNewPage = (props: IPageInput) => {
  const { navigateTo } = useNavigation();
  const formRef: any = useRef<ISaveForm>(null);
  const { handle500Error } = useHandleError();
  const [isValid, setValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [skillLoading, setSkillLoading] = useState<boolean>(false);
  // const [selectedImage, setSelectedImage] = useState(ProfilImg);
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<any>();
  const [interviewOptions, setInterviewOptions] = useState<{
    opt1?: string;
    opt2?: string;
    opt3?: string;
  }>({});
  const [val, setVal] = useState<any>();
  const [val1, setVal1] = useState<any>();
  const [val2, setVal2] = useState<any>();

  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const jobTexts: any = t("jobPage", { returnObjects: true });
  const error: any = t("toastMsg.errorMsg", { returnObjects: true });
  const errorTexts: any = t("toastMsg", { returnObjects: true });
  const delay = delayGenerator(100);

  const alitaUser = localStorage.getItem("alita_user");
  const apiEndpoint = ServiceEndpoint.job.restApi;
  const currentDate = new Date().toISOString().split("T")[0];

  const optionsEndPoint = ServiceEndpoint.job.sugg;
  const optionStore = useTenantFormStore(optionsEndPoint);
  const store = useTenantFormStore(apiEndpoint);

  const fitRef: any = useRef(true);
  const screeningRef: any = useRef(true);
  const descRef: any = useRef();

  const handleBack = () => {
    navigateTo("../" + props.pageName);
  };
  const handleFitmentChange = (value: string) => {
    fitRef.current = value;
  };

  const handleScreeningChange = (value: string) => {
    screeningRef.current = value;
  };

  // const handleFileChange = (file: any) => {
  //     if (file) {
  //         const imageUrl = URL.createObjectURL(file);
  //         setSelectedImage(imageUrl);
  //     }
  // };

  interface Suggestion {
    value: string;
    label: string;
  }

  const getOptions = (
    suggestions: Suggestion[] = [],
    selectedOptions: string[],
    opt: string
  ) => {
    let filteredSuggestions = suggestions.filter(
      (s) => !selectedOptions.includes(s.value) || s.value === opt
    );

    if (opt && !filteredSuggestions.find((s) => s.value === opt)) {
      filteredSuggestions.unshift({ value: opt, label: opt });
    }

    return filteredSuggestions;
  };

  const selectedOptions = [val, val1, val2].filter(Boolean);

  const handleOptionChange = (key: string, value: string) => {
    if (value) {
      const v = value.split(":");
      setInterviewOptions((prev) => ({
        ...prev,
        [key]: {
          [`${v[0].trim()}`]: v[1].trim(),
        },
      }));

      if (key === "opt1") setVal(value);
      if (key === "opt2") setVal1(value);
      if (key === "opt3") setVal2(value);
    }
  };

  const handleSave = () => {
    setLoading(true);
    const data = formRef?.current?.getData();

    const interview_options = Object.values(interviewOptions).reduce(
      (acc, obj: any) => {
        return { ...acc, ...obj };
      },
      {}
    );

    const reqBody = {
      ...data,
      job_type: "Full Time",
      job_mode: "Permanent",
      salary_min: "50000.00",
      salary_max: "90000.00",
      line_of_business: "IT",
      job_short_desc: descRef?.current?.getValue(),
      fitment_auto_reject: fitRef.current,
      screening_auto_reject: screeningRef.current,
      alita_user: alitaUser,
      created_on: currentDate,
      updated_on: currentDate,
      interview_options: interview_options,
    };

    store
      .post(reqBody)
      .then((d) => {
        toast.success(d?.message);
        navigateTo("../" + props.pageName);
      })
      .catch((res: any) => {
        setLoading(false);
        if (
          (res && res?.response?.data?.status_code == "500") ||
          res?.response?.status == 500
        ) {
          const message = res?.response?.data?.message;
          const result = res?.response?.data?.result;
          if (result) {
            toast.error("Short Desc - " + result.job_short_desc[0]);
          } else toast.error(message);

          const missingFields = Object.keys(result)
            .filter(
              (field) =>
                result[field] &&
                result[field].includes("This field may not be blank.")
            )
            .join(", ");

          const errorMessage =
            missingFields &&
            `${message} - ${errorTexts?.missMan}: ${missingFields}`;
          if (missingFields) {
            if (errorMessage) toast.error(errorMessage);
            else toast.error(errorTexts?.fillMan);
          }
        }
      });
  };

  const fetchSuggestions = (value: any) => {
    setSkillLoading(true);
    const reqBody = { job_desc: value };
    const reqOptions = { onApp404: { result: [] } };
    optionStore
      .post(reqBody, reqOptions)
      .then((d) => {
        descRef.current.setValue(d.result.generated_short_desc);
        setSkillLoading(false);
        Object.entries(d.result.tech_stack).map(([key, value]) => {
          const labelValue = `${key} : ${value}`;
          setSuggestions((prev: any) => {
            const isDuplicate = prev?.some(
              (suggestion: any) => suggestion.value === labelValue
            );
            if (!isDuplicate) {
              return [
                ...(Array.isArray(prev) ? prev : []),
                { value: labelValue, label: labelValue },
              ];
            }
            return prev;
          });
        });
      })
      .catch((res: any) => {
        setSkillLoading(false);
        if (res) {
          const error = res?.response?.data?.message;
          toast.error(error);
        } else handle500Error(res?.response?.data?.status_code, res?.status);
      });
  };

  const handleChange = (e: any) => {
    if (e) {
      delay(fetchSuggestions, e.target.value);
    }
  };

  // const handleFormImgDelete = (event: any) => {
  //     setSelectedImage(ProfilImg)
  //     event?.stopPropagation()
  // }

  return (
    <div className="page-content-container">
      <div className="page-right-left-container">
        <div className="sticky top-0 z-10 bg-white pb-1 justify-between items-center md:flex">
          <div className="text-base md:text-xl font-semibold pb-2 md:pb-0">
            {jobTexts?.new?.title}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleBack}
              className="cancel-filled-button"
              leftSection={<IoMdClose className="button-icon" />}
            >
              {btnTexts?.cancel}
            </Button>
            <Button
              onClick={handleSave}
              loading={loading}
              loaderProps={{ type: "dots" }}
              disabled={!isValid || descRef?.current?.getValue() == ""}
              className={
                !isValid || descRef?.current?.getValue() == ""
                  ? "disable-button"
                  : "filled-button"
              }
              leftSection={<FaCheck className="button-icon" />}
            >
              {btnTexts?.job?.sJob}
            </Button>
          </div>
        </div>
        <div>
          <PalmyraNewForm
            endPoint={apiEndpoint}
            ref={formRef}
            onValidChange={setValid}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-[70%]">
                  <TextField
                    attribute="job_title"
                    label={jobTexts?.input?.jobTitle}
                    required
                    invalidMessage={error?.req}
                    length={{ max: 50, errorMessage: error.max + " 50" }}
                    validRule={"string"}
                    variant="filled"
                    placeholder={jobTexts?.input?.jobTitle}
                  />
                </div>
                <div>
                  {/* <FileButton onChange={handleFileChange} accept="image/*">
                                        {(props) => (
                                            <div className="h-[120px] w-[120px] cursor-pointer" {...props}>
                                                <Tooltip label={jobTexts?.imgTooltip} position="left" color="var(--primary-color)"
                                                    offset={{ mainAxis: -50, crossAxis: 0 }}
                                                    transitionProps={{ transition: 'fade-up', duration: 300 }}>
                                                    <img src={selectedImage} alt="Profile"
                                                        style={{
                                                            opacity: selectedImage === ProfilImg ? 0.35 : 1,
                                                            transition: "opacity 0.3s ease"
                                                        }} />
                                                </Tooltip>
                                                {selectedImage !== ProfilImg &&
                                                    <div className="img-delete-icon-container">
                                                        <LuTrash2 className="img-action-icon" onClick={(event) => handleFormImgDelete(event)} />
                                                    </div>}
                                            </div>
                                        )}
                                    </FileButton> */}
                  <FaCircleUser className="h-[80px] w-[80px] mt-[10px] text-gray-400" />
                </div>
              </div>
              <TextArea
                attribute="job_desc"
                label={jobTexts?.input?.jobDesc}
                minRows={9}
                maxRows={10}
                onBlur={handleChange}
                validRule={"string"}
                variant="filled"
                autosize
                required
                placeholder={jobTexts?.input?.jobDescPh}
                description={jobTexts?.input?.subDesc}
                invalidMessage={error?.req}
                length={{
                  min: 50,
                  max: 10000,
                  errorMessage: {
                    minimum: error.min + " 50",
                    maximum: error.max + " 10000",
                  },
                }}
              />
              <TextField
                attribute="job_short_desc"
                label={jobTexts?.input?.aiGen}
                disabled
                validRule={"string"}
                variant="filled"
                placeholder={jobTexts?.input?.aiGen}
                ref={descRef}
              />
              <div className="items-center gap-4 py-2 md:flex">
                <div className="w-full">
                  <ButtonSwitch
                    options={{
                      true: btnTexts?.job?.aReject,
                      false: btnTexts?.job?.mReject,
                    }}
                    label={jobTexts?.input?.fitment}
                    onSelectionChange={handleFitmentChange}
                    defaultValue="true"
                  />
                </div>
                <div className="w-full mt-4 md:mt-0">
                  <ButtonSwitch
                    options={{
                      true: btnTexts?.job?.aReject,
                      false: btnTexts?.job?.mReject,
                    }}
                    label={jobTexts?.input?.screening}
                    onSelectionChange={handleScreeningChange}
                    defaultValue="true"
                  />
                </div>
              </div>
              <div className="pt-4 text-sm font-medium">
                {jobTexts?.input?.skill}
              </div>
              <div className="items-center gap-4 py-2 md:flex">
                <div className="w-full">
                  <Select
                    data={getOptions(suggestions, selectedOptions, val || "")}
                    clearable
                    placeholder={jobTexts?.input?.selectPriSkill}
                    searchable
                    nothingFoundMessage={
                      skillLoading
                        ? jobTexts?.input?.skillLoad
                        : jobTexts?.input?.skillNoData
                    }
                    onChange={(value: any) => handleOptionChange("opt1", value)}
                  />
                </div>
                <div className="w-full mt-6 md:mt-0">
                  <Select
                    data={getOptions(suggestions, selectedOptions, val1 || "")}
                    clearable
                    placeholder={jobTexts?.input?.selectSecSkill}
                    searchable
                    nothingFoundMessage={
                      skillLoading
                        ? jobTexts?.input?.skillLoad
                        : jobTexts?.input?.skillNoData
                    }
                    onChange={(value: any) => handleOptionChange("opt2", value)}
                  />
                </div>
                <div className="w-full mt-6 md:mt-0">
                  <Select
                    data={getOptions(suggestions, selectedOptions, val2 || "")}
                    clearable
                    placeholder={jobTexts?.input?.selectTerSkill}
                    searchable
                    nothingFoundMessage={
                      skillLoading
                        ? jobTexts?.input?.skillLoad
                        : jobTexts?.input?.skillNoData
                    }
                    onChange={(value: any) => handleOptionChange("opt3", value)}
                  />
                </div>
              </div>
              <FieldGroupContainer columns={2}>
                <TextField
                  attribute="screening_questions_count"
                  label={jobTexts?.input?.interviewQns}
                  validRule={{ rule: "number", errorMessage: error?.numbers }}
                  defaultValue={15}
                  variant="filled"
                  placeholder={jobTexts?.input?.interviewQns}
                  range={{
                    start: 3,
                    end: 30,
                    errorMessage: {
                      start: error?.min + " 3",
                      end: error?.max + " 30",
                    },
                  }}
                />
                <TextField
                  attribute="screening_interview_timing"
                  label={jobTexts?.input?.interviewTime}
                  validRule={{ rule: "number", errorMessage: error?.numbers }}
                  defaultValue={30}
                  variant="filled"
                  placeholder={jobTexts?.input?.interviewTime}
                  range={{
                    start: 5,
                    end: 60,
                    errorMessage: {
                      start: error?.min + " 5",
                      end: error?.max + " 60",
                    },
                  }}
                />
                <TextField
                  attribute="fitment_limit"
                  label={jobTexts?.input?.fitmentLimit}
                  validRule={{ rule: "number", errorMessage: error?.numbers }}
                  defaultValue={50}
                  variant="filled"
                  placeholder={jobTexts?.input?.fitmentLimit}
                  range={{
                    start: 40,
                    end: 80,
                    errorMessage: {
                      start: error?.min + " 40",
                      end: error?.max + " 80",
                    },
                  }}
                />
                <TextField
                  attribute="notes"
                  label={jobTexts?.input?.points}
                  validRule={"string"}
                  variant="filled"
                  placeholder={jobTexts?.input?.points}
                />
              </FieldGroupContainer>
            </div>
          </PalmyraNewForm>
        </div>
      </div>

      <Modal
        opened={loading}
        onClose={() => {}}
        centered
        withCloseButton={false}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <div className="loading-modal">
          <Loader size="lg" color="var(--primary-color)" type="bars" />
          <Box style={{ marginTop: "20px", textAlign: "center" }}>
            <Text size="lg" color="var(--primary-color)" fw={600}>
              Your job data is being saved, please wait...
            </Text>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default JobNewPage;
