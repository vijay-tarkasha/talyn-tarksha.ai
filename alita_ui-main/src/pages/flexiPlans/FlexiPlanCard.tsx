import { Button } from "@mantine/core";
import { MdDone } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FlexiPlanCard = (props: any) => {
    const { data } = props;
    const isCustomPlan = data.plan == 'Custom';

    const { t } = useTranslation();
    const navigate = useNavigate();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });

    const handleNavigate = () => {
        navigate("/app/dashboard")
    }

    return (<>
        <div className="plan-card">
            <div className="card-title">{data.title}</div>
            <div className="card-plan"><span
                className={isCustomPlan ? "card-plan-custom-text" : "card-plan-text"}>{data.plan}</span>
                <span className="card-plan-label"> / {data.month}</span></div>
            <div className="card-subtext">{data.subText}</div>
            <div className="card-feature">
                {data.features.map((d: any) => (
                    <div className="card-feature-list">
                        <MdDone className="plan-card-tick-icon" />
                        <div>{d.name}</div>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="plan-card-button" onClick={handleNavigate}
                leftSection={isCustomPlan ? <BsSend /> : ''}>
                {isCustomPlan ? btnTexts.flexiPlan.sale : btnTexts.flexiPlan.start}
            </Button>
        </div>
    </>)
}

export default FlexiPlanCard
