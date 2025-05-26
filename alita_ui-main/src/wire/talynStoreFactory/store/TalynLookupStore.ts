import { LookupStore } from "../AsyncStore";
import { QueryRequest, QueryResponse, APIErrorHandlerFactory, strings, IEndPoint, noopTransform, StoreOptions } from "../Types";
import { PalmyraAbstractStore } from "./AbstractStore";

class TalynLookupStore extends PalmyraAbstractStore implements LookupStore<any> {
    idProperty: strings

    constructor(baseUrl: string, endPoint: IEndPoint, options: StoreOptions,
        factory?: APIErrorHandlerFactory, idProperty?: strings) {
        super(baseUrl, endPoint, options, factory);
        this.idProperty = idProperty || 'id';
    }

    query(request: QueryRequest): Promise<QueryResponse<any>> {
        var urlFormat = this.target + this.queryUrl();
        const onResult = request?.transformResult || noopTransform;
        var url: any = this.formatUrl(urlFormat, request);
        const urlSortParams = (this.convertQueryParams(request));
        const params = { params: urlSortParams };

        const transform = (d: any) => {
            const offset = (d.current_page - 1) * d.page_size;
            return { result: d.results, total: d.count, offset, limit: d.page_size }
        }

        return this.isUrlValid(url) || this.getClient().get(url, params)
            .then(response => onResult(transform(response.data.result)))
            .catch(error => this.handleError(error, request));
    }
}

export { TalynLookupStore };