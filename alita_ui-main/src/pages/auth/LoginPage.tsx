import { useTranslation } from 'react-i18next';
import LoginForm from '../../common/components/auth/LoginForm';
import AuthForm from '../../components/authForm/AuthForm';
import './LoginX.css';
import Login from '../../../public/images/login.png';

const LoginPage = () => {
    const { t } = useTranslation();
    return (
        <div>
            <AuthForm formlet={LoginForm} title={t('authPage.loginForm.title')} img={Login} />
        </div>
    )
}

export default LoginPage;