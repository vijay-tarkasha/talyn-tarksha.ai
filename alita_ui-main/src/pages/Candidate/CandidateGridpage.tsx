import { IPageInput } from "../../template/Types";
import CandidateGrid from "./CandidateGrid";
// import NewcandidateGrid from "./CandidateGrid";

const CandidateGridpage = (props: IPageInput) => {
  return (
    <div className="page-content-container">
      <div className="">
        <CandidateGrid pageName={props.pageName} />
      </div>
    </div>
  );
};

export default CandidateGridpage;
