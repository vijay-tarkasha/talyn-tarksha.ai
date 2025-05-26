import { Button } from '@mantine/core';
import { PalmyraForm } from '@palmyralabs/rt-forms';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PasswordRegex, useHandleError } from '../../../components/util/util';
import { ServiceEndpoint } from '../../../config/ServiceEndpoints';
import { Password, TextField } from '../../../template/mantineForm';
import { useNavigation } from '../../../wire/errorToast';
import { IMutableTarget, UrlContext } from '../../../wire/UrlContext';
import { clearAuthInfo, storeToken } from './RedirectControl';

const AuthVerifyForm = () => {
  const { navigateTo } = useNavigation();
  const { handle500Error } = useHandleError();
  const location = useLocation();
  const { t } = useTranslation();
  const formRef: any = useRef();
  const pwdRef: any = useRef();
  const rePwdRef: any = useRef();
  const codeRef: any = useRef();
  const [_isValid, setValid] = useState<boolean>(false);
  const avfTexts: any = t('authPage.authVerifyForm', { returnObjects: true });
  const errorTexts: any = t('toastMsg', { returnObjects: true });
  const endpoint = ServiceEndpoint.auth.password;

  const [pwd, setPwd] = useState<string>('')
  const [rePwd, setRePwd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const urlOptions: IMutableTarget = useContext<IMutableTarget>(UrlContext);
  // const { apiTarget } = urlOptions;

  useEffect(() => {
    clearAuthInfo();
  }, [])

  const handleClick = () => {
    setLoading(true);
    const code = formRef.current.getData().verification_code
    const pwd = formRef?.current?.getData()?.password
    const rePwd = formRef?.current?.getData()?.re_password;

    const showError = () => {
      if (!code) {
        codeRef?.current?.setError(errorTexts?.errorMsg?.req);
        setLoading(false)
      } else if (!pwd) {
        pwdRef?.current?.setError(errorTexts?.errorMsg?.req);
        setLoading(false)
      } else if (!rePwd) {
        rePwdRef?.current?.setError(errorTexts?.errorMsg?.req);
        setLoading(false)
      } else if (pwd !== rePwd) {
        rePwdRef.current.setError(errorTexts.errorMsg.mismatch);
        setLoading(false)
      }
    };
    showError();
    const baseUrl = location?.state?.baseUrl
    const validateApi = baseUrl + endpoint.validationCode;
    const setPasswordApi = baseUrl + endpoint.setPassword;
    const loginEndPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.login.api;

    const validateReq: any = {
      verification_code: code,
      email: location?.state?.email
    }

    const setPasswordReq: any = {
      email: location?.state?.email,
      password: formRef.current.getData().password
    }

    const loginReq: any = {
      username: location?.state?.email,
      password: formRef.current.getData().password
    }
    if ((pwd && rePwd) != '' && pwd == rePwd) {
      axios.post(validateApi, validateReq).then((v) => {
        if (v) {
          toast.success(v.data.message)
          axios.post(setPasswordApi, setPasswordReq).then((d) => {
            if (d) {
              toast.success(d.data.message)
              axios.post(loginEndPoint, loginReq).then((s: any) => {
                if (s) {
                  const result = s.data.result
                  const webTarget = result.domain.replace("apicoredev", "uicoredev");
                  urlOptions.setWebTarget(webTarget)
                  storeToken(result, '/flexiPlan');
                  // storeAuthInfo(result);
                  // const webTarget = result.domain.replace("apicoredev", "uicoredev");
                  // urlOptions.setWebTarget(webTarget)
                  // navigateTo('/flexiPlan')
                }
              }).catch((res: any) => {
                if (res && ([500, 404, "500", "404"].includes(res?.response?.data?.status_code))) {
                  toast.error(res?.response?.data?.message || errorTexts?.reqFail)
                } else {
                  handle500Error(res, res?.status || res?.response?.data?.status_code)
                }
              })
            }
          }).catch((res: any) => {
            setLoading(false)
            if (res && ([500, 404, "500", "404"].includes(res?.response?.data?.status_code)) ||
              ([500, 404, "500", "404"].includes(res.response.status))) {
              toast.error(res?.response?.data?.message || errorTexts?.reqFail)
            } else {
              handle500Error(res, res?.status || res?.response?.data?.status_code)
            }
          })
        }
      }).catch((res: any) => {
        setLoading(false)
        if (res && ([500, 404, "500", "404"].includes(res?.response?.data?.status_code)) ||
          ([500, 404, "500", "404"].includes(res.response.status))) {
          toast.error(res?.response?.data?.message || errorTexts?.reqFail)
        } else {
          handle500Error(res, res?.status || res?.response?.data?.status_code)
        }
      })
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleClick();
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

  const error = pwd == rePwd ? '' : rePwd && errorTexts.errorMsg.mismatch;

  useEffect(() => {
    rePwdRef.current.setError(error)
  }, [error])

  return (
    <div className='w-full max-w-md auth-form'>
      <form onSubmit={handleSubmit} noValidate>
        <PalmyraForm ref={formRef} onValidChange={setValid}>
          <TextField attribute='verification_code' length={{ eq: 6, errorMessage: errorTexts?.errorMsg?.digit }}
            variant='filled' size='lg' radius={'md'} validRule={{ rule: 'number', errorMessage: errorTexts?.errorMsg?.numbers }}
            label={avfTexts?.label?.code} ref={codeRef} />
          <div className='mt-4'>
            <Password attribute='password' placeholder='xxxxxx' onChange={pwdChange}
              variant='filled' size='lg' radius={'md'} label={avfTexts?.label?.pwd}
              required invalidMessage={errorTexts?.errorMsg?.req} ref={pwdRef}
              regExp={{
                regex: PasswordRegex,
                errorMessage: errorTexts?.errorMsg?.invalidPwd
              }} />
          </div>
          <div className='mt-4'>
            <Password attribute='re_password' placeholder='xxxxxx' onChange={rePwdChange} required ref={rePwdRef}
              invalidMessage={errorTexts?.errorMsg?.req}
              variant='filled' size='lg' radius={'md'} label={avfTexts?.label?.rePwd} missingMessage={rePwd && error} />
          </div>
          <div className='mt-6'>
            <Button type="submit" variant="contained" loading={loading}
              loaderProps={{ type: 'dots' }} size='md'
              className={'w-100 text-md transition login-btn min-h-12'}>
              {avfTexts?.label?.button}
            </Button>
          </div>
          <div className='mt-3 text-sm text-left'>
            <span className='login-forgot-pwd-text text-base'>{avfTexts?.footer?.loginText}</span>
            <span className='login-forgot-pwd-link font-semibold cursor-pointer'
              onClick={() => navigateTo('/login')}> {avfTexts?.footer?.loginLink}</span>
          </div>
        </PalmyraForm>
      </form>
    </div>
  )
}

export default AuthVerifyForm;