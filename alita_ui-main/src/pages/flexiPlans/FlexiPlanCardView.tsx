import './FlexiPlanPage.css';
import { Button } from "@mantine/core";
import { MdDone } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FlexiPlanCardView = () => {
    const { t } = useTranslation();
    const cardDataList: any = t('flexiPlanPage.cards', { returnObjects: true });

    const navigate = useNavigate();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });

    const handleNavigate = () => {
        navigate("/app/dashboard")
    }
    return (
        <div className='container mx-auto mt-4 px-4'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cardDataList.map((data: any) => {
                    const isCustomPlan = data.plan == 'Custom';
                    return (
                        <div>
                            <div className="card p-3 shadow">
                                <div className="card-title">{data.title}</div>
                                <div className="card-plan"><span
                                    className={isCustomPlan ? "card-plan-custom-text" : "card-plan-text"}>{data.plan}</span>
                                    <span className="card-plan-label"> / {data.month}</span></div>
                                <div className="card-subtext">{data.subText}</div>
                                <div className="card-feature">
                                    {data.features.map((d: any) => (
                                        <div className="card-feature-list">
                                            <div><MdDone className="card-tick-icon" /></div>
                                            <div>{d.name}</div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="plan-card-button" onClick={handleNavigate}
                                    leftSection={isCustomPlan ? <BsSend /> : ''}>
                                    {isCustomPlan ? btnTexts.flexiPlan.sale : btnTexts.flexiPlan.start}
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FlexiPlanCardView