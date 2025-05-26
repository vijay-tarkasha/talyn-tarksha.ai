import { useState } from "react";

export const getDeviceStatus = () => {

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);

    const checkCamMicStatus = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            setIsCameraOn(stream.getVideoTracks().length > 0);
            setIsMicOn(stream.getAudioTracks().length > 0);

            stream.getTracks().forEach(track => track.stop());
        } catch (err) {
            console.log('Error accessing media devices:', err);
            setIsCameraOn(false);
            setIsMicOn(false);
        }
    };

    return { checkCamMicStatus, isCameraOn, isMicOn };
}