import { Button, FileButton, Tooltip } from '@mantine/core'
import { FieldGroupContainer, ISaveForm, PalmyraEditForm } from '@palmyralabs/rt-forms'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheck } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { PiNewspaperClipping } from "react-icons/pi"
import BuildImg from '../../../public/images/buildimg.png'
import { IPageInput } from '../../template/Types'
import { NumberField, TextField } from '../../template/mantineForm'
import { useNavigation } from '../../wire/errorToast'

const CompanyEditPage = (props: IPageInput) => {
    const { navigateTo } = useNavigation();
    const formRef = useRef<ISaveForm>(null);
    const [_isValid, setValid] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState(BuildImg);
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const companyTexts: any = t('company', { returnObjects: true });

    const apiEndpoint = '/company';

    const handleBack = () => {
        navigateTo('../' + props.pageName);
    }

    const handleFileChange = (file: any) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };
    return (
        <div className="page-content-container">
            <div className="page-right-left-container">
                <div className="company-form">
                    <div className="form-header-container">
                        <div className="form-header-text">
                            {companyTexts.edit.title}
                        </div>
                        <div className="form-btn-container">
                            <Button onClick={handleBack}
                                className="cancel-filled-button"
                                leftSection={<IoMdClose className="button-icon" />}>
                                {btnTexts.cancel}
                            </Button>
                            <Button
                                className={'filled-button'}
                                leftSection={<FaCheck className="button-icon" />}>
                                {btnTexts.save}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <PalmyraEditForm endPoint={apiEndpoint} id='' ref={formRef} onValidChange={setValid}>
                            <div className="palmyra-form-field-container-wrapper">
                                <SectionHeader
                                    title={companyTexts.view.compInfo}
                                    subtitle={companyTexts.view.infoSub}
                                    rightContent={
                                        <div className="company-form-img-container">
                                            <FileButton onChange={handleFileChange} accept="image/*">
                                                {(props) => (
                                                    <div className="company-form-img-field" style={{ cursor: "pointer" }} {...props}>
                                                        <Tooltip label="Click to Upload Image" position="left" color="var(--primary-color)"
                                                            offset={{ mainAxis: -50, crossAxis: 0 }}
                                                            transitionProps={{ transition: 'fade-up', duration: 300 }}>
                                                            <img src={selectedImage} alt="Profile"
                                                                style={{
                                                                    opacity: selectedImage === BuildImg ? 0.35 : 1,
                                                                    transition: "opacity 0.3s ease"
                                                                }} />

                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </FileButton>
                                        </div>
                                    }
                                />
                                <FieldGroupContainer columns={2}>
                                    <TextField attribute="firstName" label={companyTexts.input.fName}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.fName} />
                                    <TextField attribute="lastName" label={companyTexts.input.lName}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.lName} />
                                    <TextField attribute="email" label={companyTexts.input.email}
                                        validRule={"email"} variant="filled" placeholder={companyTexts.input.email} />
                                    <NumberField attribute="mobile" label={companyTexts.input.mobile}
                                        validRule={"number"} variant="filled" placeholder={companyTexts.input.mobile} />
                                    <TextField attribute="companyName" label={companyTexts.input.compName}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.compName} />
                                    <TextField attribute="website" label={companyTexts.input.web}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.web} />
                                    <div className='company-section'><SectionHeader
                                        title={companyTexts.view.billInfo}
                                        subtitle={companyTexts.view.infoSub} /></div>
                                    <TextField attribute="firstName" label={companyTexts.input.fName}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.fName} />
                                    <TextField attribute="lastName" label={companyTexts.input.lName}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.lName} />
                                    <TextField attribute="email" label={companyTexts.input.email}
                                        validRule={"email"} variant="filled" placeholder={companyTexts.input.email} />
                                    <NumberField attribute="mobile" label={companyTexts.input.mobile}
                                        validRule={"number"} variant="filled" placeholder={companyTexts.input.mobile} />
                                    <TextField attribute="companyName" label={companyTexts.input.compAdd}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.compAdd} />
                                    <TextField attribute="website" label={companyTexts.input.gst}
                                        validRule={"string"} variant="filled" placeholder={companyTexts.input.gst} />
                                </FieldGroupContainer>
                            </div>
                        </PalmyraEditForm>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyEditPage;


interface ISctionInputs {
    title: string
    subtitle?: string
    rightContent?: any
}
const SectionHeader = (props: ISctionInputs) => {
    return (
        <div className='form-section-header-container'>
            <div className='form-section-left-header'>
                <div>
                    <PiNewspaperClipping className='bill-icon' />
                </div>
                <div>
                    <div className='section-title'>{props.title}</div>
                    <div className='section-subtitle'>{props.subtitle}</div>
                </div>
            </div>
            <div className='form-section-right-header'>
                {props.rightContent}
            </div>
        </div>
    )
}
export { SectionHeader }

