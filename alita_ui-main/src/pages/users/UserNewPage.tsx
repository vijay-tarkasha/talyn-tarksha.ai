import { Button, FileButton, Tooltip } from '@mantine/core'
import { FieldGroupContainer, PalmyraForm } from '@palmyralabs/rt-forms'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheck } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { toast } from 'react-toastify'
import ProfilImg from '../../../public/images/blcnakPimg.png'
import BuildImg from '../../../public/images/buildimg.png'
import { LocationRegex, MobileRegex, useHandleError } from '../../components/util/util'
import { ServiceEndpoint } from '../../config/ServiceEndpoints'
import { TextField } from '../../template/mantineForm'
import { IPageInput } from '../../template/Types'
import { useTenantFormStore } from '../../wire/AppStoreFactory'
import { useNavigation } from '../../wire/errorToast'

const UsersNewPage = (props: IPageInput) => {
    const { navigateTo } = useNavigation();
    const { handle500Error } = useHandleError();
    const [selectedProImage, setSelectedProImage] = useState(ProfilImg);
    const [selectedBulImage, setSelectedBulImage] = useState(BuildImg);
    const [isValid, setValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const formRef: any = useRef();
    const btnTexts: any = t("buttonLabels", { returnObjects: true })
    const profileTexts: any = t("profile", { returnObjects: true })
    const usersTexts: any = t("users", { returnObjects: true })
    const errorTexts: any = t('toastMsg', { returnObjects: true });

    const apiEndpoint = ServiceEndpoint.user.addUser;
    const store = useTenantFormStore(apiEndpoint);

    const handleBack = () => {
        navigateTo('../' + props.pageName);
    }
    const handleFileChange = (file: any, type: string) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (type === 'profile') {
                setSelectedProImage(imageUrl);
            } else if (type === 'build') {
                setSelectedBulImage(imageUrl);
            }
        }
    };

    const handleSave = () => {
        setLoading(true);
        const mobile = formRef?.current?.getData()?.mobile
        let cleanedMobile = mobile?.replace(/^\+91\s*/, '').replace(/\s/g, '');

        const reqBody = {
            ...formRef?.current?.getData(),
            mobile: cleanedMobile && "+91" + cleanedMobile
        }
        store.post(reqBody).then((d: any) => {
            if (d) {
                toast.success(d.message);
                handleBack()
            }
        }).catch((res) => {
            setLoading(false);
            if (res) {
                const error = res?.response?.data?.message
                toast.error(error);
            } else
                handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }

    return (
        <div className="page-content-container">
            <div className="page-right-left-container">
                <div className="sticky top-0 bg-white z-50 md:flex items-center justify-between">
                    <div className="text-base md:text-xl font-semibold pb-2 md:pb-0">
                        {usersTexts.new.title}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleBack}
                            className="cancel-filled-button"
                            leftSection={<IoMdClose className="button-icon" />}>
                            {btnTexts.cancel}
                        </Button>
                        <Button onClick={handleSave}
                            loading={loading} loaderProps={{ type: 'dots' }}
                            disabled={!isValid} className={!isValid ? 'disable-button' : 'filled-button'}
                            leftSection={<FaCheck className="button-icon" />}>
                            {btnTexts.save}
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="profile-avathar">
                        <FileButton onChange={(file) => handleFileChange(file, 'profile')} accept="image/*">
                            {(props) => (
                                <div className="cursor-pointer h-[100px] item-center flex" {...props}>
                                    <Tooltip label={profileTexts.imgTooltip} position="right" color="var(--primary-color)"
                                        offset={{ mainAxis: -50, crossAxis: 0 }}
                                        transitionProps={{ transition: 'fade-up', duration: 300 }}>
                                        <img src={selectedProImage} alt="Profile"
                                            className='h-full'
                                            style={{
                                                opacity: selectedProImage === ProfilImg ? 0.35 : 1,
                                                transition: "opacity 0.3s ease"
                                            }} />

                                    </Tooltip>
                                </div>
                            )}
                        </FileButton>
                        {/* <div className="profile-avathar-text">{userData?.first_name}</div> */}
                    </div>
                    <div className="profile-avathar">
                        <FileButton onChange={(file) => handleFileChange(file, 'build')} accept="image/*">
                            {(props) => (
                                <div className="cursor-pointer h-[100px] item-center flex" {...props}>
                                    <Tooltip label={profileTexts.imgTooltip} position="right" color="var(--primary-color)"
                                        offset={{ mainAxis: -50, crossAxis: 0 }}
                                        transitionProps={{ transition: 'fade-up', duration: 300 }}>
                                        <img src={selectedBulImage} alt="Profile"
                                            className='h-full'
                                            style={{
                                                opacity: selectedBulImage === BuildImg ? 0.35 : 1,
                                                transition: "opacity 0.3s ease"
                                            }} />
                                    </Tooltip>
                                </div>
                            )}
                        </FileButton>
                        {/* <div className="profile-avathar-text">{userData?.company_name}</div> */}
                    </div>
                </div>
                <PalmyraForm ref={formRef} onValidChange={setValid}>
                    <FieldGroupContainer columns={2}>
                        {/* <TextField attribute="name" label={profileTexts.input.fName}
                            validRule={"string"} variant="filled" placeholder={profileTexts.input.fName} /> */}
                        <TextField attribute="email" label={profileTexts.input.email} required
                            validRule={{ rule: "email", errorMessage: errorTexts?.errorMsg?.invalidEmail }}
                            variant="filled" placeholder={profileTexts.input.email}
                            invalidMessage={errorTexts?.errorMsg?.req} />
                        <TextField attribute="mobile" label={profileTexts.input.mobile} required
                            regExp={{ regex: MobileRegex, errorMessage: errorTexts?.errorMsg?.invalidMobile }}
                            variant="filled" placeholder={profileTexts.input.mobile}
                            invalidMessage={errorTexts?.errorMsg?.req} />
                        <TextField attribute='location' variant='filled' label={profileTexts?.input?.location}
                            regExp={{ regex: LocationRegex, errorMessage: "Invalid Input" }} required
                            length={{ max: 30, errorMessage: errorTexts?.errorMsg?.max + " 30" }}
                            placeholder={profileTexts?.input?.location} invalidMessage={errorTexts?.errorMsg?.req} />
                    </FieldGroupContainer>
                </PalmyraForm>
            </div>
        </div>
    )
}

export default UsersNewPage