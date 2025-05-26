import { IPageInput } from "../../template/Types";
import ApplicationGrid from "./ApplicationGrid";
// import CandidateGrid from "./ApplicationGrid"

const ApplicationGridPage = (props: IPageInput) => {
  return (
    <div className="page-content-container">
      <div className="">
        <ApplicationGrid pageName={props.pageName} />
      </div>
    </div>
  );
};

export default ApplicationGridPage;
