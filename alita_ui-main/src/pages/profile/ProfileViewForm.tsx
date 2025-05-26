import { Button } from "@mantine/core";
import { IEndPoint } from "@palmyralabs/palmyra-wire";
import { FieldGroupContainer, PalmyraViewForm } from "@palmyralabs/rt-forms";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUserEdit } from "react-icons/fa";
import { IoMdUnlock } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { TextField } from "../../template/mantineForm";
import { useTenantFormStore } from "../../wire/AppStoreFactory";
import { ConfirmationModal } from "../../common/components/dialog/ConfirmationModal";
import { useDisclosure } from '@mantine/hooks';
import { useHandleError } from "../../components/util/util";
import ProfileImage from "../../components/widget/ProfileImage";

const ProfileViewForm = () => {
    const navigate = useNavigate();
    const { handle500Error } = useHandleError();
    const [opened, { open, close }] = useDisclosure(false);
    const { t } = useTranslation();
    const [userData, setUserData] = useState<any>({});

    const apiEndpoint = ServiceEndpoint.company.restApi;
    const store = useTenantFormStore(apiEndpoint);
    const btnTexts: any = t("buttonLabels", { returnObjects: true })
    const profileTexts: any = t("profile", { returnObjects: true })

    const updatePassword = () => {
        open();
    }

    const goToEditPage = () => {
        navigate("/app/profile/edit", { state: { userData: userData } })
    }

    const endPoint: IEndPoint = {
        get: apiEndpoint,
        query: apiEndpoint, put: apiEndpoint,
        post: apiEndpoint
    }

    useEffect(() => {
        store.get({}).then((d) => {
            if (d)
                setUserData(d)
        }).catch((res) => {
            handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }, [])

    return (
        <div className="page-right-left-container">
            <div className="sticky top-0 bg-white p-2 z-50 md:flex items-center justify-between">
                <div className="text-base md:text-xl font-semibold">
                    {profileTexts.title}
                </div>
                <div className="md:flex items-center gap-2 mt-2 md:mt-0">
                    <div className="flex md:block item-center justify-center">
                        <Button onClick={updatePassword}
                            className="filled-button"
                            leftSection={<IoMdUnlock className="button-icon" />}>
                            {btnTexts.profile.upPwd}
                        </Button>
                    </div>
                    <div className="mt-3 md:mt-0 flex md:block item-center justify-center">
                        <Button
                            className={'filled-button'} onClick={goToEditPage}
                            leftSection={<FaUserEdit className="button-icon" />}>
                            {btnTexts.edit}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="profile-avathar">
                    {/* <div className="cursor-pointer h-[100px] item-center flex">
                        <ProfileImage name={userData?.company_name} id={userData?.id} size={'50px'} fontSize={'16px'} />
                    </div> */}
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
                {/* <div className="profile-avathar">
                    <div className="cursor-pointer h-[100px] item-center flex">
                        <img src={BuildImg} className="h-full" />
                    </div>
                    <div className="profile-avathar-text">{userData?.company_name}</div>
                </div> */}
            </div>
            <PalmyraViewForm endPoint={endPoint} id=''>
                <FieldGroupContainer columns={2}>
                    <TextField attribute="first_name" label={profileTexts.input.fName}
                        validRule={"string"} variant="filled" readOnly placeholder={profileTexts.input.fName} />
                    <TextField attribute="last_name" label={profileTexts.input.lName}
                        validRule={"string"} variant="filled" readOnly placeholder={profileTexts.input.lName} />
                    <TextField attribute="email" label={profileTexts.input.email}
                        validRule={"email"} variant="filled" readOnly placeholder={profileTexts.input.email} />
                    <TextField attribute="mobile" label={profileTexts.input.mobile}
                        validRule={"number"} variant="filled" readOnly placeholder={profileTexts.input.mobile} />
                    <TextField attribute="emailNotify" label={profileTexts.input.notify}
                        validRule={"string"} variant="filled" readOnly placeholder={profileTexts.input.notify} />
                    <TextField attribute="status" label={profileTexts.input.status}
                        validRule={"string"} variant="filled" readOnly placeholder={profileTexts.input.status} />
                </FieldGroupContainer>
            </PalmyraViewForm>
            <ConfirmationModal close={close} description={profileTexts?.input?.confirm} opened={opened}
                submit={() => navigate('/forgotPwd')} />
        </div>
    )
}

export default ProfileViewForm