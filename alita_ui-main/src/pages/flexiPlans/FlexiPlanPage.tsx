
import { useTranslation } from 'react-i18next';
import Logo from '../../../public/images/tallogo.png';
import Footer from '../../components/Footer';
import FlexiPlanCardView from "./FlexiPlanCardView";
import './FlexiPlanPage.css';

const FlexiPlanPage = () => {
    const { t } = useTranslation();
    const flexi: any = t('flexiPlanPage', { returnObjects: true });
    return (<>
        <div className='plan-page-container'>
            <div>
                <div className="plan-page-header container">
                    <div className=''>
                        <img src={Logo} className='w-30 md:w-30 lg:w-30 rounded auth-logo'/>
                    </div>
                    <div>
                        {flexi?.title}
                    </div>
                    <div></div>
                </div>
                <div className="flexi-plan-content">
                    <div className='plan-card-view-img-container'>
                        <FlexiPlanCardView />
                    </div>
                </div>
            </div>
        </div>
        <div style={{
            position: 'fixed', bottom: 0, left: 0, width: '100%'
        }}>
            <Footer width='100%' />
        </div>
    </>
    )
}

export default FlexiPlanPage