import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { ColumnDefinition, IPageQueryable } from "@palmyralabs/rt-forms";
import { TalynSummaryGridControls } from "../../components/dataControl/TalynSummaryGridControls";
import ProfileImage from "../../components/widget/ProfileImage";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { ApplicationStatusColor } from "./StatusColor";
import ApplicationEditPage from "./editPage/ApplicationEditPage";


interface IApplicationGridInput {
  pageName?: string;
}

const clientRenderer = (data: any) => {
  const d = data.row.original;
  return (
    <div className="flex items-center gap-2">
      <ProfileImage name={d.name} id={d.id} className="profile_sm" />
      {/* <span>{d.name}</span> */}
    </div>
  );
};

const ApplicationGrid = (_props: IApplicationGridInput) => {
  const gridRef = useRef<IPageQueryable>(null);
  const [data, setData] = useState<any>();
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const applicationTexts: any = t("application", { returnObjects: true });

  const statusRenderer = (data: any) => {
    const status = data.row.original?.status;
    const { color, bgColor } = ApplicationStatusColor(status);
    return (
      <span
        style={{
          color: color,
          backgroundColor: bgColor,
          borderRadius: 15,
          padding: "5px 10px",
        }}
      >
        {status}
      </span>
    );
  };

  const fields: ColumnDefinition[] = [
    {
      attribute: "roleId",
      name: "roleId",
      label: applicationTexts.grid.id,
      type: "string",
      width: "50px",
      cellRenderer: clientRenderer,
    },
    {
      attribute: "jobPosting.job_title",
      name: "job_title",
      label: applicationTexts.grid.name,
      type: "string",
      sortable: false,
    },
    {
      attribute: "name",
      name: "candidateName",
      label: applicationTexts.grid.canName,
      type: "string",
      sortable: false,
      quickSearch: true,
    },
    // {
    //   attribute: "location",
    //   name: "location",
    //   label: candidatesTexts.grid.location,
    //   type: "string",
    //   sortable: false,
    // },
    {
      attribute: "created_on",
      name: "date",
      label: applicationTexts.grid.date,
      serverPattern: "YYYY-MM-DD",
      displayPattern: "MMM DD",
      type: "date",
      width: "50px",
      sortable: false,
    },
    {
      attribute: "resumeOverview",
      name: "resumeOverview",
      label: applicationTexts.grid.resume,
      type: "string",
    },
    // {
    //   attribute: "fitment_score",
    //   name: "Fitment Score",
    //   label: candidatesTexts.grid.fitment,
    //   type: "string",
    // },
    {
      attribute: "status",
      name: "status",
      label: applicationTexts.grid.status,
      type: "string",
      cellRenderer: statusRenderer,
      width: "110px",
    },
  ];

  const apiEndPoint = ServiceEndpoint.application.restApi;
  const getPluginOptions = (): any => {
    return {
      customAddText: btnTexts.application.upApp,
      filter: false,
      quickSearch: true,
    };
  };

  const handleRowClick = (rowData: any) => {
    setData(rowData);
    open();
  };

  const newRecord = () => {
    navigate("new");
  };

  const onRefresh = () => {
    gridRef?.current?.refresh();
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <div className="page-right-left-container">
      <PalmyraGrid
        DataGridControls={TalynSummaryGridControls}
        columns={fields}
        title={applicationTexts.title}
        pageSize={[10, 20, 30]}
        ref={gridRef}
        quickSearch="name"
        getPluginOptions={getPluginOptions}
        onRowClick={handleRowClick}
        endPoint={apiEndPoint}
        DataGridControlProps={{ newRecord }}
        // onDataChange={(data) => console.log("Loaded rows:", data)}
        // EmptyChild={() => (
        //   <div className="text-center text-gray-500 p-4">
        //     No candidates to display.
        //   </div>
        // )}
      />

      {opened && (
        <div className="mt-6 bg-white">
          <ApplicationEditPage
            close={close}
            id={data?.id}
            onRefresh={onRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default ApplicationGrid;
