import { Button } from "@mantine/core";
import {
  FieldGroupContainer,
  ISaveForm,
  PalmyraEditForm,
} from "@palmyralabs/rt-forms";
import { StringFormat, topic } from "@palmyralabs/ts-utils";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { PiFileCloudLight } from "react-icons/pi";
import { toast } from "react-toastify";
import { MobileRegex, useHandleError } from "../../../components/util/util";
import ProfileImage from "../../../components/widget/ProfileImage";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import {
  Select,
  ServerLookup,
  TextArea,
  TextField,
} from "../../../template/mantineForm";
import { useTenantFormStore } from "../../../wire/AppStoreFactory";
import "../../application/ApplicationPageX.css";

interface IInput {
  id: any;
  close: any;
  refreshTopic?: any;
  onRefresh?: any;
}

const CandidateId = (props: IInput) => {
  const { handle500Error } = useHandleError();
  const formRef = useRef<ISaveForm>(null);
  const [isValid, setValid] = useState<boolean>(false);
  const { t } = useTranslation();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const applicationTexts: any = t("application", { returnObjects: true });
  const errorTexts: any = t("toastMsg", { returnObjects: true });

  const endpoint = StringFormat(ServiceEndpoint.candidate.byId, {
    id: props.id,
  });
  const jobStore = useTenantFormStore(endpoint);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    jobStore
      .get({})
      .then((d) => {
        if (d) {
          setData(d);
        }
      })
      .catch((res) => {
        handle500Error(res?.response?.data?.status_code, res?.status);
      });
  }, [props?.id]);

  const onRefresh = () => {
    topic.publish(props.refreshTopic, {});
  };

  const jobEndpoint = ServiceEndpoint.job.restApi;

  const api = {
    get: endpoint,
    query: endpoint,
    put: endpoint,
    post: endpoint,
  };

  const handleSave = () => {
    setLoading(true);
    formRef?.current
      ?.saveData()
      .then((d) => {
        toast.success(d.message);
        props.close();
        onRefresh();
        props.onRefresh();
      })
      .catch((res) => {
        setLoading(false);
        if (res) toast.error(res?.response?.data?.message);
      });
  };
  const statusRef = useRef<any>();

  const PreSave = () => {
    const req = {
      ...formRef?.current?.getData(),
      // jobPosting: data.jobPosting.id,
      status: statusRef?.current.getValue(),
    };
    return req;
  };

  return (
    <div className="candidate-edit-container px-2 md:px-5">
      <div className="sticky top-0 bg-white p-2 z-50">
        <div className="flex flex-col lg:flex-row items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              {/* <TbHome className="text-3xl header-icon" /> */}
              <ProfileImage
                name={data?.name}
                id={data?.id}
                className={"profile_md"}
              />
            </div>
            <div>
              <span className="text-base md:text-lg font-semibold header-text">
                {data?.name}
              </span>
              <div className="text-sm sub-header-text text-gray-600">
                {data?.email}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-5 mt-4 md:mt-0">
            <div className="flex items-center gap-3 justify-center">
              <div>
                <PiFileCloudLight className="text-2xl edit-icon" />
              </div>
              <div className="px-2 py-1 rounded-full text-sm md:text-md percentage-field">
                {data?.fitment_score}%
              </div>
            </div>

            <div className="w-full md:w-auto fitmant-select">
              <PalmyraEditForm
                endPoint={api}
                ref={formRef}
                id={props.id}
                onValidChange={setValid}
              >
                <Select
                  attribute="status"
                  placeholder={applicationTexts.input.status}
                  ref={statusRef}
                  searchable
                  required
                  nothingFoundMessage={"--No data available--"}
                  className="w-full md:w-48"
                  options={{
                    New: "NEW",
                    "Auto Rejected": "AUTO_REJECT",
                    "AI Scheduled": "AI_SCHEDULED",
                    "AI On-going": "AI_ONGOING",
                    "AI Reject": "AI_REJECT",
                    Scheduled: "SCHEDULED",
                    "On-going": "ONGOING",
                    Reject: "REJECT",
                    Selected: "SELECT",
                    Offered: "OFFERED",
                  }}
                />
              </PalmyraEditForm>
            </div>

            <div className="w-full md:w-auto flex justify-end">
              <Button
                onClick={handleSave}
                disabled={!isValid}
                style={{
                  width: "100%",
                }}
                className={`w-full md:w-auto px-4 py-2 rounded-md text-white transition-all ${
                  isValid ? "filled-button" : "disable-button"
                }`}
                loading={loading}
                loaderProps={{ type: "dots" }}
                rightSection={<IoIosArrowDown className="ml-2" />}
              >
                {btnTexts.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <PalmyraEditForm
          endPoint={api}
          ref={formRef}
          id={props.id}
          preSave={PreSave}
        >
          <FieldGroupContainer columns={2}>
            <TextField
              attribute="resume"
              label={applicationTexts.input.resume}
              colspan={2}
              readOnly
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.resume}
            />
            <ServerLookup
              attribute="jobPosting"
              label={applicationTexts.input.posting}
              variant="filled"
              placeholder={applicationTexts.input.posting}
              queryOptions={{ endPoint: jobEndpoint }}
              colspan={2}
              readOnly
              lookupOptions={{ idAttribute: "id", labelAttribute: "job_title" }}
            />
            <TextField
              attribute="fitment_score"
              label={applicationTexts.input.fitment}
              readOnly
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.fitment}
            />
            <TextField
              attribute="feedback"
              label={applicationTexts.input.feedback}
              readOnly
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.feedback}
            />
            <TextField
              attribute="name"
              label={applicationTexts.input.name}
              readOnly
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.name}
            />
            <TextField
              attribute="email"
              label={applicationTexts.input.email}
              readOnly
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.email}
            />
            <TextField
              attribute="mobile"
              label={applicationTexts.input.mobile}
              readOnly
              regExp={{
                regex: MobileRegex,
                errorMessage: errorTexts?.errorMsg?.invalidMobile,
              }}
              variant="filled"
              placeholder={applicationTexts.input.mobile}
            />
            <TextField
              attribute="location"
              label={applicationTexts.input.location}
              readOnly
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.location}
            />
            {/* <TextArea attribute="tech_stacks" label={candidatesTexts.input.tech} rows={3} colspan={2}
                            validRule={"string"} variant="filled" placeholder={candidatesTexts.input.tech} />*/}
            {/* <TextArea attribute="resume_summary" label={candidatesTexts.input.summary} rows={3} colspan={2}
                            validRule={"string"} variant="filled" placeholder={candidatesTexts.input.summary} /> */}
            <TextArea
              attribute="fitment_summary"
              label={applicationTexts.input.fitsummary}
              rows={10}
              colspan={2}
              validRule={"string"}
              variant="filled"
              placeholder={applicationTexts.input.fitsummary}
              readOnly
            />
          </FieldGroupContainer>
        </PalmyraEditForm>
      </div>
    </div>
  );
};

export default CandidateId;
