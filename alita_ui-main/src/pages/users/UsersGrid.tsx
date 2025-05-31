import { ColumnDefinition, IPageQueryable } from "@palmyralabs/rt-forms";
import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TalynSummaryGridControls } from "../../components/dataControl/TalynSummaryGridControls";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import ProfileImage from "../../components/widget/ProfileImage";

interface IUserGridInput {
  pageName?: string;
}

const clientRenderer = (data: any) => {
  const d = data.row.original;
  return (
    <span>
      <div className="grid">
        <ProfileImage
          name={d.company_name}
          id={d.id}
          className={"profile_sm"}
        />
      </div>
    </span>
  );
};

const UserGrid = (_props: IUserGridInput) => {
  const gridRef = useRef<IPageQueryable>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const usersTexts: any = t("users", { returnObjects: true });

  const fields: ColumnDefinition[] = [
    {
      attribute: "id",
      name: "id",
      label: usersTexts.grid.id,
      type: "string",
      cellRenderer: clientRenderer,
      quickSearch: true,
    },
    {
      attribute: "email",
      name: "email",
      label: usersTexts.grid.email,
      type: "string",
    },
    {
      attribute: "company_name",
      name: "userName",
      label: usersTexts.grid.name,
      type: "string",
    },
    {
      attribute: "mobile",
      name: "mobile",
      label: usersTexts.grid.mobile,
      type: "string",
    },
    {
      attribute: "location",
      name: "location",
      label: usersTexts.grid.location,
      type: "string",
    },
    {
      attribute: "status",
      name: "Status",
      label: usersTexts.grid.status,
      type: "string",
    },
  ];

  const apiEndPoint = ServiceEndpoint.user.restApi;
  const getPluginOptions = (): any => {
    return { customAddText: btnTexts?.user?.create, quickSearch: true };
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
        title={usersTexts.grid.title}
        pageSize={[10, 20, 30]}
        ref={gridRef}
        quickSearch="id"
        getPluginOptions={getPluginOptions}
        endPoint={apiEndPoint}
        DataGridControlProps={{ newRecord }}
      />
    </div>
  );
};

export default UserGrid;
