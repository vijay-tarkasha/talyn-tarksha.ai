import { Button, Select } from "@mantine/core"
import { FieldGroupContainer, PalmyraForm } from "@palmyralabs/rt-forms"
import { delayGenerator, StringFormat } from '@palmyralabs/ts-utils'
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FaCheck } from "react-icons/fa6"
import { toast } from "react-toastify"
import { useHandleError } from "../../components/util/util"
import ButtonSwitch from "../../components/widget/ButtonSwitch"
import ProfileImage from "../../components/widget/ProfileImage"
import { ServiceEndpoint } from "../../config/ServiceEndpoints"
import { TextArea, TextField } from "../../template/mantineForm"
import { useTenantFormStore } from "../../wire/AppStoreFactory"
import '../jobs/JobPageX.css'

const JobUpdatePage = (props: any) => {
    const formRef = props.dialogRef;
    const { handle500Error } = useHandleError();
    const [isValid, setValid] = useState<boolean>(false);
    const { t } = useTranslation();
    const btnTexts: any = t("buttonLabels", { returnObjects: true })
    const jobTexts: any = t('jobPage', { returnObjects: true });
    const error: any = t('toastMsg.errorMsg', { returnObjects: true });
    const id = props?.data?.id;
    const apiEndpoint = StringFormat(ServiceEndpoint.job.byId, { id: id });
    const fitRef: any = useRef(true);
    const screeningRef: any = useRef(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [skillLoading, setSkillLoading] = useState<boolean>(true);
    // const [selectedImage, setSelectedImage] = useState(ProfilImg);

    const store = useTenantFormStore(apiEndpoint);
    const alitaUser = localStorage.getItem("alita_user")
    const currentDate = new Date().toISOString().split('T')[0];
    const [data, setData] = useState<any>();
    const [suggestions, setSuggestions] = useState<any>()
    const optionsEndPoint = ServiceEndpoint.job.sugg
    const optionStore = useTenantFormStore(optionsEndPoint);
    const delay = delayGenerator(600);
    const descRef: any = useRef();

    const handleFitmentChange = (value: string) => {
        fitRef.current = value;
    };

    const handleScreeningChange = (value: string) => {
        screeningRef.current = value;
    };

    const fetchSuggestions = (value: any) => {
        const reqBody = { job_desc: value };
        const reqOptions = { onApp404: { result: [] } }
        optionStore.post(reqBody, reqOptions).then((d) => {
            descRef.current.setValue(d.result.generated_short_desc)
            setSkillLoading(false)
            Object.entries(d.result.tech_stack).map(([key, value]) => {
                const labelValue = `${key} : ${value}`;
                setSuggestions((prev: any) => {
                    const currentSuggestions = Array.isArray(prev) ? prev : [];
                    const isDuplicate = currentSuggestions.some(
                        (item: any) => item.value === labelValue && item.label === labelValue
                    );

                    if (!isDuplicate) {
                        return [...currentSuggestions, { value: labelValue, label: labelValue }];
                    }
                    return currentSuggestions;
                });
            });

        }).catch((res: any) => {
            setSkillLoading(false)
            if (res)
                toast.error(res?.response?.data?.message)
            else
                handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }

    useEffect(() => {
        store.get({}).then((d) => {
            setData(d);
            fetchSuggestions(d.job_desc)
        }).catch((res) => {
            handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }, [id])

    const handleChange = (e: any) => {
        if (e) {
            delay(fetchSuggestions, e.target.value)
        }
    }

    const options = data ? data?.interview_options : ''

    const optionsList = Object.entries(options).map(([_k, value]: any) => {
        const labelValue = `${value.name} : ${value.complexity}`;
        return { value: labelValue, label: labelValue }
    });

    const [interview_option, setInterviewOptions] = useState<any>({
        opt1: '',
        opt2: '',
        opt3: '',
    });

    useEffect(() => {
        if (optionsList.length > 0) {
            setInterviewOptions({
                opt1: optionsList[0]?.value || '',
                opt2: optionsList[1]?.value || '',
                opt3: optionsList[2]?.value || '',
            });
        }
    }, [data]);

    const handleOptionChange = (key: string, value: string) => {
        setInterviewOptions((prev: any) => ({
            ...prev,
            [key]: value?.trim(),
        }));
    };

    const handleEdit = () => {
        setLoading(true);

        const interview_options = Object.values(interview_option)
            .filter((option: any) => option && (option.includes(' : ')))
            .reduce((acc: any, option: any) => {
                const [key, value]: any = option.split(" : ").map((str: any) => str.trim());
                acc[`${key}`] = value;
                return acc;
            }, {});
        const reqBody = {
            ...formRef?.current?.getData(),
            fitment_auto_reject: fitRef.current,
            screening_auto_reject: screeningRef.current,
            alita_user: alitaUser,
            created_on: currentDate,
            updated_on: currentDate,
            interview_options
        }

        store.put(reqBody).then((d) => {
            if (d) {
                toast.success(d.message)
                props.onClose()
            }
        }).catch((res) => {
            setLoading(false)
            if (res)
                toast.error(res?.response?.data?.message)
            // else
            handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }

    const aRej = data?.fitment_auto_reject + ""
    const mRej = data?.screening_auto_reject + ""

    interface Suggestion {
        value: string, label: string
    }

    const getOptions = (suggestions: Suggestion[] = [], selectedOptions: string[], opt: string) => {
        let filteredSuggestions = suggestions.filter(
            (s) => !selectedOptions.includes(s.value) || s.value === opt
        );

        if (opt && !filteredSuggestions.find((s) => s.value === opt)) {
            filteredSuggestions.unshift({ value: opt, label: opt });
        }
        return filteredSuggestions;
    };

    const selectedOptions = [
        interview_option?.opt1,
        interview_option?.opt2,
        interview_option?.opt3,
    ].filter(Boolean);

    // const handleFileChange = (file: any) => {
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file);
    //         setSelectedImage(imageUrl);
    //     }
    // };

    // const handleFormImgDelete = (event: any) => {
    //     setSelectedImage(ProfilImg)
    //     event?.stopPropagation()
    // }

    return (
        <div className="job-edit-container px-2 md:px-5">
            <div className="sticky top-0 z-10 bg-white pb-1 justify-between items-center flex">
                <div className="form-header-text"></div>
                <div className="">
                    <Button onClick={handleEdit} disabled={!isValid}
                        className={!isValid ? 'disable-button' : 'filled-button'}
                        loading={loading} loaderProps={{ type: 'dots' }}
                        leftSection={<FaCheck className="button-icon" />}>
                        {btnTexts?.job?.sJob}
                    </Button>
                </div>
            </div>
            <div>
                <PalmyraForm formData={props?.data} ref={formRef} onValidChange={setValid}>
                    <div className="">
                        <div className="flex items-center justify-between">
                            <div className="w-[70%]">
                                <TextField attribute="job_title" label={jobTexts?.input?.jobTitle} required
                                    invalidMessage={error?.req} length={{ max: 50, errorMessage: error.max + " 50" }}
                                    validRule={"string"} variant="filled" placeholder={jobTexts?.input?.jobTitle} />
                            </div>
                            <div className="mt-[10px]">
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
                                <ProfileImage name={data?.job_title} id={data?.id} className={"profile_md"} />
                            </div>
                        </div>
                        <TextArea attribute="job_desc" label={jobTexts?.input?.jobDesc} minRows={9} maxRows={10}
                            onBlur={handleChange} validRule={"string"} variant="filled" autosize required
                            placeholder={jobTexts?.input?.jobDescPh} description={jobTexts?.input?.subDesc} invalidMessage={error?.req}
                            length={{ min: 50, max: 10000, errorMessage: { minimum: error.min + " 50", maximum: error.max + " 10000" } }} />
                        <TextField attribute="job_short_desc" label={jobTexts?.input?.aiGen} disabled
                            validRule={"string"} variant="filled" placeholder={jobTexts?.input?.aiGen} ref={descRef} />
                        <div className="items-center gap-4 py-2 md:flex">
                            <div className="w-full">
                                <ButtonSwitch
                                    options={{ true: btnTexts?.job?.aReject, false: btnTexts?.job?.mReject }} label={jobTexts?.input?.fitment}
                                    onSelectionChange={handleFitmentChange}
                                    defaultValue={aRej}
                                />
                            </div>
                            <div className="w-full mt-4 md:mt-0">
                                <ButtonSwitch
                                    options={{ true: btnTexts?.job?.aReject, false: btnTexts?.job?.mReject }} label={jobTexts?.input?.screening}
                                    onSelectionChange={handleScreeningChange}
                                    defaultValue={mRej}
                                />
                            </div>
                        </div>
                        <div className="pt-4 text-sm font-medium">{jobTexts?.input?.skill}</div>
                        <div className="items-center gap-4 py-2 md:flex">
                            <div className="w-full">
                                <Select
                                    value={interview_option?.opt1}
                                    data={getOptions(suggestions, selectedOptions, interview_option?.opt1)}
                                    searchable
                                    onChange={(value: any) => handleOptionChange("opt1", value)}
                                    clearable
                                    placeholder={jobTexts?.input?.skillPh}
                                    nothingFoundMessage={skillLoading ? jobTexts?.input?.skillLoad : jobTexts?.input?.skillNoData}
                                />
                            </div>
                            <div className="w-full mt-6 md:mt-0">
                                <Select
                                    value={interview_option?.opt2}
                                    data={getOptions(suggestions, selectedOptions, interview_option?.opt2)}
                                    searchable
                                    onChange={(value: any) => handleOptionChange("opt2", value)}
                                    clearable
                                    placeholder={jobTexts?.input?.skillPh}
                                    nothingFoundMessage={skillLoading ? jobTexts?.input?.skillLoad : jobTexts?.input?.skillNoData}
                                />
                            </div>
                            <div className="w-full mt-6 md:mt-0">
                                <Select
                                    value={interview_option?.opt3}
                                    data={getOptions(suggestions, selectedOptions, interview_option?.opt3)}
                                    searchable
                                    onChange={(value: any) => handleOptionChange("opt3", value)}
                                    clearable
                                    placeholder={jobTexts?.input?.skillPh}
                                    nothingFoundMessage={skillLoading ? jobTexts?.input?.skillLoad : jobTexts?.input?.skillNoData}
                                />
                            </div>
                        </div>
                        <FieldGroupContainer columns={2}>
                            <TextField attribute="screening_questions_count" label={jobTexts?.input?.interviewQns}
                                validRule={{ rule: "number", errorMessage: error?.numbers }} defaultValue={15}
                                variant="filled" placeholder={jobTexts?.input?.interviewQns}
                                range={{ start: 3, end: 30, errorMessage: { start: error?.min + ' 3', end: error?.max + ' 30' } }} />
                            <TextField attribute="screening_interview_timing" label={jobTexts?.input?.interviewTime}
                                validRule={{ rule: "number", errorMessage: error?.numbers }} defaultValue={30}
                                variant="filled" placeholder={jobTexts?.input?.interviewTime}
                                range={{ start: 5, end: 60, errorMessage: { start: error?.min + ' 5', end: error?.max + ' 60' } }} />
                            <TextField attribute="fitment_limit" label={jobTexts?.input?.fitmentLimit}
                                validRule={{ rule: "number", errorMessage: error?.numbers }} defaultValue={50}
                                variant="filled" placeholder={jobTexts?.input?.fitmentLimit}
                                range={{ start: 40, end: 80, errorMessage: { start: error?.min + ' 40', end: error?.max + ' 80' } }} />
                            <TextField attribute="notes" label={jobTexts?.input?.points} validRule={"string"}
                                variant="filled" placeholder={jobTexts?.input?.points} />
                        </FieldGroupContainer>
                    </div>
                </PalmyraForm>
            </div>
        </div>
    )
}

export default JobUpdatePage;