import { toast } from "react-toastify"

const showToast = (type: "error" | "success", messageKey: string, input: any = '') => {
  const { t } = useTranslation();
  const messages: any = t('toastMsg', { returnObjects: true });

  const message = input ? `${input} ${messages[messageKey]}` : messages[messageKey];

  type === "error" ? toast.error(message) : toast.success(message);
}

const showServerErrorToast = () => showToast("error", "serverError");

const alreadyExists = () => showToast("error", "dataExists");

const savedSuccessfully = (input: any) => showToast("success", "saveSuccess", input);


import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string, state?: Record<string, any>) => {
    navigate(path, { state });
  };

  return { navigateTo };

};
const getPxcel = (percentage: string, minHeight: string) => {
  if (typeof percentage === "string" && percentage.endsWith("%")) {
    const numericValue = parseFloat(percentage);
    const screenHeight = window.innerHeight;
    const computedHeight = (numericValue / 100) * screenHeight;
    const minHeightValue = parseFloat(minHeight);

    if (isNaN(minHeightValue)) {
      throw new Error("minHeight must be a valid pixel string like '200px'");
    }

    const finalHeight = Math.max(computedHeight, minHeightValue);
    return `${finalHeight}px`;
  }
  throw new Error("Input must be a percentage string like '50%'");
};

export { useNavigation, getPxcel }

export { showServerErrorToast, alreadyExists, savedSuccessfully }