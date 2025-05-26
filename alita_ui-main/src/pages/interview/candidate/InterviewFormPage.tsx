import { Box, Button, Loader, Modal, Text } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../../../common/components/dialog/ConfirmationModal";
import Footer from "../../../components/Footer";
import { useHandleError } from "../../../components/util/util";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { SectionHeader } from "../../companies/CompanyViewPage";
import { Header } from "./Header";
import './InterviewPageX.css';
import { clearQnInfo } from "./LocalAuthInfo";

const InterviewFormPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const { handle500Error } = useHandleError();
    const profileTexts: any = t("profile", { returnObjects: true });
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const interviewTexts: any = t("interview", { returnObjects: true });
    const location = useLocation();
    const navigate = useNavigate();
    const userData = location?.state?.userData && JSON.parse(location?.state?.userData);
    const token = localStorage.getItem("int_token")
    const domain = "https://" + localStorage.getItem("int_domain") + "/"
    const endPoint = domain + ServiceEndpoint.interview.restApi;
    const [opened, setOpened] = useState(false);

    const handleContinue = () => {
        setOpened(true)
    }

    const fetchInterviewQns = () => {
        if (localStorage.getItem("int_domain")) {
            //     if (isMicOn && isCameraOn) {
            setLoading(true);
            setOpened(false);
            clearQnInfo();
            axios.get(endPoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((d) => {
                if (d) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                    setLoading(false);
                    navigate('/interview', {
                        state: {
                            interviewQns: d?.data?.result, candidateName,
                            jobTitle, token, domain, time, data, isRecording: true
                        }
                    })
                }
            }).catch((res: any) => {
                setLoading(false);
                if (res.response.status || res.response.data.status_code == 500 || res.response.data.status_code == 404) {
                    if (res.response.data.message)
                        toast.error(res.response.data.message)
                    else {
                        handle500Error(res?.response?.data?.status_code, res?.status)
                    }
                }
            })
            //     }
            //     else {
            //         toast.error("Please enable your webcam and microphone and share entire screen to participate in the interview.")
            //     }
        } else {
            setOpened(false);
            toast.error("The interview is already completed.")
        }
    }

    const data = userData;
    const jobTitle = userData?.jobPosting?.job_title;
    const time = userData?.jobPosting?.screening_interview_timing;
    const qns = data?.jobPosting?.screening_questions_count;
    const candidateName = data?.name;
    // const companyName = data?.jobPosting?.company

    const fieldList = [
        { label: profileTexts.input.fName, data: userData?.name },
        { label: profileTexts.input.lName, data: userData?.lastName },
        { label: profileTexts.input.email, data: userData?.email },
        { label: profileTexts.input.mobile, data: userData?.mobile }
    ]

    return (<div>
        <div className="page-right-left-container">
            <div>
                <Header data={data} />
            </div>
            <div className="h-[calc(100vh-140px)] overflow-y-auto pb-20">
                <div className="mt-5">
                    <div className="md:flex items-center justify-between">
                        <SectionHeader
                            title={userData?.name || "--"}
                            subtitle={userData?.jobPosting?.job_title || "--"} />
                        <div className="py-3 md:py-0">
                            <div className="grid grid-cols-[auto_auto_auto] gap-x-1 items-center text-sm md:text-base">
                                <div className="text-gray-500">{interviewTexts?.totalQns}</div>
                                <div className="">:</div>
                                <div className="">{qns ? String(qns).padStart(2, '0') : "--"}</div>
                                <div className="text-gray-500">{interviewTexts?.totalTime}</div>
                                <div className="">:</div>
                                <div className="">{time ? String(time).padStart(2, '0') + " " + interviewTexts?.minutes : "--"}</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-0 md:mt-5 grid md:grid-cols-2 grid-cols-1 gap-x-20 gap-y-3 items-center">
                        {fieldList?.map((d, i) => (
                            <div className="mt-4" key={i}>
                                <label className="text-sm font-medium">
                                    {d.label}
                                </label>
                                <div className="interview-form">
                                    <span className="text-view-value-filled text-sm mt-0">
                                        {d.data || '--'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-15">
                    <Button className={'filled-button'} onClick={handleContinue}
                        loading={loading} loaderProps={{ type: 'dots' }}>{btnTexts?.interview?.continue}</Button>
                </div>
            </div>
        </div>
        <div>
            <Footer width='100%' />
        </div>
        <ConfirmationModal close={() => { setOpened(false) }} opened={opened} submit={fetchInterviewQns}
            description={interviewTexts?.confirmDialog?.conDesc} />

        <Modal opened={loading} onClose={() => { }} centered withCloseButton={false}
            transitionProps={{ transition: 'fade', duration: 200 }}>
            <div className="loading-modal">
                <Loader size="lg" color="var(--primary-color)" type="bars" />
                <Box style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Text size="lg" color="var(--primary-color)" fw={600}>
                        Preparing your interview questions...
                    </Text>
                    <Text size="sm" color="dimmed" mt="sm">
                        This might take a few moments. Please stay on this page.
                    </Text>
                </Box>
            </div>
        </Modal>
    </div>
    )
}

export default InterviewFormPage;