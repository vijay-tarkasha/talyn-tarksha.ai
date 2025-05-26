import { useTranslation } from "react-i18next";
import AuthForm from "../../components/authForm/AuthForm"
import AuthVerifyForm from './../../common/components/auth/AuthVerifyForm';
import LoginImage from '../../../public/images/loginauth.jpg';

const AuthVerifyPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <AuthForm formlet={AuthVerifyForm} title={t('authPage.authVerifyForm.title')} img={LoginImage} />
    </div>
  )
}

export default AuthVerifyPage;