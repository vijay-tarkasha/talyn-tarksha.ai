import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import {
  ColumnDefinition,
  IPageQueryable,
  // PalmyraForm,
} from "@palmyralabs/rt-forms";
import { TalynSummaryGridControls } from "../../components/dataControl/TalynSummaryGridControls";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { ApplicationStatusColor } from "../application/StatusColor";
import ProfileImage from "../../components/widget/ProfileImage";
import CandidateId from "./editpage/CandidateId";
// import { TextField } from "../../template/mantineForm";
// import CandidateEditPage from "./editpage/CandidateEditpage";
// import ProfileImage from "../../components/widget/ProfileImage";
// import { candidateStatusColor } from "../candidates/StatusColor";
// import CandidateEditPage from "../candidates/editPage/CandidateEditPage";

interface ICandidateGridInput {
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

const CandidateGrid = (_props: ICandidateGridInput) => {
  const gridRef = useRef<IPageQueryable>(null);
  const [data, setData] = useState<any>();
  const [opened, { open, close }] = useDisclosure(false);
  // const [opened] = useDisclosure(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const candidatesTexts: any = t("candidates", { returnObjects: true });

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
      attribute: "id",
      name: "id",
      label: candidatesTexts.grid.id,
      type: "string",
      width: "50px",
      cellRenderer: clientRenderer,
    },
    // {
    //   attribute: "jobPosting.job_title",
    //   name: "job_title",
    //   label: candidatesTexts.grid.name,
    //   type: "string",
    //   sortable: false,
    // },
    {
      attribute: "name",
      name: "Name",
      label: candidatesTexts.grid.canName,
      type: "string",
      quickSearch: true,
      searchable: true,
      // sortable: true,
    },

    {
      attribute: "location",
      name: "location",
      label: candidatesTexts.grid.location,
      type: "string",
      // sortable: true,
    },
    {
      attribute: "created_on",
      name: "created_on",
      label: candidatesTexts.grid.date,
      serverPattern: "YYYY-MM-DD",
      displayPattern: "MMM DD",
      type: "date",
      width: "50px",
      // sortable: true,
    },
    {
      attribute: "updated_on",
      name: "updated_on",
      label: candidatesTexts.grid.last,
      serverPattern: "YYYY-MM-DD",
      displayPattern: "MMM DD",
      type: "date",
      width: "100px",
      // sortable: true,
    },
    {
      attribute: "resume_overview",
      name: "resume_overview",
      label: candidatesTexts.grid.resume,
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
      label: candidatesTexts.grid.status,
      type: "string",
      cellRenderer: statusRenderer,
      width: "110px",
    },
  ];

  const apiEndPoint = ServiceEndpoint.candidate.restApi;
  const getPluginOptions = (): any => {
    return {
      customAddText: btnTexts.candidate.upCan,
      filter: true,
      searchable: true,
      quickSearch: true,
    };
  };
  // console.log("Candidate API Endpoint: ", apiEndPoint);

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
    <>
      <div className="page-right-left-container">
        <PalmyraGrid
          DataGridControls={TalynSummaryGridControls}
          columns={fields}
          title={candidatesTexts.title}
          pageSize={[10, 20, 30]}
          ref={gridRef}
          quickSearch="search"
          getPluginOptions={getPluginOptions}
          onRowClick={handleRowClick}
          endPoint={apiEndPoint}
          DataGridControlProps={{ newRecord }}
          onDataChange={(data) => console.log("Loaded rows:", data)}
          EmptyChild={() => (
            <div className="text-center text-gray-500 p-4">
              No candidates to display.
            </div>
          )}
        />

        {opened && (
          <div className="mt-6 bg-white">
            <CandidateId
              close={close}
              id={data?.id}
              onRefresh={onRefresh}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CandidateGrid;
