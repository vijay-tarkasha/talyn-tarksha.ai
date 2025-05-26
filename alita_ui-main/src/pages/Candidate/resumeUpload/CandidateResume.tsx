import { Box, Button, Loader, Modal, Text } from "@mantine/core";
// import { StringFormat, topic } from "@palmyralabs/ts-utils";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { FaUpload } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { SlCloudUpload } from "react-icons/sl";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DocxFileImg from "../../../../public/images/docx.png";
import FileImg from "../../../../public/images/pdfi.png";
// import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
// import { useTenantFormStore } from "../../../wire/AppStoreFactory";
import "./CandidateResume.css";
import { ISaveForm } from "@palmyralabs/rt-forms";

interface IResumeProps {
  fileList: any[];
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  formRef: React.RefObject<ISaveForm>;
  pageName?: string;
}

const CandidateResume = ({
  fileList,
  setFileList,
}: // formRef,
//   pageName,
IResumeProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const candidatesTexts: any = t("candidates", { returnObjects: true });
  const errorTexts: any = t("toastMsg", { returnObjects: true });
  // const formData = formRef?.current?.getData();
  // const endpoint = StringFormat(ServiceEndpoint.candidate.upload, {
  //   id: formData?.title?.id,
  // });
  //
  // const store = useTenantFormStore(endpoint);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: any) => {
      const existingPaths = fileList.map((img: any) => img.key || img.path);

      const newFiles = acceptedFiles.filter((file: any) => {
        return !existingPaths.includes(file?.path);
      });
      console.log(newFiles);

      if (newFiles.length > 0) {
        setFileList((prev: any[]) => {
          const updatedList = [...prev, ...newFiles];
          const uniqueFiles = Array.from(
            new Map(updatedList.map((file: any) => [file.path, file])).values()
          );
          console.log(uniqueFiles);
          return uniqueFiles;
        });
      } else {
        toast.error(errorTexts?.fileDetect);
      }
      // },
      // maxFiles: 5,
      // accept: {
      //
      // },
    },
    maxFiles: 5,
    accept: {
      pdf: [".pdf"],
      docx: [".docx"],
      image: [".png", ".jpg", ".jpeg"],
    },
  });

  const handleUpload = (event: any) => {
    const updatedFiles = Array.from(event.target.files);
    setFileList([...fileList, ...updatedFiles]);
  };

  const removeFile = (file: any) => {
    const updatedFiles = fileList.filter((f: any) => f.path !== file.path);
    setFileList(updatedFiles);
  };

  const handleCancel = () => {
    setFileList([]);
  };
  console.log(fileList);

  // const onRefresh = () => {
  //   topic.publish("uploadImg" + "/refresh", {});
  // };

  // const handleUploadImages = () => {
  //   const jobTitle = formRef?.current?.getData()?.title;
  //   if (jobTitle == "" || jobTitle == null) {
  //     toast.error(errorTexts?.jobTitle);
  //   } else {
  //     if (fileList.length > 5) {
  //       toast.error(errorTexts?.fileDetect);
  //     } else {
  //       // setLoading(true);
  //       const formData = new FormData();
  //       fileList.forEach((file: any) => {
  //         formData.append(file.name, file);
  //       });

  //       store
  //         .post(formData)
  //         .then((d) => {
  //           const filePassed = d?.result?.files_passed;
  //           const fileErrored = d?.result?.files_errored;

  //           if (filePassed && Array.isArray(filePassed)) {
  //             filePassed.map((pass: any) => {
  //               if (pass && pass.file_name && pass.status) {
  //                 toast.success(
  //                   `${pass.file_name} - ${JSON.stringify(pass.status)}`
  //                 );
  //                 navigate("../" + pageName);
  //               }
  //             });
  //           }

  //           if (fileErrored && Array.isArray(fileErrored)) {
  //             fileErrored.map((error: any) => {
  //               if (error && error.file_name && error.status) {
  //                 toast.error(
  //                   `${error.file_name} - ${JSON.stringify(error.status)}`
  //                 );
  //               }
  //             });
  //           }

  //           setFileList([]);
  //           onRefresh();
  //         })
  //         .catch((res) => {
  //           if (
  //             res &&
  //             (res?.response?.status == 500 ||
  //               [500, 404, "500", "404"].includes(
  //                 res?.response?.data?.status_code
  //               ))
  //           )
  //             toast.error(res?.response?.data?.message || errorTexts?.reqFail);
  //           // setLoading(false);
  //         });
  //     }
  //   }
  // };

  const isBtnEnable = fileList.length > 0;

  const files: any = fileList.map((file: any, index: any) => {
    const fileExtension = file?.path.split(".").pop()?.toLowerCase();

    const getImage = () => {
      if (fileExtension === "pdf") {
        return FileImg;
      } else if (fileExtension === "docx") {
        return DocxFileImg;
      }
      if (
        fileExtension === "png" ||
        fileExtension === "jpg" ||
        fileExtension === "jpeg"
      ) {
        return file.preview || file.path; // preview URL or path to show uploaded image
      }
      return FileImg;
    };

    return (
      <div key={index} className="file-card">
        <div className="file-card-container">
          <div>
            <div className="flex items-center justify-between">
              <div></div>
              <IoMdClose
                onClick={() => removeFile(file)}
                className="file-remove-icon"
              />
            </div>
            <div className="h-20">
              <img
                src={getImage()}
                alt={file.path.split("/").pop()}
                className="object-contain h-full"
              />
            </div>
          </div>
        </div>
        <div className="file-name text-sm p-1">
          {file.path.split("/").pop()}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="mt-10">
        <div className="rounded-lg shadow-lg max-h-fit">
          <div className="px-10 py-5">
            <div className="items-center justify-between md:flex">
              <div className="text-base md:text-2xl font-bold pb-2 md:pb-0">
                {candidatesTexts.new.img.upload}
              </div>
            </div>

            <section className="flex flex-col items-center mt-3">
              {isBtnEnable && (
                <div className="w-full flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg">
                  {files}
                </div>
              )}
              <div
                style={{
                  borderColor: isBtnEnable
                    ? "rgba(var(--primary-color-rgb),0.75)"
                    : "#D1D5DB",
                  backgroundColor: isBtnEnable
                    ? "rgba(var(--primary-color-rgb),0.05)"
                    : "#F3F4F6",
                }}
                {...getRootProps({
                  className: `w-full h-70 rounded-lg p-6 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all'
                            }`,
                })}
                onChange={handleUpload}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                <div className="flex flex-col items-center text-center">
                  <SlCloudUpload className="text-3xl text-gray-500" />
                  <div className="text-xl font-semibold text-gray-700 mt-2 py-1">
                    {candidatesTexts.new.img.drop}
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mt-2 py-1">
                    {candidatesTexts.new.img.format}
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mt-2 py-1">
                    {candidatesTexts.new.img.or}
                  </div>
                  <div
                    className="text-base font-semibold py-1"
                    style={{
                      color: "rgba(var(--primary-color-rgb),1)",
                    }}
                  >
                    {candidatesTexts.new.img.browse}
                  </div>
                </div>
              </div>
            </section>
            <div className="md:flex items-center gap-2 py-5 justify-end">
              <div className="flex md:block item-center justify-center">
                <Button
                  onClick={handleCancel}
                  className="cancel-li-filled-button"
                  leftSection={<IoMdClose className="button-icon" />}
                >
                  {btnTexts.remove}
                </Button>
              </div>
              <div className="mt-3 md:mt-0 flex md:block item-center justify-center">
                <Button
                  // loading={loading}
                  // loaderProps={{ type: "dots" }}
                  className="filled-button"
                  onClick={() => fileInputRef.current?.click()}
                  leftSection={<FaUpload className="button-icon" />}
                >
                  {btnTexts.upldsub}
                </Button>
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
                    Your resume is being uploaded...
                  </Text>
                  <Text size="sm" color="dimmed" mt="sm">
                    This might take a few moments. Please stay on this page.
                  </Text>
                </Box>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateResume;
