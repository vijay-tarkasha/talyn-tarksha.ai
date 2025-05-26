import { ExportDataButton, IDataGridDefaultControlConfig, QuickSearch } from "@palmyralabs/rt-forms-mantine";
import { SummaryGridPluginOptions } from "../Types";
import { Button } from "@mantine/core";
import { useTranslation } from "react-i18next";


const SummaryGridControls = (props: SummaryGridPluginOptions) => {
    const { getPluginOptions, ...o } = props;
    const pluginOptions: IDataGridDefaultControlConfig = getPluginOptions ? getPluginOptions() : {};
    const { t } = useTranslation();
    const btnTexts: any = t('buttonLabels', { returnObjects: true });

    return (<>
        {o.quickSearch && <QuickSearch width="200" queryRef={o.queryRef}
            columns={o.columns} {...pluginOptions.quickSearch} />}
        {/* <FilterButton {...o} /> */}
        <ExportDataButton exportOption={{ csv: 'CSV' }}
            visible={pluginOptions.export?.visible} disabled={pluginOptions.export?.disabled}
            queryRef={o.queryRef} {...pluginOptions.export} />
        <Button onClick={() => props.newRecord()}
            {...pluginOptions.add} className="py-action-button">
            {btnTexts.add}
        </Button>
    </>);
}

export { SummaryGridControls }