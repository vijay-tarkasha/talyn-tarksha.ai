import { Button } from "@mantine/core";
import { PalmyraNewForm } from "@palmyralabs/rt-forms";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import {
  NumberField,
  Password,
  TextArea,
  TextField,
} from "../../../template/mantineForm";
import { useNavigation } from "../../../wire/errorToast";
import { storeToken } from "./RedirectControl";
import { IMutableTarget, UrlContext } from "../../../wire/UrlContext";
import { clearAuthInfo } from "../../../Session";
import { useHandleError } from "../../../components/util/util";

const LoginForm = () => {
  const { t } = useTranslation();
  const { navigateTo } = useNavigation();
  const formRef: any = useRef();
  const { handle500Error } = useHandleError();
  const urlOptions: IMutableTarget = useContext<IMutableTarget>(UrlContext);

  const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.login.api;
  const lfTexts: any = t("authPage.loginForm", { returnObjects: true });
  const errorTexts: any = t("toastMsg", { returnObjects: true });
  const [loading, setLoading] = useState<boolean>(false);
  const pwdRef = useRef<any>();
  const userRef = useRef<any>();

  useEffect(() => {
    clearAuthInfo();
  }, []);

  const handleClick = () => {
    setLoading(true);
    const req = {
      ...formRef.current.getData(),
    };

    if (!formRef?.current?.getData()?.username) {
      userRef?.current?.setError(errorTexts?.errorMsg?.email);
      setLoading(false);
    } else if (!formRef?.current?.getData()?.password) {
      pwdRef?.current?.setError(errorTexts?.errorMsg?.pwd);
      setLoading(false);
    }

    if (req.username != "" && req.password != "") {
      axios
        .post(endPoint, req)
        .then((d: any) => {
          if (d) {
            const result = d.data.result;
            const webTarget = result.domain.replace("apicoredev", "uicoredev");
            urlOptions.setWebTarget(webTarget);
            storeToken(result);
          }
        })
        .catch((res: any) => {
          setLoading(false);

          const error = res?.response?.data?.result;
          const nullError = res?.response?.data?.result?.non_field_errors?.[0];

          if (error) {
            if (error.username && error.password)
              toast.error(errorTexts?.emailPwd);
            else if (error.username) {
              toast.error(errorTexts?.errorMsg?.email);
            } else if (error.password) {
              toast.error(errorTexts?.pwd);
            }

            if (nullError) {
              toast.error(nullError);
            }
          } else {
            handle500Error(res?.response?.data?.status_code, res?.status);
          }
        });
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleClick();
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    userRef?.current?.setValue(value);
  };

  return (
    <div className="w-full max-w-md auth-form">
      <form onSubmit={handleSubmit} noValidate>
        <PalmyraNewForm endPoint={endPoint} ref={formRef}>
          <TextField
            attribute="username"
            required
            placeholder={lfTexts?.label?.emailPH}
            validRule={{
              rule: "email",
              errorMessage: errorTexts?.errorMsg?.invalidEmail,
            }}
            label={lfTexts?.label?.email}
            variant="filled"
            size="md"
            ref={userRef}
            radius="md"
            invalidMessage={errorTexts?.errorMsg?.email}
            onChange={handleEmailChange}
            className="w-full text-base"
          />
          <div className="mt-4">
            <TextArea
              attribute=""
              placeholder="Type any text"
              label="TextArea"
              //   title="TextArea"
              withAsterisk
              autosize
              minRows={2}
            />
          </div>
          <div className="mt-4">
            <NumberField
              attribute=""
              placeholder="Enter number"
              label="Number"
              withAsterisk
              radius="md"
              size="md"
              variant="filled"
              length={{min:0,max:10,errorMessage:{minimum:"min 0",maximum:"max 10"}}}
            />
          </div>

          <div className="mt-4">
            <Password
              attribute="password"
              placeholder="xxxxxx"
              required
              invalidMessage={errorTexts?.errorMsg?.pwd}
              ref={pwdRef}
              variant="filled"
              size="md"
              radius="md"
              label={lfTexts?.label?.pwd}
              className="w-full text-base"
            />
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              variant="contained"
              className="w-full text-lg transition login-btn min-h-12"
              loading={loading}
              size="md"
              loaderProps={{ type: "dots" }}
            >
              {lfTexts?.label?.button}
            </Button>
          </div>
          <div className="mt-3 text-sm text-left">
            <span className="login-forgot-pwd-text text-base">
              {lfTexts?.footer?.signUpText}
            </span>
            <span
              className="cursor-pointer ml-1 login-forgot-pwd-link font-semibold"
              onClick={() => navigateTo("/signUp")}
            >
              {lfTexts?.footer?.signUpLink}
            </span>
          </div>
          <div className="mt-2 text-sm text-left">
            <span className="login-forgot-pwd-text text-base">
              {lfTexts?.footer?.resetPwdText}
            </span>
            <span
              className="cursor-pointer ml-1 login-forgot-pwd-link font-semibold"
              onClick={() => navigateTo("/forgotPwd")}
            >
              {lfTexts?.footer?.resetPwdLink}
            </span>
          </div>
        </PalmyraNewForm>
      </form>
    </div>
  );
};

export default LoginForm;
