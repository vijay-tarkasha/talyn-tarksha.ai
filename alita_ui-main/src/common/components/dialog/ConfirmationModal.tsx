import { Button, Modal } from "@mantine/core"
import { useTranslation } from "react-i18next";

interface IInput {
    opened: any,
    loading?: boolean,
    submit: any,
    close: any,
    description: any
}

const ConfirmationModal = (props: IInput) => {
    const { opened, submit, loading, close, description } = props;
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const dialogContent: any = t('interview', { returnObjects: true });

    return <>
        <Modal onClose={close} opened={opened} centered title={dialogContent?.confirmDialog?.title}
            transitionProps={{ transition: 'fade', duration: 200 }}>
            <div className="text-sm md:text-base">
                {description}
            </div>
            <div>
            </div>
            <div className="flex items-center gap-2 justify-center mt-5">
                <Button onClick={submit} className='filled-button'
                    loading={loading} loaderProps={{ type: 'dots' }}>
                    {btnTexts?.yes}
                </Button>
                <Button className='py-cancel-filled-button' onClick={close}>
                    {btnTexts?.no}
                </Button>
            </div>
        </Modal>
    </>
}

export { ConfirmationModal }