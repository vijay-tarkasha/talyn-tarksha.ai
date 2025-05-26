import { CellGetter, ColumnDefinition, GridCustomizer, IPageQueryable, useGridColumnCustomizer } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { StringFormat } from '@palmyralabs/ts-utils';
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuTrash2 } from "react-icons/lu";
import DeleteConfirmDialog from "../../common/components/dialog/DeleteConfirmDialog";
import ProfileImage from "../../components/widget/ProfileImage";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";

const roleIdRenderer = (data: any) => {
    const d = data.row.original;
    return <span>
        <div className='grid'>
            <ProfileImage name={d.job_title} id={d.id} className={"profile_sm"} />
        </div>
    </span>;
}

const JobListings = () => {
    const gridRef = useRef<IPageQueryable>(null);
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const jobTexts: any = t('jobPage', { returnObjects: true });
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
    const endPoint: any = ServiceEndpoint.job.restApi;
    const [data, setData] = useState<any>();

    const fields: ColumnDefinition[] = [
        {
            attribute: "roleId",
            name: "roleId",
            label: jobTexts.dashboardgrid.client,
            type: "string",
            cellRenderer: roleIdRenderer
        },
        {
            attribute: "job_title",
            name: "job_title",
            label: jobTexts.dashboardgrid.jobTitle,
            type: "string"
        },
        {
            attribute: "created_on",
            name: "created_on",
            label: jobTexts.dashboardgrid.date,
            serverPattern: "YYYY-MM-DD",
            displayPattern: "MMM DD",
            width: '50px',
            type: "date"
        },
        {
            attribute: "screened",
            name: "screened",
            label: jobTexts.dashboardgrid.screened,
            type: "string"
        },
        {
            attribute: "status",
            name: "status",
            label: jobTexts.dashboardgrid.status,
            type: "string"
        },
        // {
        //     attribute: "action",
        //     name: "action",
        //     label: "Action",
        //     type: 'string'
        // }
    ];

    function enhance(): CellGetter {
        return (info: any) => {
            const data: any = info.row.original;
            return (
                <div onClick={(e) => handleRemove(e, data)}>
                    <LuTrash2 className="grid-action-icon" />
                </div>
            )
        };
    }

    const handleRemove = (event: any, data: any) => {
        setData(data);
        setShowDeletePopup(true);
        event.stopPropagation();
    }

    const gridRefresh = () => {
        gridRef?.current?.refresh();
    }

    const onDelete = () => {
        gridRefresh();
    }
    const customConfig: Record<string, ((d: CellGetter) => CellGetter)> = {
        'action': enhance
    }

    const getPluginOptions = (): any => {
        return { customAddText: btnTexts.job.cJob }
    }

    const gridCustomizer: GridCustomizer = useGridColumnCustomizer(customConfig);

    const deleteEndpoint = StringFormat(ServiceEndpoint.job.byId, { id: data?.id });

    const JobSummaryGridControls = (_props: any) => {
        return (<>

        </>)
    }

    return (
        <div>
            <div className="text-base md:text-lg font-semibold">
                {jobTexts?.dashboardgrid?.title}</div>
            <PalmyraGrid DataGridControls={JobSummaryGridControls}
                columns={fields} customizer={gridCustomizer}
                title={''} ref={gridRef} getPluginOptions={getPluginOptions}
                endPoint={endPoint} pageSize={[4, 10, 20]} />

            <DeleteConfirmDialog data={data?.job_title} onDelete={onDelete} endPoint={deleteEndpoint}
                isOpen={showDeletePopup} onClose={() => { setShowDeletePopup(false) }} />
        </div>
    )
}

export default JobListings;