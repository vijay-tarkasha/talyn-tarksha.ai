
// import { IEndPoint, PalmyraStoreFactory } from "@palmyralabs/palmyra-wire";
import 'react-toastify/dist/ReactToastify.css';
import { TalynStoreFactory } from "./talynStoreFactory/TalynStoreFactory";
import { IEndPoint, StoreFactory } from '@palmyralabs/palmyra-wire';
import { StoreFactoryContext } from '@palmyralabs/rt-forms';
import { useContext } from 'react';
import { TalynDataStore } from './talynStoreFactory/store/TalynDataStore';


const getStoreFactory = (baseUrl: string) => {
    return new TalynStoreFactory({ baseUrl });
}

function getTenantStoreFactory(): StoreFactory<any, any> {
    return useContext(StoreFactoryContext);
}

export const useTenantFormStore = (endPoint: IEndPoint, options?: Record<string, any>, idKey?: string):TalynDataStore<any> => {
    const o = options || {};
    //@ts-ignore
    return getTenantStoreFactory().getFormStore(o, endPoint, idKey);
}

export const useTenantGridstore = (endPoint: IEndPoint, options?: Record<string, any>, idKey?: string):TalynDataStore<any> => {
    const o = options || {};
    //@ts-ignore
    return getTenantStoreFactory().getGridStore(o, endPoint, idKey);
}

export const useFormstore = (endPoint: IEndPoint, options?: Record<string, any>, idKey?: string):TalynDataStore<any> => {
    const o = options || {};
    const storeFactory = useContext(StoreFactoryContext);
    //@ts-ignore
    return storeFactory.getFormStore(o, endPoint, idKey);
}

export const useGridstore = (endPoint: IEndPoint, options?: Record<string, any>, idKey?: string):TalynDataStore<any> => {
    const o = options || {};
    const storeFactory = useContext(StoreFactoryContext);
    //@ts-ignore
    return storeFactory.getGridStore(o, endPoint, idKey);
}

export { getStoreFactory }