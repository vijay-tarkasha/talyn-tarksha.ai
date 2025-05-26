import { useEffect } from "react";
import { ServiceEndpoint } from "./config/ServiceEndpoints";
import { clearAuthInfo, storeAuthInfo } from "./common/components/auth/RedirectControl";


const Session = () => {

    clearAuthInfo();

    useEffect(() => {
        var handle: any = window.addEventListener('message', receiveMessage, false);

        function receiveMessage(evt: any) {
            clearAuthInfo();
            const result = evt.data;
            storeAuthInfo(result);
        }
        return () => { window.removeEventListener('message', handle) }
    })

    const url = ServiceEndpoint.uiBaseUrl

    return (
        <div>
            This page should not be accessed without login.  click here to redirect
            <a href={url}> uicoredev.talyn.ai</a>
        </div>
    )
}

export default Session;

export { clearAuthInfo, storeAuthInfo }