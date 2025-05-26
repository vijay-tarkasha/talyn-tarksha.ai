
import { TalynGridStore } from "./store/TalynGridStore";
import { TalynDataStore } from "./store/TalynDataStore";
import { ChartStore, DataStore, GridStore, LookupStore, TreeQueryStore } from "./AsyncStore";
import { APIErrorHandlerFactory, IEndPoint, StoreFactory, StoreOptions, strings } from "./Types";
import { TalynLookupStore } from "./store/TalynLookupStore";

interface PalmyraStoreFactoryArg {
    baseUrl?: string
    errorHandlerFactory?: APIErrorHandlerFactory
}

class TalynStoreFactory implements StoreFactory<any, StoreOptions> {
    baseUrl: string = '/palmyra';
    errorHandlerFactory: APIErrorHandlerFactory | undefined;

    constructor(props: PalmyraStoreFactoryArg) {
        this.baseUrl = props.baseUrl || '/palmyra';
        this.errorHandlerFactory = props.errorHandlerFactory;
    }

    getGridStore(options: StoreOptions, endPoint: IEndPoint, idProperty?: strings): GridStore<any> {
        return new TalynGridStore(this.baseUrl, endPoint, options, this.errorHandlerFactory, idProperty);
    }

    getFormStore(options: StoreOptions, endPoint: IEndPoint, idProperty?: strings): DataStore<any> {
        return new TalynDataStore(this.baseUrl, endPoint, options, this.errorHandlerFactory, idProperty);
    }
    getChartStore(_options: StoreOptions, _endPoint: IEndPoint, _idProperty?: strings): ChartStore<any> {
        throw new Error("");
        // return new PalmyraChartStore(this.baseUrl, endPoint, options, this.errorHandlerFactory, idProperty);
    }
    getLookupStore(options: StoreOptions, endPoint: IEndPoint, idProperty: strings): LookupStore<any> {
        return new TalynLookupStore(this.baseUrl, endPoint, options, this.errorHandlerFactory, idProperty);
    }
    getTreeStore(_options: StoreOptions, _endPoint: IEndPoint): TreeQueryStore<any, any> {
        throw new Error("");
        // return new PalmyraTreeStore(this.baseUrl, endPoint, options, this.errorHandlerFactory);
    }
}

export { TalynStoreFactory };