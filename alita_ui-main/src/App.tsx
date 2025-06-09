import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import axios from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { MainLayout } from "./common/MainLayout";
import { navigateToLogin } from "./common/components/auth/RedirectControl";
import { PageNotFound } from "./common/pages/404NotFound";
import AuthVerifyPage from "./pages/auth/AuthVerifyPage";
import ForgotPwdPage from "./pages/auth/ForgotPwdPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPwdPage from "./pages/auth/ResetPwdPage";
import SignUpPage from "./pages/auth/SignUpPage";
import FlexiPlanPage from "./pages/flexiPlans/FlexiPlanPage";
import { InterviewCompletionPage } from "./pages/interview/candidate/InterviewCompletionPage.tsx";
import { InterviewFeedBack } from "./pages/interview/candidate/InterviewFeedBack.tsx";
import InterviewFormPage from "./pages/interview/candidate/InterviewFormPage";
import { InterviewInstructions } from "./pages/interview/candidate/InterviewInstructions";
import { routes } from "./routes";
import "./style/FieldGroupContainer.css";
import "./style/FieldGroupResponsiveLayout.css";
import "./style/LayoutX.css";
import "./style/ResponsiveLayoutX.css";
import "./template/template.css";
import "./themes/Colors.css";
import "./themes/colorDef.css";
import "./App.css";
import { InterviewChatBot } from "./pages/interview/candidate/InterviewChatBot.tsx";
// import SamplePage from "./pages/auth/SamplePage.tsx";

axios.defaults.baseURL = "/";

// const showServerErrorToast = () => {
//   toast.error("Server problem.. Please try again later");
// };

function App() {
  const { t } = useTranslation();
  const errorTexts: any = t("toastMsg", { returnObjects: true });

  const interviewMenu: any =
    window.location.pathname == "/urllogin" ||
    window.location.pathname == "/interview/start";

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.config.headers["X-Skip-Interceptor"] === "true") {
        return Promise.reject(error);
      }
      if (error.response && error.response.status === 401) {
        toast.error(errorTexts?.token, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          bodyClassName: "toast-with-button",
          closeButton: false,
          onClick: !interviewMenu ? navigateToLogin : undefined,
          onClose: !interviewMenu ? navigateToLogin : undefined,
        });
      }
      // else if (error.response && error.response.status === 500) {
      //   showServerErrorToast();
      // }
      return Promise.reject(error);
    }
  );

  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} replace />} />
          <Route path={"/login"} element={<LoginPage />} />
          {/* <Route path={"/login"} element={<SamplePage />} /> */}
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/authVerify" element={<AuthVerifyPage />} />
          <Route path="/forgotPwd" element={<ForgotPwdPage />} />
          <Route path="/resetlink" element={<ResetPwdPage />} />
          <Route path="/flexiPlan" element={<FlexiPlanPage />} />
          <Route path="/urllogin" element={<InterviewInstructions />} />
          <Route path="/interview/start" element={<InterviewFormPage />} />
          <Route path="/interview" element={<InterviewChatBot />} />
          <Route path="/interview/feedback" element={<InterviewFeedBack />} />
          <Route path="/interview/over" element={<InterviewCompletionPage />} />
          <Route path="/app" element={<MainLayout />}>
            {routes}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
