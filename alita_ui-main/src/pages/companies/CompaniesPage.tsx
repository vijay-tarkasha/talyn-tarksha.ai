import { IPageInput } from "../../template/Types";
import './CompanyPageX.css';
import CompanyViewForm from "./CompanyViewPage";

const CompaniesPage = (_props: IPageInput) => {
  return (
    <div className="page-content-container">
        <div>
          <CompanyViewForm />
        </div>
    </div>
  )
}

export default CompaniesPage
