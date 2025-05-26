import { Button } from '@mantine/core';
import { PalmyraForm } from '@palmyralabs/rt-forms';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { PasswordRegex, useHandleError } from '../../../components/util/util';
import { ServiceEndpoint } from '../../../config/ServiceEndpoints';
import { Password } from '../../../template/mantineForm';
import { useNavigation } from '../../../wire/errorToast';

const ResetPwdForm = () => {
  const { t } = useTranslation();
  const { navigateTo } = useNavigation();
  const { handle500Error } = useHandleError();
  const formRef: any = useRef();
  const pwdRef: any = useRef();
  const rePwdRef: any = useRef();
  const [_isValid, setValid] = useState<boolean>(false);
  const [pwd, setPwd] = useState<string>('')
  const [rePwd, setRePwd] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<any>({});

  const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.password.resetPwd;
  const rpfTexts: any = t('authPage.resetPwdForm', { returnObjects: true });
  const errorTexts: any = t('toastMsg', { returnObjects: true });

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const queryObject: any = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });
    setQueryParams(queryObject);
  }, []);

  const handleClick = () => {
    setLoading(true)
    const password = formRef.current.getData().password;

    const showError = () => {
      if (!pwd) {
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

    const req: any = {
      uid: queryParams?.uid,
      token: queryParams?.token,
      password: password
    }
    if ((pwd && rePwd) != '' && pwd == rePwd) {
      axios.post(endPoint, req).then((d) => {
        if (d) {
          toast.success(d.data.message)
          navigateTo('/login');
        }
      }).catch((res: any) => {
        setLoading(false)
        if (res && ([500, 404, "500", "404"].includes(res?.response?.data?.status_code))) {
          toast.error(res?.response?.data?.message || errorTexts?.reqFail)
        } else {
          handle500Error(res?.response?.data?.status_code, res?.status)
        }
      })
    }
    else {
      setLoading(false)
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

  const error = pwd == rePwd ? '' : rePwd && errorTexts.errorMsg.mismatch;

  useEffect(() => {
    rePwdRef.current.setError(error)
  }, [error])

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleClick();
  }

  return (
    <div className='w-full max-w-md auth-form'>
      <form onSubmit={handleSubmit} noValidate>
        <PalmyraForm ref={formRef} onValidChange={setValid}>
          {/* <TextField attribute='verification_code' length={{ eq: 6, errorMessage: errorTexts?.errorMsg?.digit }}
            variant='filled' size='lg' radius={'md'} validRule={{ rule: 'number', errorMessage: errorTexts?.errorMsg?.numbers }}
            label={rpfTexts?.label?.code} /> */}
          <div className=''>
            <Password attribute='password' placeholder='xxxxxx' onChange={pwdChange}
              variant='filled' size='lg' radius={'md'} label={rpfTexts?.label?.pwd}
              regExp={{
                regex: PasswordRegex,
                errorMessage: errorTexts?.errorMsg?.invalidPwd
              }} required invalidMessage={errorTexts?.errorMsg?.req} ref={pwdRef} />
          </div>
          <div className='mt-4'>
            <Password attribute='re-password' placeholder='xxxxxx' onChange={rePwdChange} ref={rePwdRef}
              variant='filled' size='lg' radius={'md'} label={rpfTexts?.label?.rePwd}
              required invalidMessage={errorTexts?.errorMsg?.req} missingMessage={rePwd && error} />
          </div>
          <div className='mt-6'>
            <Button type="submit" variant="contained" loading={loading} loaderProps={{ type: 'dots' }}
              className={'w-100 text-md transition login-btn min-h-12'} size='md'>
              {rpfTexts?.label?.button}
            </Button>
          </div>
          <div className='mt-3 text-left'>
            <span className='login-forgot-pwd-text text-base'>{rpfTexts?.footer?.signUpText}</span>
            <span className='login-forgot-pwd-link font-semibold cursor-pointer'
              onClick={() => navigateTo('/signUp')}> {rpfTexts?.footer?.signUpLink}</span>
          </div>
        </PalmyraForm>
      </form>
    </div>
  )
}

export default ResetPwdForm;