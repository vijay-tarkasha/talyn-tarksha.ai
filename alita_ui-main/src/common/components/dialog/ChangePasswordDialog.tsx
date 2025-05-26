import { Button, Modal } from "@mantine/core";
import { ISaveForm, PalmyraForm } from "@palmyralabs/rt-forms";
import axios from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { PasswordRegex, useHandleError } from "../../../components/util/util";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { Password } from "../../../template/mantineForm";

interface passwordInput {
    isOpen?: any;
    onClose?: any;
}

function ChangePasswordDialog(props: passwordInput) {
    const formRef = useRef<ISaveForm>(null);
    const { handle500Error } = useHandleError();
    const openDialog = props.isOpen;
    const closeDialog = props.onClose;
    const username = localStorage.getItem("user_name");
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [isValid, setValid] = useState<boolean>(false);
    const [pwd, setPwd] = useState<string>('')
    const [rePwd, setRePwd] = useState<string>('')
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const changePwdTexts: any = t('changePassword', { returnObjects: true });
    const rpfTexts: any = t('authPage.resetPwdForm', { returnObjects: true });
    const errorTexts: any = t('toastMsg', { returnObjects: true });
    const pwdApi = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.password.forgotPwd;

    const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.password.resetPwd;

    const handleSubmit = () => {
        const requestData = formRef?.current?.getData();
        const pwdReq = { username }

        axios.post(pwdApi, pwdReq).then((d) => {
            if (d) {
                const url = d.data.message;
                const urlParts = url.split(' ');
                const actualUrl = urlParts[urlParts.length - 1];
                const urlParams: any = new URLSearchParams(actualUrl?.split('?')[1]);
                const changePwdReq: any = {
                    uid: urlParams.get('uid'),
                    token: urlParams.get('token'),
                    password: requestData.password
                }

                axios.post(endPoint, changePwdReq).then((s) => {
                    if (s) {
                        toast.success(errorTexts?.pwdMsg)
                        closeDialog();
                    }
                }).catch((res) => {
                    if (res) {
                        setLoading(false)
                        const error = res.response.data.message
                        toast.error(error)
                    } else
                        handle500Error(res?.response?.data?.status_code, res?.status)
                })
            }
        }).catch((res: any) => {
            if (res) {
                setLoading(false)
                const error = res.response.data.message
                toast.error(error)
            } else
                handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }

    const handleDialogClick = (event: any) => {
        event.stopPropagation();
    };

    const handleKeyClose = (event: any) => {
        if (event.keyCode === 27) {
            closeDialog();
        }
    }

    const pwdChange = (e: any) => {
        if (e) {
            setPwd(e.target.value)
        }
    }

    const rePwdChange = (e: any) => {
        if (e) {
            setRePwd(e.target.value)
        }
    }

    const error = pwd == rePwd ? '' : rePwd && errorTexts.errorMsg.mismatch

    return (
        <div>
            <Modal className="reset-pwd-dialog" opened={openDialog} onClick={handleDialogClick} centered
                onClose={closeDialog} onKeyDown={handleKeyClose} title={changePwdTexts.title} size={600}
                transitionProps={{ transition: 'fade', duration: 200 }}>
                <PalmyraForm ref={formRef} onValidChange={setValid}>
                    <div className='login-textfield-row'>
                        <Password attribute='password' placeholder='xxxxxx' onChange={pwdChange}
                            variant='filled' size='lg' radius={'md'} label={rpfTexts?.label?.pwd}
                            regExp={{
                                regex: PasswordRegex,
                                errorMessage: errorTexts?.errorMsg?.invalidPwd
                            }} required invalidMessage={errorTexts?.errorMsg?.req} />
                    </div>
                    <div className='login-textfield-row'>
                        <Password attribute='re-password' placeholder='xxxxxx' onChange={rePwdChange}
                            variant='filled' size='lg' radius={'md'} label={rpfTexts?.label?.rePwd}
                            required invalidMessage={errorTexts?.errorMsg?.req} />
                        {error && <span className='error-text'>
                            {error}
                        </span>}
                    </div>

                    <div className='dialog-form-btn-container'>
                        <Button onClick={closeDialog}
                            className='py-cancel-filled-button'
                            leftSection={<IoMdClose className="button-icon" />}>
                            {btnTexts.cancel}
                        </Button>
                        <Button
                            loading={loading} loaderProps={{ type: 'dots' }}
                            disabled={!isValid}
                            className={!isValid ? 'disabled-button' : 'filled-button'}
                            onClick={handleSubmit}
                            leftSection={<FaCheck className="button-icon" />}>
                            {btnTexts.profile.chPwd}
                        </Button>
                    </div>
                </PalmyraForm>
            </Modal>
        </div >
    );
}

export default ChangePasswordDialog;