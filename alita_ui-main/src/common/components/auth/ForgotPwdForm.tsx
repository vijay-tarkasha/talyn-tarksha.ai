import { Button } from '@mantine/core';
import { PalmyraForm } from '@palmyralabs/rt-forms';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ServiceEndpoint } from '../../../config/ServiceEndpoints';
import { TextField } from '../../../template/mantineForm';
import { useNavigation } from '../../../wire/errorToast';
import { useHandleError } from '../../../components/util/util';

const ForgotPwdForm = () => {
  const { navigateTo } = useNavigation();
  const { t } = useTranslation();
  const formRef: any = useRef();
  const userRef: any = useRef();
  const { handle500Error } = useHandleError();
  const [loading, setLoading] = useState<boolean>(false);
  const [_isValid, setValid] = useState<boolean>(false);
  const errorTexts: any = t('toastMsg', { returnObjects: true });
  const forgotPwdTexts: any = t('authPage.forgotPwdForm', { returnObjects: true });
  const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.password.forgotPwd;

  const handleClick = () => {
    setLoading(true)
    const userName = formRef.current.getData().username;
    const req = { ...formRef.current.getData() }

    if (userName == '') {
      userRef.current.setError(errorTexts?.errorMsg?.email)
      setLoading(false);
    }
    if (userName != '') {
      axios.post(endPoint, req).then((d) => {
        if (d) {
          toast.success(errorTexts?.restPwdLink)
          setLoading(false);
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
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    userRef?.current?.setValue(value)
  };

  return (
    <div className='w-full max-w-md auth-form'>
      <PalmyraForm ref={formRef} onValidChange={setValid}>
        <TextField attribute='username' required placeholder={forgotPwdTexts?.label?.emailPH}
          validRule={{ rule: 'email', errorMessage: errorTexts?.errorMsg?.invalidEmail }}
          label={forgotPwdTexts?.label?.email} variant='filled' size='md' radius={'md'} ref={userRef}
          invalidMessage={errorTexts?.errorMsg?.email} onChange={handleEmailChange} />
        <div className='mt-6'>
          <Button type="submit" variant="contained" size='md'
            loading={loading} loaderProps={{ type: 'dots' }}
            className={'w-100 text-md transition login-btn min-h-12'} onClick={handleClick}>
            {forgotPwdTexts?.label?.button}
          </Button>
        </div>
        <div className='mt-3 text-sm text-left'>
          <span className='login-forgot-pwd-text text-base'>{forgotPwdTexts?.footer?.signUpText}</span>
          <span className='login-forgot-pwd-link font-semibold cursor-pointer ml-1'
            onClick={() => navigateTo('/signUp')}> {forgotPwdTexts?.footer?.signUpLink}</span>
        </div>
      </PalmyraForm>
    </div>
  )
}

export default ForgotPwdForm;