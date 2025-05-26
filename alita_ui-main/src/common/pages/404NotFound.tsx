import { Button } from '@mantine/core';
import { useNavigation } from '../../wire/errorToast';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
    const { navigateTo } = useNavigation();
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    
    return (
        <div className="page-not-found-container">
            <div>
                <div className="error-404">404</div>
                <div className="error-404-text">Oops! Page not found</div>
                <div className="btn-container">
                    <Button className="filled-button"
                        onClick={() => navigateTo("/app/dashboard")}>{btnTexts?.bToHome}</Button>
                </div>
            </div>
        </div>
    )
}

export { PageNotFound }
