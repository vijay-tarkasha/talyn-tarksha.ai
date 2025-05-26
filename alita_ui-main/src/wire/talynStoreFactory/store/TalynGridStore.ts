import { APIErrorHandlerFactory, ExportRequest, GetRequest, GridStore, IEndPoint, noopTransform, QueryRequest, QueryResponse, StoreOptions, strings } from "@palmyralabs/palmyra-wire";
import { PalmyraAbstractStore } from "./AbstractStore";
import { AxiosRequestConfig } from "axios";

class TalynGridStore extends PalmyraAbstractStore implements GridStore<any> {
    idProperty: strings

    constructor(baseUrl: string, endPoint: IEndPoint, options: StoreOptions,
        factory?: APIErrorHandlerFactory, idProperty?: strings) {
        super(baseUrl, endPoint, options, factory);
        this.idProperty = idProperty || 'id';
    }

    getEndPoint(): IEndPoint {
        return this.endPoint;
    }

    query(request: QueryRequest): Promise<QueryResponse<any>> {
        var urlFormat = this.target + this.queryUrl();
        const onResult = request?.transformResult || noopTransform;
        var url: any = this.formatUrl(urlFormat, request);
        const urlSortParams = (this.convertQueryParams(request));
        const params: AxiosRequestConfig = {
            params: urlSortParams, headers: {
            }
        };

        const transform = (d: any) => {
            const offset = (d.current_page - 1) * d.page_size;
            return { result: d.results, total: d.count, offset, limit: d.page_size }
        }

        return this.isUrlValid(url) || this.getClient().get(url, params)
            .then(response => onResult(transform(response.data.result)))
            .catch(error => this.handleError(error, request, {
                result: [],
                total: 0
            }));
    }

    export(request: ExportRequest): void {
        var urlFormat = this.target + this.queryUrl();
        var url: any = this.formatUrl(urlFormat, request);
        const urlSortParams = (this.convertQueryParams(request));
        urlSortParams._format = request.format;

        const queryParams = new URLSearchParams(urlSortParams).toString();

        window.open(url + '?' + queryParams, '_blank');
    }

    queryLayout(request: QueryRequest): Promise<any> {
        const onResult = request?.transformResult || noopTransform;
        var urlFormat = this.target + this.queryUrl();
        var url: any = this.formatUrl(urlFormat, request);
        return this.isUrlValid(url) || this.getClient().get(url, {
            headers: {
                action: 'schema'
            }
        })
            .then(response => onResult(response.data))
            .catch(error => this.handleError(error, request));
    }

    get(request: GetRequest, _idProperty?: string): Promise<any> {
        var urlFormat = this.target + this.getUrl();
        const onResult = request?.transformResult || noopTransform;
        var url: any = this.formatUrl(urlFormat, request);
        return this.isUrlValid(url) || this.getClient().get(url)
            .then(response => onResult(response.data?.result))
            .catch(error => this.handleError(error, request));
    }

    getIdentity(_o: any) {
        throw new Error("Method not implemented.");
    }

    getIdProperty(): string {
        return "id";
    }
}

export { TalynGridStore };