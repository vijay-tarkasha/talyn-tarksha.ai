import { Button } from "@mantine/core";
import { PalmyraNewForm } from "@palmyralabs/rt-forms";
import axios from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IntImg from '../../../../public/images/int.png';
import Footer from "../../../components/Footer";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { Rating, TextArea } from "../../../template/mantineForm";
import { Header } from "./Header";
import './InterviewPageX.css';

const InterviewFeedBack = () => {
    const location = useLocation();
    const { data, domain, token } = location?.state;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const formRef = useRef<any>();
    const btnTxt: any = t("buttonLabels", { returnObjects: true })
    const interview: any = t("interview", { returnObjects: true })
    const [rating, setRating] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const endPoint = domain + ServiceEndpoint.interview.feedback;

    const handleRatingChange = (value: any) => {
        setRating(value);
    };
    const getEmojiClass = (index: number) => {
        if (rating < 3 && index === 1) return 'rating-emoji low-rating';
        if (rating >= 4 && index === 3) return 'rating-emoji high-rating';
        if (rating >= 3 && rating < 4 && index === 2) return 'rating-emoji neutral-rating';
        return 'rating-emoji';
    };

    // window.history.pushState(null, '', window.location.href);
    // window.onpopstate = function () {
    //     window.history.pushState(null, '', window.location.href);
    // };

    const handleSubmit = () => {
        setLoading(true);
        const reqBody = {
            ...formRef?.current?.getData(),
            rating: Number(formRef?.current?.getData()?.rating),
            candidate: data.id,
            jobPosting: data.jobPosting.id
        }
        axios.post(endPoint, reqBody, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((d) => {
            if (d) {
                setLoading(false)
                document.exitFullscreen();
                navigate('/interview/over')
                // toast.success(d.data.message)
            }
        }).catch((res) => {
            setLoading(false)
            if (res)
                toast.error(res?.response?.data?.message)
        })
    }

    return <>
        <div className="px-0 lg:px-50">
            <Header />
            <div className="min-h-[calc(100vh-150px)] overflow-y-auto overflow-x-hidden  md:flex justify-center items-center px-5 md:px-0 pb-15">
                <div>
                    <h3 className="text-center mt-5 text-base md:text-xl font-semibold">{interview?.thanku}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
                        <div className='w-full h-full flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-6'>
                            <PalmyraNewForm endPoint={''} ref={formRef}>
                                <TextArea attribute="review" label={interview?.care} minRows={5} autosize
                                    validRule={"string"} variant="filled" placeholder={interview?.care}
                                    resize="vertical" />
                                <div className="py-3">
                                    <div className="rating-label">{interview?.rating}</div>
                                    <Rating attribute="rating" size={'xl'} defaultValue={rating}
                                        onChange={handleRatingChange} />
                                </div>
                            </PalmyraNewForm>
                            <div className='flex items-center gap-5 py-3'>
                                <BsEmojiFrown className={getEmojiClass(1)} size={30} />
                                <BsEmojiNeutral className={getEmojiClass(2)} size={30} />
                                <BsEmojiSmile className={getEmojiClass(3)} size={30} />
                            </div>
                            <div className="flex items-center justify-center w-full mt-5">
                                <Button className={'filled-button'} onClick={handleSubmit}
                                    loading={loading} loaderProps={{ type: 'dots' }}>{btnTxt?.sub}</Button>
                            </div>
                        </div>
                        <div className='hidden md:grid place-items-center h-full mt-8 md:mt-0'>
                            <div className='interview-rating-img-content'>
                                <img src={IntImg} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <Footer width='100%' />
        </div>
    </>
}

export { InterviewFeedBack };
