import { useTranslation } from "react-i18next";
import SignUpForm from "../../common/components/auth/SignUpForm"
import AuthForm from "../../components/authForm/AuthForm"
import Login from '../../../public/images/login.png';

const SignUpPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <AuthForm formlet={SignUpForm} title={t('authPage.signUpForm.title')} img={Login} />
    </div>
  )
}

export default SignUpPage