import { useTranslation } from "react-i18next"

const HomePage = () => {
    const { t } = useTranslation();
    return (
        <div>
           <h1>{t('homePage.title')}</h1>
           <p>{t('homePage.description')}</p>
        </div>
    )
}

export default HomePage
