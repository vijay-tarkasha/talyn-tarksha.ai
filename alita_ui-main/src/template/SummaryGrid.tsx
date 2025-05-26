import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { StringFormat } from "@palmyralabs/ts-utils";
import { useRef } from "react";
import { useNavigation } from "../wire/errorToast";
import { ISummaryGridInput } from "./Types";
import { SummaryGridControls } from "./gridControl/SummaryGridControls";
import './template.css';

interface IGridInput extends ISummaryGridInput {
    gridRef?: any,
    clickTo?: 'view' | 'edit'
}

function SummaryGrid(props: IGridInput) {
    const { navigateTo } = useNavigation();
    const idKey = props.idKey || 'id';
    const gridRef: any = props.gridRef || useRef(null);

    const handleRowClick = (rowData: any) => {
        const data = { id: rowData[idKey] };
        const grid = props.clickTo || 'view'
        navigateTo(StringFormat(grid + '/{id}', data));
    }

    const newRecord = () => {
        navigateTo('new');
    }

    const DataGridControls: any = props.DataGridControls || SummaryGridControls
    const rowClick = !props.disableRowClick ? handleRowClick : () => { }

    return (
        <div className="py-grid-container">
            <PalmyraGrid title={props.title} columns={props.columns}
                getPluginOptions={props.getPluginOptions} defaultParams={props.defaultParams}
                DataGridControls={DataGridControls} DataGridControlProps={{ newRecord }}
                endPoint={props.options.endPoint || ''} endPointOptions={props.options.endPointOptions}
                onRowClick={rowClick} pageSize={props.pageSize} {...props.options}
                ref={gridRef} customizer={props.customizer} quickSearch={props.quickSearch} />
        </div>
    );
}
export { SummaryGrid };
