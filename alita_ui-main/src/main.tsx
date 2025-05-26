import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { ToastContainer } from 'react-toastify'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n.ts'
import Tenant from './Tenant.tsx'
import Session from './Session.tsx'
import { ServiceEndpoint } from './config/ServiceEndpoints.ts'
import { hasTokenExpired } from './common/components/auth/TokenMgmt.ts'
import axios from 'axios'
import "tailwindcss";

const MAIN_DOMAIN = ServiceEndpoint.mainDomain;


axios.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem("token");
      if (token) {
          config.headers["Authorization"] = "Bearer " + token;
      }

      return config;
  },
  (error) => {
      Promise.reject(error);
  }
);


const loadApp = () => {
  createRoot(document.getElementById('root')!).render(
    <MantineProvider>
      <I18nextProvider i18n={i18n}>
        <Tenant>
          <App />
        </Tenant>
      </I18nextProvider>
      <ToastContainer limit={1} pauseOnFocusLoss={false} autoClose={2000} />
    </MantineProvider>
  )
}

const loadSession = () => {
  createRoot(document.getElementById('root')!).render(
    <Session />
  )
}

function isMainDomain(host: string) {
  const user = localStorage.getItem("alita_user")
  const tenant = localStorage.getItem("tenant_url")
  const token = localStorage.getItem("token")
  const refreshToken = localStorage.getItem("refreshToken")

  if (user && tenant && token && refreshToken && !hasTokenExpired()) {
    return true;
  }

  return host == 'localhost' || host == MAIN_DOMAIN || host.startsWith('192.168.1');
}

if (isMainDomain(window.location.hostname)) {
  loadApp();
} else {
  loadSession();
}