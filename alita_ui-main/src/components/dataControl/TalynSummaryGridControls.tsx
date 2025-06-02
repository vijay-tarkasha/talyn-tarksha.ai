import { Button } from "@mantine/core";
import {
  ExportDataButton,
  FilterButton,
  IDataGridDefaultControlConfig,
  QuickSearch,
} from "@palmyralabs/rt-forms-mantine";
import { FaPlus } from "react-icons/fa";
// import { GoSearch } from "react-icons/go";

interface IGridControlOption extends IDataGridDefaultControlConfig {}
interface IOptions extends IGridControlOption {
  onNewClick?: any;
  customAddText?: string;
  filter?: boolean;
}
const TalynSummaryGridControls = (props: any) => {
  const { getPluginOptions, ...o } = props;
  const pluginOptions: IOptions = getPluginOptions ? getPluginOptions() : {};
  const handleNewClick = pluginOptions.onNewClick
    ? pluginOptions.onNewClick
    : () => props.newRecord();
  const btnText = pluginOptions.customAddText
    ? pluginOptions.customAddText
    : "Add";

  return (
    <>
      {pluginOptions.quickSearch && (
        <QuickSearch
          width="200"
          queryRef={o.queryRef}
          columns={o.columns}
          {...pluginOptions.quickSearch}
        />
      )}
      {/* <TextInput placeholder="Search" leftSection={<GoSearch color="black" />} /> */}
      {pluginOptions.filter && <FilterButton {...o} />}

      {pluginOptions.export?.visible && (
        <ExportDataButton
          exportOption={{ csv: "CSV" }}
          visible={pluginOptions.export?.visible}
          disabled={pluginOptions.export?.disabled}
          queryRef={o.queryRef}
          {...pluginOptions.export}
        />
      )}
      {pluginOptions.add?.visible !== false && (
        <Button
          onClick={handleNewClick}
          {...pluginOptions.add}
          className="py-action-button"
          leftSection={<FaPlus />}
        >
          {btnText}
        </Button>
      )}
    </>
  );
};

export { TalynSummaryGridControls };
