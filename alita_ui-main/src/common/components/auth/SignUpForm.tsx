import { Button } from '@mantine/core';
import { PalmyraForm } from '@palmyralabs/rt-forms';
import { useContext, useRef, useState } from 'react';
import { RadioGroup, TextField } from '../../../template/mantineForm';
import { useTranslation } from 'react-i18next';
import { ServiceEndpoint } from '../../../config/ServiceEndpoints';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IMutableTarget, UrlContext } from '../../../wire/UrlContext';
import { useHandleError, LocationRegex, MobileRegex, UrlRegex } from '../../../components/util/util';
import { delayGenerator } from '@palmyralabs/ts-utils';

const delay = delayGenerator(300)
const SignUpForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formRef: any = useRef();
  const { handle500Error } = useHandleError();
  const [loading, setLoading] = useState<boolean>(false);
  const urlOptions: IMutableTarget = useContext<IMutableTarget>(UrlContext);
  const [isValid, setValid] = useState<boolean>(false);
  const [com, setComType] = useState(2);
  const webRef = useRef<any>();
  const emailRef = useRef<any>(null);
  const mobRef = useRef<any>(null);
  const companyRef = useRef<any>(null);
  const locationRef = useRef<any>(null);

  const clientEndpoint = ServiceEndpoint.auth.client.regClient;
  const checkEndPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.tenant.user.checkclientuser;

  const sfTexts: any = t('authPage.signUpForm', { returnObjects: true });
  const errorTexts: any = t('toastMsg', { returnObjects: true });

  const handleCompanyChange = (e: any) => {
    const reqBody = {
      email: '',
      name: e.target.value
    }
    if (companyRef?.current?.isValid()) {
      axios.post(checkEndPoint, reqBody).then((s: any) => {
        if (s.data.client == "exists") {
          companyRef?.current?.setError("Company name already exists")
        }
      })
    }
  }

  const handleEmailChange = (e: any) => {
    const email = e.target.value.toLowerCase();
    emailRef?.current?.setValue(email)
    const reqBody = {
      email: email,
      name: ''
    }
    if (emailRef?.current?.isValid()) {
      axios.post(checkEndPoint, reqBody).then((s: any) => {
        if (s.data.user == "exists") {
          emailRef?.current?.setError("User already exists")
        }
      })
    }
  }

  const handleCreate = () => {
    setLoading(true)
    const name = formRef?.current?.getData()?.company_name
    const email = formRef?.current?.getData()?.email
    const website = formRef.current.getData().company_website
    const mobile = formRef?.current?.getData()?.mobile

    const showError = () => {
      if (!name) {
        companyRef?.current?.setError(errorTexts?.errorMsg?.req);
      } else if (!website) {
        webRef?.current?.setError(errorTexts?.errorMsg?.req);
      } else if (!email) {
        emailRef?.current?.setError(errorTexts?.errorMsg?.req);
      } else if (!mobile) {
        mobRef?.current?.setError(errorTexts?.errorMsg?.req);
      }
    };

    showError();

    const req: any = {
      name: name,
      website: website
    }

    let cleanedMobile = mobile.replace(/^\+91\s*/, '').replace(/\s/g, '');
    const regReq = {
      ...formRef?.current?.getData(),
      mobile: cleanedMobile && "+91" + cleanedMobile
    }

    if (isValid) {
      if ((mobile && email && website) != '') {
        axios.post(ServiceEndpoint.apiBaseUrl + clientEndpoint, req).then((d: any) => {
          if (d) {
            urlOptions.setApiTarget(d.data.result.domain_url)
            const base = "https://" + d.data.result.domain_url + "/"
            const registerApi = base + ServiceEndpoint.auth.tenant.user.regUser;
            axios.post(registerApi, regReq).then((s: any) => {
              if (s) {
                toast.success(d.data.message)
                navigate('/authVerify', { state: { email: formRef.current.getData().email, baseUrl: base } });
              }
            }).catch((res: any) => {
              setLoading(false)
              handle500Error(res?.response?.data, res?.status)
            })
          }
        }).catch((res: any) => {
          setLoading(false)
          if (res.response.data.message && res.response.data.status_code == 500) {
            if ("Creation Error : ['Invalid string used for the schema name.']" == res?.response?.data?.message)
              toast.error(errorTexts?.fillMan)
            else toast.error(formRef.current.getData().company_name + ' ' + errorTexts?.allExist)
          } else {
            toast.error(res?.response?.data?.message);
          }
        })
      }
      else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  const handleChange = (val: any) => {
    setComType(val)
  }
  const label = com == 1 ? sfTexts.indLabel : sfTexts.compLabel;

  return (
    <div className='w-full max-w-md auth-form'>
      <PalmyraForm ref={formRef} onValidChange={setValid}>
        <div className='signup-type'>
          <RadioGroup attribute='' options={{ 1: "Individual", 2: "Company" }} size='md'
            defaultValue={2} onChange={handleChange} className="w-full text-base" />
        </div>
        <div className='mt-2'>
          <TextField attribute='company_name' required ref={companyRef}
            variant='filled' size='md' radius={'md'} placeholder={label?.name}
            onChange={(v) => delay(handleCompanyChange, v)} className="w-full text-base"
            label={label?.name} invalidMessage={errorTexts?.errorMsg?.req} />
        </div>
        <div className='mt-2'>
          <TextField attribute='company_website' required ref={webRef}
            variant='filled' size='md' radius={'md'}
            label={label?.website} placeholder={label?.website}
            regExp={{ regex: UrlRegex, errorMessage: "Invalid Url" }}
            invalidMessage={errorTexts?.errorMsg?.req} className="w-full text-base"
            onBlur={(e) => {
              let value = e.target.value.trim();
              if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
                e.target.value = `https://${value}`;
                webRef?.current.setValue(`https://${value}`)
              }
            }}
          />
        </div>
        <div className='mt-2'>
          <TextField attribute='email' required
            placeholder={label?.emailPH} ref={emailRef}
            validRule={{ rule: 'email', errorMessage: errorTexts?.errorMsg?.invalidEmail }}
            label={label?.email} onChange={(v) => delay(handleEmailChange, v)}
            variant='filled' size='md' radius={'md'} className="w-full text-base"
            invalidMessage={errorTexts?.errorMsg?.req} error={true} />
        </div>
        <div className='mt-2'>
          <TextField attribute='mobile' placeholder={label?.mobilePH} required ref={mobRef}
            regExp={{ regex: MobileRegex, errorMessage: errorTexts?.errorMsg?.invalidMobile }}
            variant='filled' size='md' radius={'md'} label={label?.mobile}
            invalidMessage={errorTexts?.errorMsg?.req} className="w-full text-base" />
        </div>
        <div className='mt-2'>
          <TextField attribute='location' variant='filled' size='md'
            radius={'md'} label={label?.location} ref={locationRef} className="w-full text-base"
            regExp={{ regex: LocationRegex, errorMessage: "Invalid Input" }} />
        </div>
        <div className='mt-4'>
          <Button type="submit" variant="contained" onClick={handleCreate}
            loading={loading} loaderProps={{ type: 'dots' }} size='md'
            className="w-100 text-md transition login-btn min-h-12">
            {label?.button}
          </Button>
        </div>
        <div className='mt-2 text-sm text-left'>
          <span className='login-forgot-pwd-text text-base'>{sfTexts?.footer?.loginText}</span>
          <span className='cursor-pointer ml-1 login-forgot-pwd-link font-semibold'
            onClick={() => navigate('/login')}> {sfTexts?.footer?.loginLink}</span>
        </div>
      </PalmyraForm>
    </div>
  )
}

export default SignUpForm;