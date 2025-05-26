import { IPageQueryable, ServerCardLayout } from "@palmyralabs/rt-forms";
import { SelectablePagination } from "@palmyralabs/rt-forms-mantine";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { useTenantGridstore } from "../../wire/AppStoreFactory";
import CandidatesItemList from "./ApplicationItemList";

const UploadedApplications = (props: any) => {
  const apiEndPoint = ServiceEndpoint.candidate.restApi;
  const store = useTenantGridstore(apiEndPoint);
  const { t } = useTranslation();
  const applicationTexts: any = t("application", { returnObjects: true });

  const refreshTopic = props.pageName + "/refresh";

  const queryRef = useRef<IPageQueryable>();
  const paginationRef = useRef<any>();

  const onDataChange = (_newData: any[], _oldData?: any[]) => {
    if (paginationRef.current && paginationRef.current.refresh) {
      try {
        paginationRef.current.refresh();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="border-gray-100 border-1 rounded-lg pb-2">
      <div className="text-base text-center md:text-lg font-semibold sticky top-0 lg:z-0 xl:z-10 p-2 dash-user-update-header">
        {applicationTexts?.subTitle}
      </div>
      <div className="candidate-card-wrapper">
        <ServerCardLayout
          Child={CandidatesItemList}
          onDataChange={onDataChange}
          ref={queryRef}
          store={store}
          pageSize={[10, 20, 30]}
        />
        <div className="candidate-card">
          <SelectablePagination
            pageSize={[10, 20, 30]}
            queryRef={queryRef}
            topic={refreshTopic}
            {...props}
            ref={paginationRef}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadedApplications;
