import { Button, Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from "react-icons/io";
import { useTenantFormStore } from "../../../wire/AppStoreFactory";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useHandleError } from '../../../components/util/util';

interface DialogInput {
    isOpen?: any;
    onClose?: any;
    data?: any;
    onDelete: Function;
    id?: any;
    endPoint?: any
}

function DeleteConfirmDialog(props: DialogInput) {
    const { handle500Error } = useHandleError();
    const openDialog = props.isOpen;
    const closeDialog = props.onClose;
    const onDelete = props.onDelete;
    // const id = props.id;
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const dialogContent: any = t('deleteConfirmDialog', { returnObjects: true });
    const endPoint = props.endPoint;
    const [loading, setLoading] = useState<boolean>(false);

    const store = useTenantFormStore(endPoint)

    const handleKeyClose = (event: any) => {
        if (event.keyCode === 27) {
            closeDialog();
        }
    }

    useEffect(() => {
        setLoading(false)
    }, [])

    const handleDelete = () => {
        setLoading(true)
        store.remove({})
            .then((_d: any) => {
                setLoading(false)
                onDelete();
                closeDialog()
            }).catch((res) => {
                setLoading(false)
                if (res)
                    toast.error(res?.response?.data?.message)
                else
                    handle500Error(res?.response?.data?.status_code, res?.status)
            })
    }
    const content = '';
    const dialogData = props.data;

    return (
        <div >
            <Modal opened={openDialog} onClose={closeDialog} onKeyDown={handleKeyClose} title={dialogContent?.title} centered
                transitionProps={{ transition: 'fade', duration: 200 }}>
                <div className="text-sm md:text-base flex items-center gap-2">
                    <IoIosWarning className="dialog-warn-icon" size={30} />
                    {dialogContent?.description} {dialogData} ?
                </div>
                <div>
                    {content}
                </div>
                <div className="flex items-center justify-center gap-2 mt-5">
                    <Button onClick={handleDelete} className='filled-button'
                        loading={loading} loaderProps={{ type: 'dots' }}>
                        {btnTexts?.yes}
                    </Button>
                    <Button className='py-cancel-filled-button' onClick={closeDialog}>
                        {btnTexts?.no}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default DeleteConfirmDialog;