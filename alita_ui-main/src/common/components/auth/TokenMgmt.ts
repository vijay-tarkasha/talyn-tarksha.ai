import axios from "axios";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { storeAuthInfo } from "./RedirectControl";
import { TimeConfig } from "../../../config/TimeConfig";


const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        const apiTarget = ServiceEndpoint.apiBaseUrl;
        const endPoint = apiTarget + ServiceEndpoint.auth.login.refresh;
        try {
            const response = await axios.post(endPoint, { refresh: refreshToken });
            storeAuthInfo(response.data.result);
            setHandle(undefined);
            startTokenRefreshThread();
        } catch (error) {
            console.error("Token refresh thread - Error refreshing token", error);
            setTimeout(refreshAccessToken, 15000);
        }
    } else {
        console.error("Token refresh thread - No refresh token available");
    }
};

const startTokenRefreshThread = () => {
    const startInterval = getInitialIntervalInMillis();
    if (startInterval > 5000) {
        if (getHandle() == undefined) {
            cancelRefreshThread();
            console.info(`Token refresh thread - fetching token in next ${startInterval / 1000} seconds`);
            const handle = setTimeout(refreshAccessToken, startInterval);
            setHandle(handle);
        } else
            console.info("Token refresh thread Already scheduled")
    } else {
        console.error("refresh token already expired", startInterval);
    }
}

const cancelRefreshThread = () => {
    if (getHandle()) {
        console.info('clearing token refresh thread');
        clearTimeout(getHandle());
        setHandle(undefined);
    }
}

const getInitialIntervalInMillis = () => {
    const sLastRefreshTime = localStorage.getItem("lastRefreshTime");
    if (sLastRefreshTime) {
        const lastRefreshTimeInMillis = parseInt(sLastRefreshTime);
        const currentTimeInMillis = Date.now();
        var diffInMillis = currentTimeInMillis - lastRefreshTimeInMillis;
        return getScheduleIntervalInMillis() - diffInMillis;
    }
    return -1;
}

const getScheduleIntervalInMillis = () => {
    return TimeConfig.refreshTimeIntervalInMillis - TimeConfig.preponeIntervalInMillis;
}

const hasTokenExpired = () => {
    return getInitialIntervalInMillis() <= 0;
}

export { startTokenRefreshThread, cancelRefreshThread, hasTokenExpired }


const getHandle = () => {
    //@ts-ignore
    return window.tokenRefreshHandle;
}

const setHandle = (h: any) => {
    //@ts-ignore
    window.tokenRefreshHandle = h;
}