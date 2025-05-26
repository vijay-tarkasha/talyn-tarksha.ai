import { createContext, useState } from "react";
import { ServiceEndpoint } from "../config/ServiceEndpoints";

interface ITarget {
    apiTarget: string
    webTarget: string
}

interface IMutableTarget extends ITarget {
    setApiTarget: (t: string) => void
    setWebTarget: (t: string) => void
}

const getInitialData = () => {
    const webTarget = "localhost";
    const apiTarget = localStorage.getItem("tenant_url") || ServiceEndpoint.apiBaseUrl;
    return { webTarget, apiTarget };
}

const useTargetOptions = () => {

    const [target, setTarget] = useState<ITarget>(getInitialData())

    const setApiTarget = (target: string) => {
        const apiUrl = 'https://' + target + '/';
        localStorage.setItem("tenant_url", apiUrl)
        setTarget((t: ITarget) => {
            return { apiTarget: apiUrl, webTarget: t.webTarget }
        })
    }

    const setWebTarget = (target: string) => {
        setTarget((t: ITarget) => {
            return { apiTarget: t.apiTarget, webTarget: target }
        })
    }

    return {
        apiTarget: target.apiTarget,
        webTarget: target.webTarget,
        setApiTarget,
        setWebTarget
    }
}

const dummyTargetOptions = () => {
    const setApiTarget = (_target: string) => {
        console.error('dummy setApiTarget called')
    }

    const setWebTarget = (_target: string) => {
        console.error('dummy setWebTarget called')
    }

    return {
        apiTarget: "dummyAPITarget",
        webTarget: "dummyWebTarget",
        setApiTarget,
        setWebTarget
    }
}

export const UrlContext = createContext<IMutableTarget>(dummyTargetOptions());

export { useTargetOptions }

export type { IMutableTarget };