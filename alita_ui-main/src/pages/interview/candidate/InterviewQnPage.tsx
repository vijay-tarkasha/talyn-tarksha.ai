import { Button, Modal, Pagination, Textarea } from '@mantine/core';
import { StringFormat } from '@palmyralabs/ts-utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import Avatar from '../../../../public/images/AI.svg';
import Revisit from '../../../../public/images/history.png';
import Pending from '../../../../public/images/hourglass.png';
import Total from '../../../../public/images/question-mark.png';
import Submit from '../../../../public/images/sent.png';
import ProfileImage from '../../../components/widget/ProfileImage';
import { ServiceEndpoint } from '../../../config/ServiceEndpoints';
import { createOverlay, removeOverlay } from './FullScreen';
import TextToSpeech from './TextToSpeech';

interface IInput {
    interviewQns: any
    token: string
    domain: string
    candidateName: string,
    handleSubmit: any,
    loading: boolean,
    opened: boolean,
    close: any,
    open: any,
    stop: any,
    start: any
}

function chunk<T>(array: T[], size: number): T[][] {
    return array.length ? [array.slice(0, size), ...chunk(array.slice(size), size)] : [];
}

function InterviewQnPage(props: IInput) {
    const { interviewQns, token, domain, candidateName, handleSubmit, loading, opened, close, open, stop, start } = props;
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const interviewTexts: any = t('interview', { returnObjects: true });
    const data = chunk(interviewQns, 1);
    const [activePage, setPage] = useState<any>(() => {
        return parseInt(localStorage.getItem("activePage") || "1", 10);
    });
    const [userInput, setUserInput] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [subUserAns, setSubUserAns] = useState('');
    const [lastSTTResult, setLastSTTResult] = useState("");
    const lastQnIndex: boolean = data.length == activePage;

    const evaluateEndpoint = StringFormat(domain + ServiceEndpoint.interview.evaluate, { id: interviewQns?.[activePage - 1]?.id });

    const { error, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
        // googleCloudRecognitionConfig: {
        //     languageCode: language
        // }
    });

    const question: any = data[activePage - 1]?.map((item: any) => (
        <div key={item.id}>
            {item.question}
        </div>
    ));

    const questionId = data[activePage - 1]?.map((item: any) => item.id);

    useEffect(() => {
        const currentQuestion: any = data[activePage - 1]?.[0];
        if (currentQuestion) {
            setQuestionText(currentQuestion.question);
        }
        if (error)
            <p>Web Speech API is not available in this browser</p>
    }, [activePage, data]);

    const handlePaginationChange = (page: number) => {
        setPage(page);
        setUserInput('')
    }

    const handleChange = (e: any) => {
        const v = e.target.value;
        setUserInput(v);
    };

    const handleSubmitInterview = () => {
        handleSubmit();
    }

    useEffect(() => {
        const checkFullscreen = () => {
            if (!document.fullscreenElement) {
                createOverlay();
            }
        };
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                createOverlay();
            } else {
                removeOverlay();
            }
        };
        checkFullscreen();
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem("activePage", activePage.toString());
        const savedAnswers = JSON.parse(localStorage.getItem("submittedUserAns") || "{}");
        setSubUserAns(savedAnswers[activePage] || "");

        const revistedAnswers = JSON.parse(localStorage.getItem("revisitedUserAns") || "{}");
        // setSubUserAns(revistedAnswers[activePage] || "");
        setUserInput(revistedAnswers[activePage] || "");
    }, [activePage]);

    const removeRevisitAns = (key: string) => {
        const storedAnswers = JSON.parse(localStorage.getItem("revisitedUserAns") || "{}");
        if (storedAnswers.hasOwnProperty(key)) {
            delete storedAnswers[key];
            localStorage.setItem("revisitedUserAns", JSON.stringify(storedAnswers));
        }
    };

    const evaluateAnswer = () => {
        stop(String(questionId), "evaluate");
        if (localStorage.getItem("int_domain")) {
            removeRevisitAns(activePage);
            setUserInput('');
            let submittedAns = JSON.parse(localStorage.getItem('submittedAns') || '[]') || [];
            if (!submittedAns.includes(activePage)) {
                submittedAns.push(activePage);
            }
            localStorage.setItem("submittedAns", JSON.stringify(submittedAns));
            const savedAnswers = JSON.parse(localStorage.getItem("submittedUserAns") || "{}");
            savedAnswers[activePage] = userInput;
            localStorage.setItem("submittedUserAns", JSON.stringify(savedAnswers));
            // setPage((prevPage: any) => {
            //     if (prevPage == data.length)
            //         return prevPage
            //     else
            //         return prevPage + 1
            // });
            setSubUserAns(userInput);
                start();
            const req = {
                candidate_response: userInput.replace(/\n/g, ' ').trim()
            };
            axios.post(evaluateEndpoint, req, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).catch((res: any) => {
                const errorCode = res?.response?.data?.status_code;
                if ([500, 404].includes(errorCode) || res?.response?.status) {
                    toast.error(res.response.data.message);
                }
            });
        } else toast.error("The interview is already completed.")
    };

    // const [language, setLanguage] = useState("en-US");

    const revisitQn = () => {
        stop(String(questionId), "revisit");
        start();
        const storedRevisitData = localStorage.getItem('revisitQn');
        let revisitQn = JSON.parse(storedRevisitData || '[]') || [];
        revisitQn.push(activePage);
        localStorage.setItem('revisitQn', JSON.stringify(revisitQn));
        const revisitedAnswers = JSON.parse(localStorage.getItem("revisitedUserAns") || "{}");
        revisitedAnswers[activePage] = userInput;
        localStorage.setItem("revisitedUserAns", JSON.stringify(revisitedAnswers));

        setPage((prevPage: any) => {
            if (prevPage == data.length)
                return prevPage
            else
                return prevPage + 1
        });
    };

    useEffect(() => {
        if (results.length > 0) {
            const latestResult = results[results.length - 1];
            const newSpeechText = typeof latestResult === "object" && "transcript" in latestResult
                ? latestResult.transcript : latestResult;
            if (newSpeechText !== lastSTTResult) {
                setUserInput((prevInput) => prevInput + ' ' + newSpeechText);
                setLastSTTResult(newSpeechText);
            }
        }
    }, [results]);

    const submittedAnsData: any = localStorage.getItem("submittedAns");
    const revisitedUserAns: any = localStorage.getItem("revisitedUserAns");
    const revisitQnsCount = revisitedUserAns != null && Object.keys(JSON.parse(revisitedUserAns)).length;
    const submittedAnsCount = JSON.parse(submittedAnsData)?.length;

    const getData = (key: string) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch {
            return [];
        }
    };

    const getItemProps = (page: number) => {
        const submittedAns = getData('submittedAns');
        const revisitAns = getData('revisitQn');

        return {
            className: `qn-pagination-btn ${submittedAns.includes(page) ? "qn-submit"
                : revisitAns.includes(page) ? "qn-revisit" : ""}`
        };
    };

    const interviewStatus = [
        { icon: Total, label: "Total", value: data.length },
        { icon: Pending, label: "Pending", value: data.length - (revisitQnsCount + submittedAnsCount) },
        { icon: Revisit, label: "Revisited", value: revisitQnsCount },
        { icon: Submit, label: "Submitted", value: submittedAnsCount },
    ]

    return (<>
        <div className='grid place-items-center mb-5 interview-qns h-[50px]'>
            <Pagination total={data.length} value={activePage} onChange={handlePaginationChange} mt="sm"
                getItemProps={(page) => getItemProps(page)}>
            </Pagination>
        </div>

        <div key={activePage}>
            <div className='overflow-y-auto h-[calc(100vh-410px)]'>
                <div className=''>
                    {question && <div className='flex gap-2'>
                        <img src={Avatar} alt="Avatar" className='h-[40px]' />
                        <div className='interview-qn-bg text-sm md:text-base p-[10px] min-w-[65%] max-w-[65%]'>
                            {question}
                            <TextToSpeech text={questionText} />
                        </div>
                    </div>}
                </div>
                {subUserAns && <div className='flex justify-end mt-7 w-[100%] gap-2'>
                    <div className='interview-ans-bg text-sm md:text-base p-[10px] min-w-[65%] max-w-[65%]'>
                        <pre className="whitespace-pre-wrap">{subUserAns}</pre>
                    </div>
                    <div>
                        <ProfileImage name={candidateName} id={activePage} className={"profile_md"} />
                    </div>
                </div>}
            </div>
            <div className="bottom-0 mb-5 w-[100%] h-[200px] interview-text-area">
                <div className='mt-5'>
                    <Textarea value={userInput} onChange={handleChange} placeholder='Type a answer...' autosize
                        rightSection={<div onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                            <div className='mr-5'>{isRecording ?
                                <div className='shadow-md shadow-blue-500/50 p-1 rounded-sm cursor-pointer'>
                                    <FaMicrophone className='text-base' />
                                </div> :
                                <div className='shadow-md p-1 rounded-sm cursor-pointer'>
                                    <FaMicrophoneSlash className='text-xl' />
                                </div>}
                            </div>
                        </div>} minRows={3} maxRows={6} />
                </div>
                <div className="flex items-center justify-center mt-5 gap-5">
                    <Button disabled={getData('submittedAns').includes(activePage)}
                        className={getData('submittedAns').includes(activePage) ? 'disabled-button' : 'filled-button'}
                        onClick={revisitQn}>{btnTexts?.interview?.revisit}</Button>
                    <Button disabled={getData('submittedAns').includes(activePage)}
                        className={getData('submittedAns').includes(activePage) ? 'disabled-button' : 'filled-button'}
                        onClick={evaluateAnswer}>{btnTexts?.interview?.submit}</Button>
                    {lastQnIndex && <Button
                        // disabled={!getSubmittedAns().includes(activePage)}
                        // className={!getSubmittedAns().includes(activePage) ? 'disabled-button' : 'filled-button'}
                        className='filled-button' onClick={open}> {btnTexts?.interview?.complete}</Button>}
                </div>
            </div>
        </div>

        <Modal onClose={close} opened={opened} centered title={interviewTexts?.confirmDialog?.title}
            transitionProps={{ transition: 'fade', duration: 200 }}>
            <div className='text-sm md:text-base'>{interviewTexts?.confirmDialog?.description}</div>
            {data &&
                <div className="gap-2 mt-4 grid grid-cols-2">
                    {interviewStatus.map((d, i) => (
                        <div key={i} className='flex items-center inset-shadow-2xs border-[0.1px] border-gray-200
                        p-2 gap-4 place-self-center h-15 w-35 justify-between'>
                            <div>
                                <img src={d.icon} alt="Total"
                                    className='h-8'
                                    style={{
                                        opacity: 1,
                                        transition: "opacity 0.3s ease"
                                    }} /></div>
                            <div className='text-sm'>
                                <div className='text-gray-500'>{d.label}</div>
                                <div className='text-right'>{d.value || "0"}</div>
                            </div>
                        </div>))}
                </div>
            }
            <div className="flex items-center justify-center gap-2 mt-5">
                <Button onClick={handleSubmitInterview} className='filled-button'
                    loading={loading} loaderProps={{ type: 'dots' }}
                    leftSection={<FaCheckCircle className="button-icon" />}>
                    {btnTexts?.sub}
                </Button>
            </div>
        </Modal>
    </>
    );
}

export { InterviewQnPage };