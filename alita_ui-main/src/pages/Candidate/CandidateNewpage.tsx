import { Button } from "@mantine/core";
import { ISaveForm, PalmyraForm } from "@palmyralabs/rt-forms";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { topic } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { useTenantFormStore } from "../../wire/AppStoreFactory";
// import { StringFormat } from "@palmyralabs/ts-utils";
import CandidateEditPage from "./editpage/CandidateEditpage";
import UploadedApplications from "../application/UploadedApplications";
import CandidateResume from "./resumeUpload/CandidateResume";
import CandidateCSV from "./resumeUpload/CandidateCSV";
import { useNavigate } from "react-router-dom";

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
  // id: 4,
  // id: formdata?.id,

  // const csvEndpoint = ServiceEndpoint.candidate.restApi;

  // const storeResume = useTenantFormStore(resumeEndpoint);
  // const storeCSV = useTenantFormStore(csvEndpoint);

  const store = useTenantFormStore(endpoint);

  const onRefresh = () => {
    topic.publish("uploadImg" + "/refresh", {});
  };

  // const handleUploadImages = () => {
  //   setLoading(true);
  //   const formdata = new FormData();
  //   fileList.forEach((file) => {
  //     formdata.append(file.name, file);
  //   });

  //   console.log("Uploading files", fileList);

  //   console.log(formdata);
  //   const mode = "formdata";
  //   if (mode) {
  //     formdata.append("mode", JSON.stringify(mode));
  //   }
  //   console.log(mode);

  //   store
  //     .post(formdata)
  //     .then((d) => {
  //       console.log("Upload Response:", d);
  //       const filePassed = d?.result?.files_passed;
  //       const fileErrored = d?.result?.files_errored;

  //       if (filePassed && Array.isArray(filePassed)) {
  //         filePassed.forEach((pass) => {
  //           if (pass && pass.file_name && pass.status) {
  //             toast.success(
  //               `${pass.file_name} - ${JSON.stringify(pass.status)}`
  //             );
  //             // console.log(pass);
  //           }
  //         });

  //         navigate("../" + props.pageName);
  //       }

  //       if (fileErrored && Array.isArray(fileErrored)) {
  //         fileErrored.forEach((error) => {
  //           if (error && error.file_name && error.status) {
  //             toast.error(
  //               `${error.file_name} - ${JSON.stringify(error.status)}`
  //             );
  //             // console.log(error);
  //           }
  //         });
  //       }

  //       setFileList([]);
  //       onRefresh();
  //       setLoading(false);
  //     })
  //     .catch((res) => {
  //       if (
  //         res &&
  //         (res?.response?.status == 500 ||
  //           [500, 404, "500", "404"].includes(res?.response?.data?.status_code))
  //       )
  //         //   toast.error(res?.response?.data?.message || errorTexts?.reqFail);
  //         toast.error(res?.response?.data?.message || tError("reqFail"));
  //       setLoading(false);
  //     });
  // };

  // const handleUploadImages = () => {
  //   setLoading(true);
  //   const formdata = new FormData();
  //   fileList.forEach((file) => {
  //     formdata.append("file", file);
  //     // formdata.append("CSV", file);
  //   });

  //   if (resumeType == "Resume") {
  //     console.log(formdata);
  //     console.log(storeResume);
  //     storeResume
  //       .post(formdata)
  //       .then((d) => {
  //         // console.log("Upload Response:", d);
  //         const filePassed = d?.result?.files_passed;
  //         const fileErrored = d?.result?.files_errored;

  //         if (filePassed && Array.isArray(filePassed)) {
  //           filePassed.forEach((pass) => {
  //             if (pass && pass.file_name && pass.status) {
  //               toast.success(
  //                 `${pass.file_name} - ${JSON.stringify(pass.status)}`
  //               );
  //             }
  //           });
  //           navigate("../" + props.pageName);
  //         }
  //         if (fileErrored && Array.isArray(fileErrored)) {
  //           fileErrored.forEach((error) => {
  //             if (error && error.file_name && error.status) {
  //               toast.error(
  //                 `${error.file_name} - ${JSON.stringify(error.status)}`
  //               );
  //             }
  //           });
  //         }
  //         setFileList([]);
  //         onRefresh();
  //         setLoading(false);
  //       })
  //       .catch((res) => {
  //         console.log(res);
  //         setLoading(false);
  //         if (
  //           res &&
  //           (res?.response?.status == 500 ||
  //             [500, 404, 400, "500", "404", "400"].includes(
  //               res?.response?.data?.status_code
  //             ))
  //         ) {
  //           toast.error(res?.response?.data?.message || errorTexts?.reqFail);
  //           toast.error(res?.response?.data?.message || tError("reqFail"));
  //         }
  //       });
  //   } else {
  //     storeCSV
  //       .post(formdata)
  //       .then((d) => {
  //         const filePassed = d?.result?.files_passed;
  //         const fileErrored = d?.result?.files_errored;

  //         if (filePassed && Array.isArray(filePassed)) {
  //           filePassed.forEach((pass) => {
  //             if (pass && pass.file_name && pass.status) {
  //               toast.success(
  //                 `${pass.file_name} - ${JSON.stringify(pass.status)}`
  //               );
  //             }
  //           });

  //           navigate("../" + props.pageName);
  //         }

  //         if (fileErrored && Array.isArray(fileErrored)) {
  //           fileErrored.forEach((error) => {
  //             if (error && error.file_name && error.status) {
  //               toast.error(
  //                 `${error.file_name} - ${JSON.stringify(error.status)}`
  //               );
  //             }
  //           });
  //         }

  //         setFileList([]);
  //         onRefresh();
  //         setLoading(false);
  //       })
  //       .catch((res) => {
  //         if (
  //           res &&
  //           (res?.response?.status == 500 ||
  //             [500, 404, 400, "500", "404", "400"].includes(
  //               res?.response?.data?.status_code
  //             ))
  //         ) {
  //           // toast.error(res?.response?.data?.message || errorTexts?.reqFail);
  //           toast.error(res?.response?.data?.message || tError("reqFail"));
  //         }
  //         setLoading(false);
  //       });
  //   }
  // };

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
      <div className="flex justify-between px-25 mt-10">
        <h1 className="text-3xl font-bold py-4">
          {candidatesTexts?.new?.title}
        </h1>

        <PalmyraForm ref={formRef} onValidChange={() => {}}>
          <CandidateEditPage
            value={resumeType}
            onChange={(val: string) => setResumeType(val as "Resume" | "CSV")}
          />
        </PalmyraForm>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-15 mb-4 px-30 rounded-lg shadow-lg pb-10">
        <div className="w-full ">
          <UploadedApplications
            pageName={props.pageName}
            customTitle={candidatesTexts?.subTitle}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="ml-60">
            <Button
              loading={loading}
              loaderProps={{ type: "dots" }}
              className="filled-button w-full"
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
