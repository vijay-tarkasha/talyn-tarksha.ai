import AuthForm from "../../components/authForm/AuthForm"
import ForgotPwdForm from "../../common/components/auth/ForgotPwdForm";
import { useTranslation } from "react-i18next";
import LoginForgot from '../../../public/images/loginforgot.jpg'

const ForgotPwdPage = () => {
  const { t } = useTranslation();
  const forgotPwdTexts: any = t('authPage.forgotPwdForm', { returnObjects: true });
  
  return (
    <div>
      <AuthForm formlet={ForgotPwdForm} title={forgotPwdTexts.title} img={LoginForgot} />
    </div>
  )
}

export default ForgotPwdPage