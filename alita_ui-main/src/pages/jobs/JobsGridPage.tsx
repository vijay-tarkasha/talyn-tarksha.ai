import { IPageInput } from "../../template/Types";
import JobGrid from "./JobGrid";
import './JobPageX.css';

const JobsGridPage = (props: IPageInput) => {
  return (
    <div className="page-content-container">
      <div className="grid-page-container">
          <JobGrid pageName={props.pageName} />
      </div>
    </div>
  )
}

export default JobsGridPage;