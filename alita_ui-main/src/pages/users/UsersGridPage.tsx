import { IPageInput } from "../../template/Types";
import UserGrid from "./UsersGrid";

const UsersGridPage = (props: IPageInput) => {
  return (
    <div className="page-content-container">
      <div className="grid-page-container">
        <UserGrid pageName={props.pageName} />
      </div>
    </div>
  )
}
export default UsersGridPage;