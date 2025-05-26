import { ServiceEndpoint } from "../../../config/ServiceEndpoints";

const storeToken = (result: any, target?:string) => {
    const t = target || "/app/dashboard";
    if (isDev()) {
        storeLocal(result, t);
    }
    else
        storeIFrameLocal(result, t)
}

const storeLocal = (result: any, target:string) => {
    storeAuthInfo(result);

    const port = window.location.port;
    const proto = window.location.protocol;

    window.location.replace(proto + "//localhost:" + port + target)
}


const storeIFrameLocal = (result: any, target:string) => {
    const webTarget = result.domain.replace("apicoredev", "uicoredev");

    //@ts-ignore
    window.getTenantInfo = () => {
        return result;
    }

    const iframeContainer = document.getElementById('root');
    if (iframeContainer) {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("src", "https://" + webTarget + target);
        ifrm.onload = () => {
            //@ts-ignore
            ifrm.contentWindow.postMessage(result, "https://" + webTarget);
            setTimeout(() => {
                window.location.replace("https://" + webTarget + target)
            }, 1000);
        }
        iframeContainer.appendChild(ifrm);
    } else {
        console.error("iframeContainer not found")
    }
}

const navigateToLogin = () => {

    if (isDev()) {
        window.location.replace("/login")
    } else {
        const url = ServiceEndpoint.uiBaseUrl;
        window.location.replace(url)
    }
}

const isDev = () => {
    return window.location.hostname == 'localhost'
}

const storeAuthInfo = (result: any) => {
    const currentTime: any = Date.now();
    localStorage.setItem("alita_user", result.user_id)
    localStorage.setItem("user_name", result.username)
    localStorage.setItem("token", result.access)
    localStorage.setItem("refreshToken", result.refresh);
    localStorage.setItem("tenant_url", "https://" + result.domain + "/");
    localStorage.setItem("lastRefreshTime", currentTime);
}

const clearAuthInfo = () => {
    localStorage.removeItem("alita_user")
    localStorage.removeItem("user_name")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tenant_url");
    localStorage.removeItem("lastRefreshTime");
}



export { clearAuthInfo, navigateToLogin, storeAuthInfo, storeToken };