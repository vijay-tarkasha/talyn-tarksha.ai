import { Button } from "@mantine/core"
import { FieldGroupContainer, ISaveForm, PalmyraEditForm } from "@palmyralabs/rt-forms"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { IoIosArrowDown } from "react-icons/io";
import { TbHome } from "react-icons/tb";
import '../JobPageX.css'
import { ServerLookup, TextField } from "../../../template/mantineForm";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { toast } from "react-toastify";
import { StringFormat } from "@palmyralabs/ts-utils";
import { useHandleError } from "../../../components/util/util";

const JobEditPage = () => {
    const formRef = useRef<ISaveForm>(null);
    const { handle500Error } = useHandleError();
    const [_isValid, setValid] = useState<boolean>(false);
    const { t } = useTranslation();
    const btnTexts: any = t("buttonLabels", { returnObjects: true })
    const jobTexts: any = t('jobPage', { returnObjects: true });
    const errorTexts: any = t('toastMsg', { returnObjects: true });

    const apiEndpoint = StringFormat(ServiceEndpoint.job.byId, { domain: "aditienterprises.localhost" });

    const handleEdit = () => {
        formRef?.current?.saveData().then(() => {
            toast.success(errorTexts?.updSuccess)
        }).catch((res)=>{
            handle500Error(res?.response?.data?.status_code, res?.status)
        })
    }

    return (
        <div className="page-content-container">
            <div className="job-edit-container">
                <div className="form-header-container">
                    <div className="header-container">
                        <div className="icon-container">
                            <TbHome className="header-icon" />
                            <div>
                                <span className="header-text">UI/UX Desinger</span>
                                <div className="sub-header-text">genielabs.com</div>
                            </div>
                            <div className="form-field">
                                <PalmyraEditForm endPoint={apiEndpoint} ref={formRef} id='' onValidChange={setValid}>
                                    <TextField attribute="lobCode" label={jobTexts?.input?.lob} variant="filled"
                                        validRule={"string"} placeholder={jobTexts?.input?.lobPh} />
                                </PalmyraEditForm>
                            </div>
                        </div>
                        <div className="header-btn-container">
                            <Button onClick={handleEdit}
                                className={'filled-button'}
                                rightSection={<IoIosArrowDown className="button-icon" />}>
                                {btnTexts?.save}
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <PalmyraEditForm endPoint={apiEndpoint} ref={formRef} id='' onValidChange={setValid}>
                        <FieldGroupContainer columns={2}>
                            <TextField attribute="desc" label={jobTexts?.input?.desc} colspan={2}
                                validRule={"string"} variant="filled" placeholder={jobTexts?.input?.descPh} />
                            <ServerLookup attribute="city" label={jobTexts?.input?.city}
                                variant="filled" placeholder={jobTexts?.input?.cityPh}
                                queryOptions={{ endPoint: apiEndpoint }}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }} />
                            <ServerLookup attribute="state" variant="filled" placeholder={jobTexts?.input?.statePh}
                                label={jobTexts?.input?.state} queryOptions={{ endPoint: apiEndpoint }}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }} />
                            <TextField attribute="zip" label={jobTexts?.input?.zip}
                                validRule={"string"} variant="filled" placeholder={jobTexts?.input?.lobPh} />
                            <ServerLookup attribute="country" label={jobTexts?.input?.country}
                                displayAttribute="name" variant="filled" placeholder={jobTexts?.input?.countryPh}
                                queryOptions={{ endPoint: apiEndpoint }}
                                lookupOptions={{ idAttribute: 'id', labelAttribute: 'name' }} />
                        </FieldGroupContainer>
                    </PalmyraEditForm>
                </div>
            </div>
        </div>
    )
}

export default JobEditPage;