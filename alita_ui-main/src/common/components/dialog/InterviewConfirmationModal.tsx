import { Button, Modal } from "@mantine/core"
import { useTranslation } from "react-i18next";
import '../../../pages/interview/candidate/InterviewPage.css'
import { FaCheckCircle } from "react-icons/fa";

interface IInput {
    opened: any,
    loading?: boolean,
    submit: any,
    close: any,
    description: any
}

const InterviewConfirmationModal = (props: IInput) => {
    const { opened, submit, loading, close, description } = props;
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const dialogContent: any = t('interview', { returnObjects: true });

    return <>
        <Modal onClose={close} opened={opened} centered title={dialogContent?.confirmDialog?.interCom}
            closeOnEscape={false} closeOnClickOutside={false} withCloseButton={false} >
            <div className="interview-confirm-text">
                {description}
            </div>
            <div>
            </div>
            <div className="interview-confirm-content">
                <Button onClick={submit} className='interview-confirm-button'
                    loading={loading} loaderProps={{ type: 'dots' }}
                    leftSection={<FaCheckCircle className="button-icon"/>}>
                    {btnTexts?.sub}
                </Button>
            </div>
        </Modal>
    </>
}

export { InterviewConfirmationModal }