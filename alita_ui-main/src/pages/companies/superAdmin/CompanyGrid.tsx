import { ColumnDefinition, IPageQueryable } from '@palmyralabs/rt-forms';
import { useRef } from 'react'
import { SummaryGrid } from '../../../template/SummaryGrid';
import { TalynSummaryGridControls } from '../../../components/dataControl/TalynSummaryGridControls';
import { useTranslation } from 'react-i18next';

interface ICompanyGridInput {
    pageName?: string
}
const CompanyGrid = (props: ICompanyGridInput) => {
    const gridRef = useRef<IPageQueryable>(null);
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });
    const companyTexts: any = t('company', { returnObjects: true });

    const fields: ColumnDefinition[] = [
        {
            attribute: "client",
            name: "client",
            label: companyTexts.grid.client,
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "companyName",
            name: "companyName",
            label: companyTexts.grid.compName,
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "date",
            name: "date",
            label: companyTexts.grid.date,
            searchable: true,
            sortable: true,
            displayPattern: "MM-DD-YYYY",
            type: "date"
        },
        {
            attribute: "jobs",
            name: "jobs",
            label: companyTexts.grid.jobs,
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "candidates",
            name: "candidates",
            label: companyTexts.grid.candidates,
            searchable: true,
            sortable: true,
            type: "string"
        },
        {
            attribute: "status",
            name: "status",
            label: companyTexts.grid.status,
            searchable: true,
            sortable: true,
            type: "string"
        }
    ];

    const apiEndPoint = '/company';
    const getPluginOptions = (): any => {
        return { customAddText: btnTexts.companies.cComp }
    }
    
    return (
        <div>
            <SummaryGrid DataGridControls={TalynSummaryGridControls}
                columns={fields} pageName={props.pageName || ''}
                title={companyTexts.title} gridRef={gridRef} getPluginOptions={getPluginOptions}
                options={{ endPoint: apiEndPoint }} />
        </div>
    )
}

export default CompanyGrid