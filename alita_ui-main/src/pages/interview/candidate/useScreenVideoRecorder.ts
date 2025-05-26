import { useState, useEffect } from "react";
import axios from "axios";
import { StringFormat } from "@palmyralabs/ts-utils";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { enterFullscreen } from "./FullScreen";

interface IInput {
    totalChunks: number;
    token: string;
    domain: string;
    candidateId: any;
}

let globalScreenStream: MediaStream | null = null;
let screenRecorder: MediaRecorder | null = null;
let screenChunks: Blob[] = [];

let globalWebcamStream: MediaStream | null = null;
let webcamRecorder: MediaRecorder | null = null;
let webcamChunks: Blob[] = [];

const useScreenVideoRecorder = ({ totalChunks, token, domain, candidateId }: IInput) => {
    const [screenRecordingStatus, setScreenRecordingStatus] = useState<"idle" | "recording" | "stopped">("idle");
    const [webcamStatus, setWebcamStatus] = useState<"idle" | "recording" | "stopped">("idle");
    const [screenBlobUrl, setScreenBlobUrl] = useState<string | null>(null);
    const [webcamBlobUrl, setWebcamBlobUrl] = useState<string | null>(null);
    const [qnId, setQnId] = useState<string | null>(null);
    const [type, setType] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const endPoint = domain + StringFormat(ServiceEndpoint.videoUpload.restApi, { id: candidateId });

    const start = async () => {
        enterFullscreen();
        try {
            if (!globalScreenStream) {
                globalScreenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                globalScreenStream.getTracks().forEach(track => {
                    track.onended = () => {
                        setScreenRecordingStatus("stopped");
                    };
                });
            }

            screenChunks = [];
            screenRecorder = new MediaRecorder(globalScreenStream, { mimeType: "video/webm" });

            screenRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    screenChunks.push(event.data);
                }
            };

            screenRecorder.onstop = () => {
                const screenBlob = new Blob(screenChunks, { type: "video/mp4" });
                setScreenBlobUrl(URL.createObjectURL(screenBlob));
            };

            screenRecorder.start();
            setScreenRecordingStatus("recording");

            if (!globalWebcamStream) {
                globalWebcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                globalWebcamStream.getTracks().forEach(track => {
                    //@ts-ignore
                    track.oninactive = () => {
                        setWebcamStatus("stopped");
                    };
                    track.onended = () => {
                        setWebcamStatus("stopped");
                    };
                });
            }

            webcamChunks = [];
            webcamRecorder = new MediaRecorder(globalWebcamStream, { mimeType: "video/webm" });

            webcamRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    webcamChunks.push(event.data);
                }
            };

            webcamRecorder.onstop = () => {
                const webcamBlob = new Blob(webcamChunks, { type: "video/mp4" });
                setWebcamBlobUrl(URL.createObjectURL(webcamBlob));
            };

            webcamRecorder.start();
            setWebcamStatus("recording");
        } catch (err) {
            console.error("Screen/Webcam permission denied:", err);
        }
    };

    const stop = (qnId: any, type: string) => {
        if (screenRecorder) {
            screenRecorder.stop();
        }

        if (webcamRecorder) {
            webcamRecorder.stop();
        }

        setScreenRecordingStatus("stopped");
        setWebcamStatus("stopped");
        setQnId(qnId);
        setType(type);
    };

    const completeRecording = () => {
        if (globalScreenStream) {
            globalScreenStream.getTracks().forEach(track => track.stop());
            globalScreenStream = null;
        }

        if (globalWebcamStream) {
            globalWebcamStream.getTracks().forEach(track => track.stop());
            globalWebcamStream = null;
        }
        setIsCompleted(true);
        setScreenRecordingStatus("idle");
        setWebcamStatus("idle");
    };

    useEffect(() => {
        if (screenBlobUrl) {
            if (qnId && type == "evaluate") {
                uploadRecording(screenBlobUrl, `screen_capture_video_${qnId}`);
                // downloadRecording(screenBlobUrl, `screen_capture_video_${qnId}`);
            }
            if (type == "revisit" && qnId) {
                uploadRecording(screenBlobUrl, `screen_capture_video_${qnId}a`);
                // downloadRecording(screenBlobUrl, `screen_capture_video_${qnId}a`);
            }
        }
    }, [screenBlobUrl]);

    useEffect(() => {
        if (webcamBlobUrl) {
            if (qnId && type == "evaluate") {
                uploadRecording(webcamBlobUrl, `webcam_capture_video_${qnId}`);
                // downloadRecording(webcamBlobUrl, `webcam_capture_video_${qnId}`);
            }
            if (type == "revisit" && qnId) {
                uploadRecording(webcamBlobUrl, `webcam_capture_video_${qnId}a`);
                // downloadRecording(webcamBlobUrl, `webcam_capture_video_${qnId}a`);
            }
        }
    }, [webcamBlobUrl]);

    const uploadRecording = async (blobUrl: string, fileName: string) => {
        if (!blobUrl) return;

        const blob = await fetch(blobUrl).then(res => res.blob());
        const file = new File([blob], `${fileName}.mp4`, { type: "video/mp4" });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("chunkIndex", String(qnId));
        formData.append("total_chunks", String(totalChunks));
        formData.append("file_name", fileName);

        try {
            await axios.post(endPoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    // const downloadRecording = (videoUrl: string, filename: string) => {
    //     if (!videoUrl) return;
    //     const a = document.createElement("a");
    //     a.href = videoUrl;
    //     a.download = filename;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    // };

    return {
        start,
        stop,
        completeRecording,
        isCompleted,
        screenRecordingStatus,
        webcamStatus,
        screenBlobUrl,
        webcamBlobUrl,
    };
};

export default useScreenVideoRecorder;