import { AbstractRequest, APIErrorHandlerFactory, IEndPoint, QueryParams, StoreOptions } from '@palmyralabs/palmyra-wire';
import { StringFormat } from '@palmyralabs/ts-utils';
import axios, { AxiosInstance } from 'axios';

const hasUnfilledParameter = function (url: string): boolean {
    return (typeof url === 'string' && (url.search(/({([^}]+)})/g) > 0 || url.search(/({\d})/g) > 0));
}

class PalmyraAbstractStore {
    options: StoreOptions;
    target: string
    endPoint: IEndPoint
    axiosInstance: AxiosInstance


    constructor(baseUrl: string, endPoint: IEndPoint, options: StoreOptions,
        handlerFactory?: APIErrorHandlerFactory) {
        this.axiosInstance = axios.create({
            timeout: 5000,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            withCredentials: true
        });

        const factory = handlerFactory || (() => (error) => {
            const url = error.request.responseURL || error.config.url
            console.log(error.response.status + ":" + error.code + "-requestUrl:" + url);
            console.log(error.message + " -- response data:'" + error.response.data + "'");
        });

        this.axiosInstance.interceptors.response.use(undefined, function (error) {
            error.handleGlobally = factory(error);
            return Promise.reject(error);
        })

        this.options = options;
        this.target = baseUrl;
        this.endPoint = endPoint;
    }

    queryUrl(): string {
        if (typeof this.endPoint == 'string') {
            return this.endPoint;
        } else {
            return this.endPoint.query;
        }
    }

    isApp404(error: any): boolean {
        return (404 == error.response.status
            && 404 == error.response?.data?.status_code)
    }

    getUrl(): string {
        if (typeof this.endPoint == 'string') {
            return this.endPoint;
        } else {
            return this.endPoint.get;
        }
    }

    postUrl(): string {
        const ep: IEndPoint = this.getEndPoint();
        if (typeof ep == 'string') {
            return ep;
        } else {
            return ep.post ? ep.post : ep.get;
        }
    }

    putUrl(): string {
        const ep: IEndPoint = this.getEndPoint();
        if (typeof ep == 'string') {
            return ep;
        } else {
            return ep.put;
        }
    }

    deleteUrl(): string {
        const ep: IEndPoint = this.getEndPoint();
        if (typeof ep == 'string') {
            return ep;
        } else {
            return ep.delete ? ep.delete : ep.put;
        }
    }

    getClient(): AxiosInstance {
        return axios;
    }

    getEndPoint(): IEndPoint {
        return this.endPoint;
    }

    getOptions(): Record<string, string | number> {
        return this.options?.endPointOptions || {};
    }

    getTarget(): string {
        return this.target;
    }

    formatUrl(urlFormat: string, request?: AbstractRequest): string {
        if (request)
            return StringFormat(StringFormat(urlFormat, request.options), request.endPointVars);
        else
            return urlFormat;
    }

    isUrlValid(url: string): any {
        if (hasUnfilledParameter(url)) {
            return Promise.reject("endPoint options yet to be populated " + url);
        }
        return false;
    }

    handleError(error: any, request?: AbstractRequest, onApp404?: any): Promise<never | any> {
        if (this.isApp404(error) && onApp404) {
            return Promise.resolve(onApp404);
        }

        if (request?.errorHandler) {
            if (request.errorHandler(error))
                return Promise.reject(error);
        }
        error.handleGlobally && error.handleGlobally(error);
        return Promise.reject(error);
    }

    convertQueryParams(queryParams: QueryParams): any {
        const sortOrder = queryParams?.sortOrder || {};
        const orderBy = Object.keys(sortOrder).map(field => {
            const order = sortOrder[field] === "asc" ? "+" : "-";
            return order + field;
        });

        const limit = queryParams.limit || 15;
        const _f = queryParams.filter || {};

        const _offset = queryParams.offset || 0;

        const page: number = Math.floor(_offset / limit) + 1;


        return { ..._f, page_size: limit, _orderBy: orderBy.length ? orderBy.join(',') : [], page };
    }
}

export { PalmyraAbstractStore };
