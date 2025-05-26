import { Button } from "@mantine/core";
import { ISaveForm, PalmyraForm } from "@palmyralabs/rt-forms";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CandidateEditPage from "./editpage/CandidateEditpage";
import UploadedApplications from "../application/UploadedApplications";
import CandidateResume from "./resumeUpload/CandidateResume";
import CandidateCSV from "./resumeUpload/CandidateCSV";

interface IInput {
  pageName?: string;
}

const CandidateNewpage = (props: IInput) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [resumeType, setResumeType] = useState<"resumes" | "csv">("resumes");
  const [loading, setLoading] = useState(false);

  const formRef = useRef<any>(null);
  const { t } = useTranslation();

  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const candidatesTexts: any = t("candidates", { returnObjects: true });

  const handleUploadResume = async (candidateId: number, file: File) => {
    if (!candidateId) {
      toast.error("Candidate ID is missing");
      return;
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not authenticated");
      setLoading(false);
      return;
    }

    const tenantUrl =
      process.env.REACT_APP_TENANT_URL || "https://yourtenant.com";
    const endpoint = `${tenantUrl}/candidates/${candidateId}/upload-resume/`;

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("mode", "upload");
    formData.append("type", "document");
    formData.append("src", "candidate-portal");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Resume uploaded successfully");
        setFileList([]);
      } else {
        toast.error(result.message || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  
  const onUploadClick = async () => {
    try {
      const response = await formRef.current?.save?.(); 
      console.log("Save Response:", response);

      const candidateId = response?.data?.candidateId;

      if (!candidateId) {
        toast.error("Candidate ID missing after save");
        return;
      }

      if (fileList.length === 0) {
        toast.error("Please select a file before upload");
        return;
      }

      handleUploadResume(candidateId, fileList[0]);
    } catch (err) {
      console.error("Form save failed:", err);
      toast.error("Form save failed. Please check inputs.");
    }
  };

  // const onUploadClick = () => {
  //   const formData = formRef.current?.getData();
  //   console.log("Form Data:", formData);

  //   const candidateId = formData?.candidateId;
  //   console.log("candidateId Data:", candidateId);

  //   if (!candidateId) {
  //     toast.error("Please fill candidate details before upload");
  //     return;
  //   }

  //   if (fileList.length === 0) {
  //     toast.error("Please select a file before upload");
  //     return;
  //   }

  //   handleUploadResume(candidateId, fileList[0]);
  // };

  return (
    <div className="px-4 md:px-10">
      <div className="flex justify-between px-25 mt-10">
        <h1 className="text-3xl font-bold py-4">
          {candidatesTexts?.new?.title}
        </h1>

        <PalmyraForm ref={formRef} onValidChange={() => {}}>
          <CandidateEditPage
            value={resumeType}
            onChange={(val: string) => setResumeType(val as "resumes" | "csv")}
          />
        </PalmyraForm>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-15 mb-4 px-30">
        <div className="w-full mt-10">
          <UploadedApplications pageName={props.pageName} className="w-full" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="ml-60">
            <Button
              loading={loading}
              loaderProps={{ type: "dots" }}
              className="filled-button w-full"
              onClick={onUploadClick}
            >
              {btnTexts.submitCan}
            </Button>
          </div>

          {resumeType === "resumes" ? (
            <CandidateResume
              fileList={fileList}
              setFileList={setFileList}
              formRef={formRef}
              pageName={props.pageName}
            />
          ) : (
            <CandidateCSV
              fileList={fileList}
              setFileList={setFileList}
              formRef={formRef}
              pageName={props.pageName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateNewpage;
