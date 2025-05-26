
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

export const MobileRegex = /^(\+91\s?)?[6-9][0-9]{4}\s?[0-9]{5}$/;

export const LocationRegex = /^(?![.,])(?!(.*(\d{5,}[-\d]*|\d{4}[-\d]{5,}|[-]{2}|(\d{1}[-]){2,}|(\d{1,}[-/]){3,}|[.,]{3,}))).*[a-zA-Z0-9\s,.-]+$/;

export const UrlRegex = /^(https:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?)$|^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#?&=_-]*)*$/;


import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const useHandleError = () => {
    const { t } = useTranslation();

    const handle500Error = (res: any, errorCode: any) => {
        const errorTexts: any = t('toastMsg', { returnObjects: true });

        const error = res?.result;

        if (res?.status_code == 500 || errorCode == 500) {
            if (error && Object.keys(error).length > 0) {
                if (error.mobile) toast.error(errorTexts?.errorMsg?.invalidMobile);
                if (error.email) toast.error(errorTexts?.errorMsg?.invalidEmail);
                // else if (!error.mobile && !error.email) {
                //     toast.error(error)
                // }
            } else {
                toast.error(res?.message || errorTexts?.reqFail);
            }
        } else {
            toast.error(res?.message);
        }
        // if (res?.status_code == 500 && errorCode == 500) {
        //     if (error && Object.keys(error).length > 0) {
        //         if (error.mobile)
        //             toast.error(errorTexts?.errorMsg?.invalidMobile)
        //         if (error.email)
        //             toast.error(errorTexts?.errorMsg?.invalidEmail)
        //     } else {
        //         toast.error(res?.message)
        //     }

        // }
        // else if (res?.status_code == 500) {
        //     if (error != null && error.length > 0) {
        //         if (error.mobile)
        //             toast.error(errorTexts?.errorMsg?.invalidMobile)
        //         if (error.email)
        //             toast.error(errorTexts?.errorMsg?.invalidEmail)
        //     } else {
        //         toast.error(res?.message)
        //     }
        // } 
        // else if (errorCode == 500) {
        //     toast.error(errorTexts?.reqFail);
        // } else {
        //     toast.error(res?.message)
        // }
    };

    return { handle500Error };
};

export { useHandleError };


