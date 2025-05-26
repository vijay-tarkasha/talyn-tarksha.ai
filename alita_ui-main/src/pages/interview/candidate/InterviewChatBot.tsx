import { useDisclosure } from '@mantine/hooks';
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BuildImg from '../../../../public/images/buildimg.png';
import webCamImg from '../../../../public/images/webcam.png';
import { useHandleError } from "../../../components/util/util";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { exitFullscreen } from "./FullScreen";
import { InterviewCompletionPage } from './InterviewCompletionPage';
import './InterviewPageX.css';
import { InterviewQnPage } from "./InterviewQnPage";
import { clearAuthInfo } from "./LocalAuthInfo";
import Timer from "./Timer";
import useScreenVideoRecorder from './useScreenVideoRecorder';
import { Button, Modal } from '@mantine/core';
import { IoReload } from "react-icons/io5";

const InterviewChatBot = () => {
    const location = useLocation();
    const { interviewQns, token, domain, data, candidateName, time, jobTitle, isRecording, } = location?.state || {};
    const { handle500Error } = useHandleError();
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [interOver, setInterOver] = useState<boolean>();
    const submitEndpoint = domain + ServiceEndpoint.interview.submit;
    const [onTimeOut, setTimeOut] = useState<(() => void) | null>(null);
    const title = jobTitle ? jobTitle : "Candidate";
    const [opened, { open, close }] = useDisclosure(false);
    const [warnModalOpened, { open: warnModalOpen, close: warnModalClose }] = useDisclosure(false);

    const { start, stop, completeRecording, screenRecordingStatus, webcamStatus, isCompleted } = useScreenVideoRecorder(
        { totalChunks: interviewQns?.length, token, domain, candidateId: data?.id });

    useEffect(() => {
        if (localStorage.getItem("int_domain")) {
            if (isRecording == true) {
                start();
            }
        }
    }, [isRecording]);

    useEffect(() => {
        if (!isCompleted)
            if (screenRecordingStatus != 'recording' && webcamStatus != 'recording') {
                warnModalOpen();
            }
    }, [screenRecordingStatus != 'recording' && webcamStatus != 'recording'])

    //TODO: Language Swicth for Speechtotext
    // const getAudioLanguage = (lang?: string) => {
    //     const language = lang || localStorage.getItem('language') || 'en';
    //     return language && language == 'ta' ? 'ta-IN' : language == 'hi' ? 'hi-IN' : 'en-US';
    // }

    // const [audioLang, setAudioLang] = useState(getAudioLanguage());

    // useEffect(() => {
    //     i18next.on('languageChanged', (lang: string) => {
    //         setAudioLang(getAudioLanguage(lang))
    //     });

    //     return () => i18next.off('languageChanged');
    // }, [])

    const handleSubmit = async () => {
        if (localStorage.getItem("int_domain")) {
            exitFullscreen();
            setLoading(true);
            localStorage.removeItem('timer');
            const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.logout.api;
            axios.post(submitEndpoint, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((d) => {
                const req = {
                    refresh: localStorage.getItem("int_refresh")
                }
                axios.post(endPoint, req, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then((s: any) => {
                    toast.success(s.data.message)
                    clearAuthInfo()
                    localStorage.removeItem('loginKey');
                    completeRecording();
                    toast.success(d.data.message)
                    navigate("/interview/feedback", { state: { data, token, domain } });
                }).catch((res: any) => {
                    setLoading(false)
                    if (res) {
                        toast.error(res.response.data.message)
                        close();
                    } else
                        handle500Error(res?.response?.data?.status_code, res?.status)
                    clearAuthInfo()
                    localStorage.removeItem('loginKey')
                })
                setLoading(false);
                close();
                setInterOver(true);
            }).catch((res: any) => {
                setLoading(false)
                if (res) {
                    toast.error(res.response.data.message)
                    close();
                } else
                    handle500Error(res?.response?.data?.status_code, res?.status)
            })
        }
        else {
            close();
            toast.error("The interview is already completed.")
        }
    }

    useEffect(() => {
        setTimeOut(() => handleSubmit);
    }, [setTimeOut]);

    const [_isTabSwitched, setIsTabSwitched] = useState(false);

    const handleKeyDown = (event: any) => {
        const key = event.key

        if (event.altKey && key === 'Tab') {
            alert('You pressed alt or tab.');
            setIsTabSwitched(true);
        }

        if (event.ctrlKey && key === 'Shift' && key === 'I' || key === 'F12') {
            alert('You pressed ctrl + shift + I or f12.');
            setIsTabSwitched(true);
        }

        if (event.key === 'Escape') {
            alert('You pressed Esc.');
            setIsTabSwitched(false);
        }
    };

    useEffect(() => {
        const handlePrevent = (event: any) => {
            event.preventDefault();
        };
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (document.visibilityState == "hidden") {
                    alert('You switched tabs.');
                    setIsTabSwitched(true);
                }
            }
        };

        document.addEventListener('copy', handlePrevent);
        document.addEventListener('cut', handlePrevent);
        document.addEventListener('paste', handlePrevent);
        document.addEventListener('contextmenu', handlePrevent);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('copy', handlePrevent);
            document.removeEventListener('cut', handlePrevent);
            document.removeEventListener('paste', handlePrevent);
            document.removeEventListener('contextmenu', handlePrevent);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (<>
        {localStorage.getItem("int_domain") ?
            <div className="px-0 md:px-20 xl:px-90 h-[100%]">
                <div className="flex items-center justify-between instruction-header h-[100px]">
                    <div className="w-[100px]">
                        <img src={BuildImg} alt="company" className="h-full" />
                    </div>
                    <h3 className="text-base md:text-xl font-semibold text-center">Interview for {title}</h3>
                    <div style={{ paddingRight: '2em', minWidth: '115px' }}>
                        {!interOver && <Timer submit={onTimeOut} time={time} />}
                    </div>
                </div>
                <div className="chatbot-body">
                    <div className="chatbot-container relative" onKeyDown={handleKeyDown}>
                        {screenRecordingStatus == 'recording' && webcamStatus == 'recording'
                            ? <InterviewQnPage interviewQns={interviewQns} token={token} domain={domain}
                                opened={opened} close={close} open={open} start={start}
                                stop={stop} candidateName={candidateName} handleSubmit={handleSubmit} loading={loading} />
                            : <Modal opened={warnModalOpened} onClose={warnModalClose} withCloseButton={false} centered closeOnClickOutside={false}>
                                <div className="flex items-center gap-5 m-5">
                                    <div className="w-15 cursor-pointer">
                                        <img src={webCamImg} alt="company" className="h-8" />
                                    </div>
                                    <p>Kindly activate your webcam and microphone, and share your entire screen to participate in the interview.</p>
                                </div>
                                <div className="grid place-items-center mt-10">
                                    <Button className='filled-button' onClick={() => window.location.reload()} leftSection={<IoReload />}>Reload</Button>
                                </div>
                            </Modal>}
                    </div>
                </div>
            </div >
            : <InterviewCompletionPage />}
    </>
    );
}

export { InterviewChatBot };