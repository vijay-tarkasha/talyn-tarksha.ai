import { Button } from "@mantine/core";
import { ISaveForm, PalmyraForm } from "@palmyralabs/rt-forms";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { topic } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { ServerLookup, TextField } from "../../template/mantineForm";
import "./ApplicationPageX.css";
import UploadedApplications from "./UploadedApplications";
import ImageDropZone from "./resumeUpload/ResumeDropZone";
import { useTenantFormStore } from "../../wire/AppStoreFactory";
import { StringFormat } from "@palmyralabs/ts-utils";
import { useNavigate } from "react-router-dom";
// import UploadedCandidates from "./UploadedApplications";

interface IInput {
  formRef?: any;
  pageName?: any;
}

const ApplicationNewPage = (props: IInput) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const formRef = useRef<ISaveForm>(null);

  const [_isValid, setValid] = useState<boolean>(false);
  const { t } = useTranslation();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const applicationTexts: any = t("application", { returnObjects: true });
  const errorTexts: any = t("toastMsg", { returnObjects: true });

  const lookupEndpoint = ServiceEndpoint.job.restApi;
  const lookupRef = useRef<any>();
  const shortDescRef = useRef<any>();

  const formData = formRef.current?.getData();
  const endpoint = StringFormat(ServiceEndpoint.application.upload, {
    id: formData?.title?.id,
  });
  const store = useTenantFormStore(endpoint);

  // console.log("Job Title ID:", formData?.title?.id);
  // console.log("Endpoint:", endpoint);

  const handleLookupOnchange = (value: any, d: any) => {
    if (value != "" && d) shortDescRef.current.setValue(d.job_short_desc);
    else shortDescRef.current.setValue("");
  };

  const onRefresh = () => {
    topic.publish("uploadImg" + "/refresh", {});
  };

  const handleUploadImages = () => {
    const jobTitle = formRef.current?.getData()?.title;
    console.log("Job Title ID:", jobTitle);
    if (!jobTitle || !jobTitle.id) {
      toast.error(errorTexts?.jobTitle || "Please select a job title");
      return;
    }

    if (fileList.length > 5) {
      toast.error(errorTexts?.fileDetect || "Max 5 files allowed");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append(file.name, file);
    });

    // console.log("Uploading files", fileList);

    store
      .post(formData)
      .then((d) => {
        console.log("Upload Response:", d);
        const filePassed = d?.result?.files_passed;
        const fileErrored = d?.result?.files_errored;

        if (filePassed && Array.isArray(filePassed)) {
          filePassed.forEach((pass) => {
            if (pass && pass.file_name && pass.status) {
              toast.success(
                `${pass.file_name} - ${JSON.stringify(pass.status)}`
              );
              // console.log(pass);
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
              // console.log(error);
            }
          });
        }

        setFileList([]);
        onRefresh();
        setLoading(false);
      })
      .catch((res) => {
        if (
          res &&
          (res?.response?.status == 500 ||
            [500, 404, "500", "404"].includes(res?.response?.data?.status_code))
        )
          toast.error(res?.response?.data?.message || errorTexts?.reqFail);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="px-4 md:px-10">
        <div className="text-3xl font-bold py-4">
          {applicationTexts?.new?.title}
        </div>

        <div className="rounded-xl shadow-lg">
          <div className="px-25 py-10">
            <PalmyraForm ref={formRef} onValidChange={setValid}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <ServerLookup
                    attribute="title"
                    label={applicationTexts?.input?.jobTitle}
                    queryOptions={{ endPoint: lookupEndpoint }}
                    ref={lookupRef}
                    required
                    //@ts-ignore
                    onChange={handleLookupOnchange}
                    lookupOptions={{
                      idAttribute: "id",
                      labelAttribute: "job_title",
                    }}
                    invalidMessage={errorTexts?.errorMsg?.req}
                    placeholder={applicationTexts?.input?.jobTitlePh}
                  />
                </div>
                <div className="flex justify-center align-middle p-8">
                  <Button
                    loading={loading}
                    loaderProps={{ type: "dots" }}
                    className="filled-button"
                    onClick={handleUploadImages}
                  >
                    {btnTexts.submit}
                  </Button>
                </div>
              </div>

              <TextField
                attribute="ai"
                label={applicationTexts?.input?.aiGen}
                ref={shortDescRef}
                validRule="string"
                variant="filled"
                placeholder={applicationTexts?.input?.aiGen}
                disabled
              />
            </PalmyraForm>

            <div className="grid grid-cols-2 gap-6 mt-6 mb-4">
              <UploadedApplications pageName={props.pageName} />
              <ImageDropZone
                fileList={fileList}
                setFileList={setFileList}
                formRef={formRef}
                pageName={props.pageName}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationNewPage;
