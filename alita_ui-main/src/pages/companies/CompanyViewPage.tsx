import { IEndPoint } from '@palmyralabs/palmyra-wire'
import { FieldGroupContainer, ISaveForm, PalmyraEditForm } from '@palmyralabs/rt-forms'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiNewspaperClipping } from "react-icons/pi"
import ProfileImage from '../../components/widget/ProfileImage'
import { ServiceEndpoint } from '../../config/ServiceEndpoints'
import { TextField } from '../../template/mantineForm'

const CompanyViewPage = () => {
    const formRef = useRef<ISaveForm>(null);
    const { t } = useTranslation();
    // const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const companyTexts: any = t('company', { returnObjects: true });
    const [data, setData] = useState<any>({});

    const apiEndpoint = ServiceEndpoint.company.restApi;

    // const goToEditPage = () => {
    //     navigateTo('/app/companies/:id/edit')
    // }

    const endPoint: IEndPoint = {
        get: apiEndpoint,
        query: apiEndpoint, put: apiEndpoint,
        post: apiEndpoint
    }

    const onQueryData = (d: any) => {
        setData(d);
        return d;
    }

    return (
        <div className="page-right-left-container">
            <div className=''>
                <div className="">
                    <div className="text-base md:text-xl font-semibold">
                        {companyTexts.view.title}
                    </div>
                </div>
                <div>
                    <PalmyraEditForm endPoint={endPoint} ref={formRef} id='' onQueryData={onQueryData}>
                        <div className="py-5">
                            <SectionHeader
                                title={companyTexts.view.compInfo}
                                rightContent={
                                    <div className="cursor-pointer item-center flex">
                                        {/* <img src={BuildImg} alt="Profile"
                                            style={{
                                                opacity: 1,
                                                transition: "opacity 0.3s ease"
                                            }} /> */}
                                        <ProfileImage name={data?.company_name} id={data?.id} className={"profile_lg"} />
                                    </div>
                                }
                            />
                            <FieldGroupContainer columns={2}>
                                <TextField attribute="first_name" label={companyTexts.input.fName} readOnly
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.fName} />
                                <TextField attribute="last_name" label={companyTexts.input.lName} readOnly
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.lName} />
                                <TextField attribute="email" label={companyTexts.input.email} readOnly
                                    validRule={"email"} variant="filled" placeholder={companyTexts.input.email} />
                                <TextField attribute="mobile" label={companyTexts.input.mobile} readOnly
                                    validRule={"number"} variant="filled" placeholder={companyTexts.input.mobile} />
                                <TextField attribute="company_name" label={companyTexts.input.compName} readOnly
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.compName} />
                                <TextField attribute="company_website" label={companyTexts.input.web} readOnly
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.web} />
                                <div className='w-full py-5'><SectionHeader
                                    title={companyTexts.view.billInfo} />
                                </div>
                                <TextField attribute="billing_details.first_name" label={companyTexts.input.fName} readOnly
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.fName} />
                                <TextField attribute="billing_details.last_name" label={companyTexts.input.lName}
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.lName} readOnly />
                                <TextField attribute="billing_details.email" label={companyTexts.input.email}
                                    validRule={"email"} variant="filled" placeholder={companyTexts.input.email} readOnly />
                                <TextField attribute="billing_details.mobile" label={companyTexts.input.mobile}
                                    validRule={"number"} variant="filled" placeholder={companyTexts.input.mobile} readOnly />
                                <TextField attribute="billing_details.company_name" label={companyTexts.input.compName}
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.compName} readOnly />
                                <TextField attribute="billing_details.gstNumber" label={companyTexts.input.gst}
                                    validRule={"string"} variant="filled" placeholder={companyTexts.input.gst} readOnly />
                            </FieldGroupContainer>
                        </div>
                    </PalmyraEditForm>
                </div>
            </div>
        </div>
    )
}

export default CompanyViewPage;


interface ISectionInputs {
    title: string
    subtitle?: string
    rightContent?: any
}

const SectionHeader = (props: ISectionInputs) => {
    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
                <div className='flex items-center gap-2'>
                    <div className='align-top'>
                        <PiNewspaperClipping className='bill-icon text-3xl' />
                    </div>
                    <div className='text-base md:text-lg font-semibold'>
                        {props.title}
                        <div className='section-subtitle text-sm md:text-sm font-normal'>{props.subtitle}</div>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                {props.rightContent}
            </div>
        </div>
    )
}
export { SectionHeader }
