import { ChartStore, DataStore, GridStore, LookupStore, TreeQueryStore } from "./AsyncStore";

interface IPagination {
    offset?: number,
    limit?: number,
    total?: boolean
}

interface StoreOptions {
    endPointOptions?: Record<string, string | number>
}

interface FormStoreFactory<T, O extends StoreOptions> {
    getFormStore(options: O, endPoint: IEndPoint, idProperty?: strings): DataStore<T>;
    getLookupStore(options: O, endPoint: IEndPoint, idProperty: strings): LookupStore<T>;
}

interface GridStoreFactory<T, O extends StoreOptions> {
    getGridStore(options: O, endPoint: IEndPoint, idProperty?: strings): GridStore<T>;
}

interface ChartStoreFactory<T, O extends StoreOptions> {
    getChartStore(options: O, endPoint?: IEndPoint): ChartStore<T>;
}

interface TreeStoreFactory<_T, O extends StoreOptions> {
    getTreeStore(options: O, endPoint: IEndPoint): TreeQueryStore<any, any>;
}

interface StoreFactory<T, O extends StoreOptions> extends FormStoreFactory<T, O>,
    GridStoreFactory<T, O>, ChartStoreFactory<T, O>, TreeStoreFactory<T, O> {

}

interface MultiEndPoint {
    query: string,
    get: string,
    post?: string,
    put: string,
    delete?: string
}

type IEndPointOptions = Record<string, any>
type IEndPoint = string | MultiEndPoint;

type strings = string | string[];

type ErrorHandler = (error: any) => boolean;
type APIErrorHandlerFactory = (config?: any) => ErrorHandler

interface AbstractHandler {
    transformResult?: (d: any) => any,
    transformRequest?: (d: any) => any
}

interface AbstractRequest extends AbstractHandler {
    options?: QueryOptions,
    endPointVars?: IEndPointOptions,
    errorHandler?: ErrorHandler
}

interface CriteriaOptions {
    filter?: Record<string, any>,
}

interface QueryParams extends IPagination, CriteriaOptions {
    sortOrder?: Record<string, "asc" | "desc" | undefined>
}

interface QueryRequest extends QueryParams, AbstractRequest {
    fields?: string[]
}

type EXPORT_FORMAT = 'csv' | 'excel' | 'pdf' | 'doc';

interface ExportRequest extends QueryRequest {
    format: EXPORT_FORMAT;
}

interface QueryResponse<T> {
    result: T[],
    offset?: number,
    limit?: number,
    total?: number
}

interface GetRequest extends CriteriaOptions, AbstractRequest {
    key?: string,
    fields?: string[]
}

interface PostRequest extends AbstractRequest {

}

interface PutRequest extends AbstractRequest {

}

interface RemoveRequest extends AbstractRequest {

}

interface QueryOptions extends Record<string, any> {

}

interface ErrorResponse {
    status: number,
    message: string
}

interface QueryResponseHandler<T> {
    onResponse(response: QueryResponse<T>): void;
    onFailure?(body: ErrorResponse): void;
}

interface ResponseHandler<T> {
    onResponse(response: T): void;
    onFailure?(body: ErrorResponse): void;
}

interface Tree<T extends Tree<T>> {
    children?: T[];
}

const noopTransform = (d: any) => d;

export type { IPagination, CriteriaOptions, QueryRequest, QueryResponse, QueryOptions, Tree, QueryParams, AbstractRequest }
export type { GetRequest, PostRequest, PutRequest, RemoveRequest, ExportRequest, strings }
export type { QueryResponseHandler, ResponseHandler, ErrorResponse, EXPORT_FORMAT, StoreFactory }
export type { ErrorHandler, APIErrorHandlerFactory, MultiEndPoint, IEndPoint, IEndPointOptions }
export type { GridStoreFactory, ChartStoreFactory, FormStoreFactory, TreeStoreFactory }
export type { AbstractHandler, StoreOptions }

export { noopTransform }