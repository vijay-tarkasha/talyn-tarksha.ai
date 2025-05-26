import { Button, List } from "@mantine/core";
import { StringFormat } from "@palmyralabs/ts-utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BuildImg from '../../../../public/images/buildimg.png';
import Footer from "../../../components/Footer";
import { useHandleError } from "../../../components/util/util";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import './InterviewPageX.css';
import { clearAuthInfo } from "../../../Session";
import { storeAuthInfo } from "./LocalAuthInfo";

const InterviewInstructions = () => {
    const navigate = useNavigate();
    const { handle500Error } = useHandleError();
    const [queryParams, setQueryParams] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const insTexts: any = t("interview.intruction", { returnObjects: true });
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const errorTexts: any = t('toastMsg', { returnObjects: true });

    useEffect(() => {
        clearAuthInfo();
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const queryObject: any = {};
        params.forEach((value, key) => {
            queryObject[key] = value;
        });
        setQueryParams(queryObject);
    }, []);

    useEffect(() => {
        const loginKey = queryParams.login_key && queryParams.login_key;
        const localLoginKey = localStorage.getItem('loginKey');
        if (loginKey == localLoginKey) {
            return;
        }
        else {
            if (loginKey) {
                const loginEndPoint = StringFormat(ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.login.loginKeyLogin, { uuid: loginKey })
                axios.post(loginEndPoint).then((d: any) => {
                    if (d) {
                        const result = d.data.result
                        storeAuthInfo(result)
                        localStorage.setItem('loginKey', queryParams.login_key && loginKey)
                    }
                }).catch((res: any) => {
                    setLoading(false);
                    if (res.response.data.status_code == 500) {
                        toast.error(res.response.data.result)
                    }
                    handle500Error(res?.response?.data, res?.status)
                })
            }
        }
    }, [queryParams.login_key])

    const handleStart = () => {
        const intToken = localStorage.getItem("int_token")
        const intDomain = "https://" + localStorage.getItem("int_domain") + "/"
        const candidateEndpoint = intDomain + ServiceEndpoint.company.restApi
        if (localStorage.getItem("int_domain")) {
            setLoading(true);
            axios.get(candidateEndpoint, {
                headers: {
                    'Authorization': `Bearer ${intToken}`
                }
            }).then((d) => {
                if (d) {
                    const parseData = JSON.stringify(d.data.result);
                    navigate('/interview/start', { state: { userData: parseData, token: intToken, domain: intDomain } })
                }
            }).catch((res: any) => {
                setLoading(false);
                if (res && [500, 404, 401, "500", "404", "401"].includes(res?.response?.data?.status_code)) {
                    toast.error(res.response.data.result || errorTexts?.reqFail)
                }
            })
        }
        else toast.error("The interview is already completed.")
    }

    return <div>
        <div>
            <div className="page-right-left-container">
                <div className="sticky top-0 z-20 bg-white flex items-center justify-around instruction-header mt-5">
                    <div className="h-[80px] w-[80px] cursor-pointer">
                        <img src={BuildImg} alt="company" className="h-full" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold">{insTexts.title}</h3>
                    <div></div>
                </div>
                <div className="min-h-[calc(100vh-150px)] overflow-y-auto overflow-x-hidden flex items-center justify-center pb-12">
                    <div className="flex flex-col items-center justify-center w-full">
                        <List className="space-y-2" listStyleType="">
                            <List.Item className="text-sm md:text-base">1. {insTexts.two}</List.Item>
                            <List.Item className="text-sm md:text-base">2. {insTexts.three}</List.Item>
                            <List.Item className="text-sm md:text-base">3. {insTexts.four}</List.Item>
                            <List.Item className="text-sm md:text-base">4. {insTexts.five}</List.Item>
                            <List.Item className="text-sm md:text-base">5. {insTexts.six}</List.Item>
                            <List.Item className="text-sm md:text-base">6. {insTexts.seven}</List.Item>
                            <List.Item className="text-sm md:text-base">7. {insTexts.eight}</List.Item>
                        </List>
                        <div className="mt-5">
                            <Button className="filled-button" onClick={handleStart}
                                loading={loading} loaderProps={{ type: 'dots' }}>
                                {btnTexts.interview.start}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Footer width='100%' />
            </div>
        </div>

    </div>
}

export { InterviewInstructions };