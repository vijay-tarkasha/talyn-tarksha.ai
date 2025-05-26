import { IEndPoint, IEndPointOptions } from "@palmyralabs/palmyra-wire"
import { ColumnDefinition, DataGridPluginOptions, GridCustomizer, IExportOptions } from "@palmyralabs/rt-forms"
import { FC } from "react"

interface IPageInput {
    title?: string,
    pageName: string,
    errorText?: any
}

interface IOptions {
    endPoint?: IEndPoint,
    endPointOptions?: IEndPointOptions
    idKey?: string
}

interface queryOptions {
    queryOptions?: {
        filter?: any
    },
}

interface IFormInput {
    onComplete?: (data: any) => void,
    onSave?: (data: any) => void,
    onFailure?: (error: any) => void,
    onCancel?: () => void
}

interface IFormEditInput extends IPageInput {
    options: IOptions,
    id: string,
    children?: any,
    onDataRefresh?: (data: any) => void,
    successMsg?: string
}

interface IFormNewInput extends IPageInput, IFormInput {
    options: IOptions,
    children?: any,
    id?: string,
    initialData?: {},
    successMsg?: string
}

interface IFormViewInput extends IPageInput, IFormInput {
    options: IOptions,
    id: string,
    children: any
}

interface IGridInput {
    customizer?: GridCustomizer,
    quickSearch?: string,
    options: IOptions & queryOptions,
    columns: ColumnDefinition[],
    pageSize?: number[],
    exportOptions?: IExportOptions,
    defaultParams?: any,
    Child?: FC,
    childProps?: Record<any, any>,
    getPluginOptions?: () => any;
    DataGridControls?: (props: DataGridPluginOptions) => JSX.Element;
}

interface ISummaryGridInput extends IPageInput, IGridInput {
    densityOptions?: any,
    idKey?: string,
    disableRowClick?: boolean
}

interface SummaryGridPluginOptions extends DataGridPluginOptions {
    newRecord: () => void
}

interface PopupGridPluginOptions extends DataGridPluginOptions {
    setFormData: (d: any) => void
}

export type {
    IPageInput, IFormEditInput, IFormNewInput, IFormViewInput,
    ISummaryGridInput, IFormInput, IOptions, SummaryGridPluginOptions, PopupGridPluginOptions
}