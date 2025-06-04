import { Button } from "@mantine/core";
import { ISaveForm, PalmyraForm } from "@palmyralabs/rt-forms";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { topic } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { useTenantFormStore } from "../../wire/AppStoreFactory";
import CandidateEditPage from "./editpage/CandidateEditpage";
import CandidateResume from "./resumeUpload/CandidateResume";
import CandidateCSV from "./resumeUpload/CandidateCSV";
import { useNavigate } from "react-router-dom";
import UploadedCandidates from "./UploadedCandidates";

interface IInput {
  pageName?: any;
}

const CandidateNewpage = (props: IInput) => {
  const [resumeType, setResumeType] = useState<"Resume" | "CSV">("Resume");
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const errorTexts: any = t("toastMsg", { returnObjects: true });
  const formRef = useRef<ISaveForm>(null);
  const [_isValid] = useState<boolean>(false);
  // const { t: tError } = useTranslation("toastMsg");
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const candidatesTexts: any = t("candidates", { returnObjects: true });

  const formdata = formRef.current?.getData();
  console.log(formdata);

  const endpoint = ServiceEndpoint.candidate.restApi;

  const store = useTenantFormStore(endpoint);

  const onRefresh = () => {
    topic.publish("uploadImg" + "/refresh", {});
  };

  const handleUploadImages = () => {
    setLoading(true);
    const formdata = new FormData();

    fileList.forEach((file) => {
      formdata.append("file", file); // Resume upload key
    });

    // console.log(storeResume);
    store
      .post(formdata)
      .then((d) => {
        console.log("Upload response", d);

        const filePassed = d?.message?.files_passed;
        const fileErrored = d?.message?.files_errored;

        if (filePassed && Array.isArray(filePassed)) {
          filePassed.forEach((pass) => {
            if (pass && pass.file_name && pass.status) {
              toast.success(
                `${pass.file_name} - ${JSON.stringify(pass.status)}`
              );
            }
          });
          navigate("../" + props.pageName);
        }
        if (fileErrored && Array.isArray(fileErrored)) {
          fileErrored.forEach((error) => {
            if (error && error.file_name && error.status) {
              toast.error(
                `${error.file_name} - ${JSON.stringify(error.status)}`
              );
            }
          });
        }
        setFileList([]);
        onRefresh();
        setLoading(false);
      })
      .catch((res) => {
        console.log(res);
        setLoading(false);
        if (
          res &&
          (res?.response?.status == 500 ||
            [500, 404, 400, "500", "404", "400"].includes(
              res?.response?.data?.status_code
            ))
        ) {
          toast.error(res?.response?.data?.message || errorTexts?.reqFail);
          // toast.error(res?.response?.data?.message || tError("reqFail"));
        }
      });
  };

  return (
    <div className="px-4 md:px-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-10 gap-4 px-15">
        <h1 className="text-2xl md:text-3xl font-bold">
          {candidatesTexts?.new?.title}
        </h1>

        <PalmyraForm ref={formRef} onValidChange={() => {}}>
          <CandidateEditPage
            value={resumeType}
            onChange={(val: string) => setResumeType(val as "Resume" | "CSV")}
          />
        </PalmyraForm>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-15 mb-4  rounded-lg shadow-lg">
        <div className="w-full lg:pb-10 lg:px-10 md:px-5">
          <UploadedCandidates
            pageName={props.pageName}
            customTitle={candidatesTexts?.subTitle}
          />
        </div>

        <div className="flex flex-col gap-6 px-4 md:px-10">
          <div className="flex justify-center lg:justify-start lg:ml-60">
            <Button
              loading={loading}
              loaderProps={{ type: "dots" }}
              className="filled-button w-full px-5"
              onClick={handleUploadImages}
            >
              {btnTexts.submitCan}
            </Button>
          </div>

          {resumeType === "Resume" ? (
            <CandidateResume
              fileList={fileList}
              setFileList={setFileList}
              formRef={formRef}
              pageName={props.pageName}
              loading={loading}
            />
          ) : (
            <CandidateCSV
              fileList={fileList}
              setFileList={setFileList}
              formRef={formRef}
              pageName={props.pageName}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateNewpage;
