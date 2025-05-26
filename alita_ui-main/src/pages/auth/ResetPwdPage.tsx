import AuthForm from "../../components/authForm/AuthForm"
import ResetPwdForm from "../../common/components/auth/ResetPwdForm";
import { useTranslation } from "react-i18next";
import LoginReset from '../../../public/images/loginreset.jpg'

const ResetPwdPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <AuthForm formlet={ResetPwdForm} title={t('authPage.resetPwdForm.title')} img={LoginReset} />
    </div>
  )
}

export default ResetPwdPage
