import { Button } from '@mantine/core'
import { IEndPoint } from '@palmyralabs/palmyra-wire'
import { FieldGroupContainer, PalmyraEditForm } from '@palmyralabs/rt-forms'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheck } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { MobileRegex, useHandleError } from '../../components/util/util'
import ButtonSwitch from '../../components/widget/ButtonSwitch'
import ProfileImage from '../../components/widget/ProfileImage'
import { ServiceEndpoint } from '../../config/ServiceEndpoints'
import { TextField } from '../../template/mantineForm'
import { IPageInput } from '../../template/Types'
import { useTenantFormStore } from '../../wire/AppStoreFactory'
import { useNavigation } from '../../wire/errorToast'
import './ProfilePageX.css'

const ProfileEditPage = (props: IPageInput) => {
    const { navigateTo } = useNavigation();
    const { handle500Error } = useHandleError();
    // const [selectedProImage, setSelectedProImage] = useState(ProfilImg);
    // const [selectedBulImage, setSelectedBulImage] = useState(BuildImg);
    const [isValid, setValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();
    const formRef: any = useRef();
    const location = useLocation();
    const btnTexts: any = t("buttonLabels", { returnObjects: true })
    const profileTexts: any = t("profile", { returnObjects: true })
    const userData = location?.state?.userData;

    const errorTexts: any = t('toastMsg', { returnObjects: true });
    const apiEndpoint = ServiceEndpoint.profile.update;
    const getApiEndpoint = ServiceEndpoint.company.restApi; // ServiceEndpoint.profile.restApi;

    const endPoint: IEndPoint = {
        get: getApiEndpoint,
        query: getApiEndpoint, put: apiEndpoint,
        post: apiEndpoint
    }

    const store = useTenantFormStore(apiEndpoint);

    const handleSelectionChange = (value: string) => {
        console.log(`Selection changed to: ${value}`);
    };
    const handleBack = () => {
        navigateTo('../' + props.pageName);
    }
    // const handleFileChange = (file: any, type: string) => {
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file);
    //         if (type === 'profile') {
    //             setSelectedProImage(imageUrl);
    //         } else if (type === 'build') {
    //             setSelectedBulImage(imageUrl);
    //         }
    //     }
    // };

    const handleSave = () => {
        setLoading(true);
        const mobile = formRef?.current?.getData()?.mobile
        let cleanedMobile = mobile?.replace(/^\+91\s*/, '').replace(/\s/g, '');

        const reqBody = {
            ...formRef?.current?.getData(),
            mobile: cleanedMobile && "+91" + cleanedMobile
        }
        store.put(reqBody).then((d: any) => {
            if (d) {
                toast.success(d.message);
                handleBack()
            }
        }).catch((res) => {
            setLoading(false);
            if (res) {
                const error = res?.response?.data?.result;
                const nullError = res?.response?.data?.result?.non_field_errors?.[0];
                if (error) {
                    if (error.mobile)
                        toast.error(errorTexts?.errorMsg?.invalidMobile)
                    if (nullError) {
                        toast.error(nullError)
                    }
                } else {
                    handle500Error(res?.response?.data?.status_code, res?.status)
                }
            } else {
                handle500Error(res?.response?.data?.status_code, res?.status)
            }

        })
    }

    return (
        <div className="page-content-container">
            <div className="page-right-left-container">
                <div className="sticky top-0 bg-white p-2 z-50 md:flex items-center justify-between">
                    <div className="text-base md:text-xl font-semibold">
                        {profileTexts.edit.title}
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                    <div className="flex items-center gap-3 mt-[10px] mb-[15px]">
                        <div>
                            {/* <TbHome className="text-3xl header-icon" /> */}
                            <ProfileImage name={userData?.company_name} id={userData?.id} className={'profile_normal'} />
                        </div>
                        <div>
                            <span className="text-base md:text-lg font-semibold header-text">{userData?.company_name}</span>
                            <div className="text-sm sub-header-text text-gray-600">{userData?.email}</div>
                        </div>
                    </div>
                    </div>
                    {/* <FileButton onChange={(file) => handleFileChange(file, 'profile')} accept="image/*">
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
                        <div className="profile-avathar-text">{userData?.first_name}</div> */}
                    {/* <div >
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
                        <div className="profile-avathar-text">{userData?.company_name}</div>
                    </div> */}
                </div>
                <PalmyraEditForm endPoint={endPoint} id='' ref={formRef} onValidChange={setValid}>
                    <FieldGroupContainer columns={2}>
                        <TextField attribute="first_name" label={profileTexts.input.fName}
                            validRule={"string"} variant="filled" placeholder={profileTexts.input.fName} />
                        <TextField attribute="last_name" label={profileTexts.input.lName}
                            validRule={"string"} variant="filled" placeholder={profileTexts.input.lName} />
                        <TextField attribute="email" label={profileTexts.input.email} readOnly
                            validRule={"email"} variant="filled" placeholder={profileTexts.input.email} />
                        <TextField attribute="mobile" label={profileTexts.input.mobile}
                            variant="filled" required invalidMessage={errorTexts?.errorMsg?.req}
                            regExp={{ regex: MobileRegex, errorMessage: errorTexts?.errorMsg?.invalidMobile }}
                            placeholder={profileTexts.input.mobile} />
                        <div className="lg:flex items-center gap-10 w-full mt-2 button-switch">
                            <div className='w-full'>
                                <ButtonSwitch
                                    options={{ sent: btnTexts.profile.sMail, dontSent: btnTexts.profile.dontSend }} label={profileTexts.input.notify}
                                    onSelectionChange={handleSelectionChange} defaultValue="sent" />
                            </div>
                            <div className='w-full mt-2 lg:mt-0'>
                                <ButtonSwitch
                                    options={{ active: btnTexts.profile.act, deAct: btnTexts.profile.deAct }} label={profileTexts.input.status}
                                    onSelectionChange={handleSelectionChange} defaultValue="active" />
                            </div>
                        </div>
                    </FieldGroupContainer>
                </PalmyraEditForm>
            </div>
        </div>
    )
}

export default ProfileEditPage