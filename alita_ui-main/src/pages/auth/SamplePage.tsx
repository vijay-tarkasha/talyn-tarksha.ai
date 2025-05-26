import { useTranslation } from 'react-i18next';
import SampleLoginform from '../../common/components/auth/SampleLoginform';
import AuthForm from '../../components/authForm/AuthForm';
import './LoginX.css';
import Login from '../../../public/images/login.png';

const SamplePage = () => {
    const { t } = useTranslation();
    return (
        <div>
            <AuthForm formlet={SampleLoginform} title={t('authPage.loginForm.title')} img={Login} />
        </div>
    )
}

export default SamplePage;