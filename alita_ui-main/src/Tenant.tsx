import { StoreFactoryContext } from "@palmyralabs/rt-forms";
import { UrlContext, useTargetOptions } from "./wire/UrlContext";
import { getStoreFactory } from "./wire/AppStoreFactory";


function Tenant(props: any) {
    const options = useTargetOptions();
    const storeFactory = getStoreFactory(options.apiTarget);

    return (
        <UrlContext.Provider value={options}>
            <StoreFactoryContext.Provider value={storeFactory} >
                {props.children}
            </StoreFactoryContext.Provider>
        </UrlContext.Provider>
    )
}

export default Tenant;