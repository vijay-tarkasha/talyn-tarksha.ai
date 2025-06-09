// import { Modal } from "@mantine/core";
import {
  CellGetter,
  ColumnDefinition,
  GridCustomizer,
  IPageQueryable,
  useGridColumnCustomizer,
} from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { StringFormat } from "@palmyralabs/ts-utils";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import DeleteConfirmDialog from "../../common/components/dialog/DeleteConfirmDialog";
import { TalynSummaryGridControls } from "../../components/dataControl/TalynSummaryGridControls";
import ProfileImage from "../../components/widget/ProfileImage";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { IPageInput } from "../../template/Types";
import JobUpdatePage from "./JobUpdatePage";

const roleIdRenderer = (data: any) => {
  const d = data.row.original;
  return (
    <span>
      <div className="grid">
        <ProfileImage name={d.job_title} id={d.id} className={"profile_sm"} />
      </div>
    </span>
  );
};

const JobGrid = (_props: IPageInput) => {
  const gridRef = useRef<IPageQueryable>(null);
  const { t } = useTranslation();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const jobTexts: any = t("jobPage", { returnObjects: true });
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const endPoint: any = ServiceEndpoint.job.restApi;
  const dialogFormRef: any = useRef<any>();
  const [data, setData] = useState<any>();

  const fields: ColumnDefinition[] = [
    {
      attribute: "roleId",
      name: "roleId",
      label: jobTexts.grid.id,
      type: "string",
      width: "50px",
      cellRenderer: roleIdRenderer,
    },
    {
      attribute: "job_title",
      name: "job_title",
      label: jobTexts.grid.name,
      type: "string",
      quickSearch: true,
      searchable: true,
    },
    {
      attribute: "job_short_desc",
      name: "job_desc",
      label: jobTexts.grid.shDesc,
      width: "111px",
      type: "string",
    },
    {
      attribute: "created_on",
      name: "created_on",
      label: jobTexts.grid.date,
      serverPattern: "YYYY-MM-DD",
      displayPattern: "DD MMM",
      width: "50px",
      type: "date",
    },
    {
      attribute: "uploaded",
      name: "uploaded",
      label: jobTexts.grid.upload,
      type: "string",
    },
    {
      attribute: "screened",
      name: "screened",
      label: jobTexts.grid.screened,
      type: "string",
    },
    {
      attribute: "status",
      name: "status",
      label: jobTexts.grid.status,
      type: "string",
    },
    {
      attribute: "action",
      name: "action",
      label: jobTexts.grid.action,
      type: "string",
    },
    // {
    //   attribute: "salary_max",
    //   name: "salary_max",
    //   label: jobTexts.grid.salary,
    //   type: "string",
    // },
  ];

  function enhance(): CellGetter {
    return (info: any) => {
      const data: any = info.row.original;
      return (
        <div onClick={(e) => handleRemove(e, data)}>
          <LuTrash2 className="grid-action-icon" />
        </div>
      );
    };
  }

  const handleRemove = (event: any, data: any) => {
    setData(data);
    setShowDeletePopup(true);
    event.stopPropagation();
  };

  const gridRefresh = () => {
    gridRef?.current?.refresh();
  };

  const onDelete = () => {
    gridRefresh();
  };

  const onClose = () => {
    setDialogOpen(false);
    gridRefresh();
  };

  const customConfig: Record<string, (d: CellGetter) => CellGetter> = {
    action: enhance,
  };

  const getPluginOptions = (): any => {
    return {
      customAddText: btnTexts.job.cJob,
      filter: true,
      quickSearch: true,
      searchable: true,
    };
  };

  const newRecord = () => {
    navigate("new");
  };

  const handleRowClick = (rowData: any) => {
    setData(rowData);
    setDialogOpen(true);
  };

  const rowClick = handleRowClick;

  const gridCustomizer: GridCustomizer = useGridColumnCustomizer(customConfig);

  const deleteEndpoint = StringFormat(ServiceEndpoint.job.byId, {
    id: data?.id,
  });

  return (
    <div className="page-right-left-container">
      <PalmyraGrid
        DataGridControls={TalynSummaryGridControls}
        columns={fields}
        DataGridControlProps={{ newRecord }}
        customizer={gridCustomizer}
        title={jobTexts?.title}
        ref={gridRef}
        quickSearch="search"
        getPluginOptions={getPluginOptions}
        endPoint={endPoint}
        onRowClick={rowClick}
        pageSize={[10, 20, 30]}
        // EmptyChild={() => (
        //   <div className="text-center text-gray-400 p-4 text-3xl font-bold">
        //     No jobs to display.
        //   </div>
        // )}
      />

      {/* <Modal
        opened={dialogOpen}
        onClose={onClose}
        centered
        className="candidate-modal"
        title={jobTexts?.edit?.title}
        transitionProps={{ transition: "fade", duration: 200 }}
      > */}
      {/* <JobEditPage /> */}
      {/* <JobUpdatePage
          dialogRef={dialogFormRef}
          data={data}
          dialogOpen={dialogOpen}
          onClose={onClose}
        /> */}
      {/* </Modal> */}

      {dialogOpen && (
        <div className="mt-6 bg-white">
          <JobUpdatePage
            dialogRef={dialogFormRef}
            data={data}
            dialogOpen={dialogOpen}
            onClose={onClose}
          />
        </div>
      )}

      <DeleteConfirmDialog
        data={data?.job_title}
        onDelete={onDelete}
        endPoint={deleteEndpoint}
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
        }}
      />
    </div>
  );
};

export default JobGrid;
