import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import './InterviewPageX.css';

const Timer = (props: any) => {
    const timeStart = props?.time || 30;
    const { t } = useTranslation();
    const { submit } = props
    const [timer, setTimer] = useState(() => {
        const savedTime = localStorage.getItem('timer');
        return savedTime ? parseInt(savedTime, 10) : timeStart * 60;
    });
    const errorTexts: any = t('toastMsg', { returnObjects: true });

    const getTimeParts = () => {
        let minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        let seconds = (timer % 60).toString().padStart(2, '0');
        return { minutes, seconds };
    };

    const { minutes, seconds } = getTimeParts();

    useEffect(() => {
        if (timer > 0) {
            const timeout = setTimeout(() => {
                // setTimer(timer - 1);
                setTimer((prev) => {
                    const newTime: any = prev - 1;
                    localStorage.setItem('timer', newTime);
                    return newTime;
                });
            }, 1000);
            return () => clearTimeout(timeout);
        } else {
            if (timer == 0) {
                toast.warn(errorTexts?.interTime)
                localStorage.removeItem('timer');
                submit();
            }
        }
    }, [timer]);

    // useEffect(() => {
    //     return () => {
    //         localStorage.removeItem('timer');
    //     };
    // }, []);

    const dataCls = (Number(minutes) < 3) ? 'time-data data-less' : 'time-data';

    return (
        <>
            <div className="timer-section">
                <div className="timer-field">
                    <div>
                        <div className={`${dataCls} rounded-3xl text-base md:text-2xl font-semibold px-3 py-1`}>
                            {/* <MdOutlineTimer /> */}
                            {minutes} : {seconds}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Timer;