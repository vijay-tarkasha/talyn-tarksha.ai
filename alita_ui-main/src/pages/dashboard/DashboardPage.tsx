import { YearPickerInput } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineCalendarToday } from "react-icons/md";
import PageHeader from "../../components/PageHeader";
import DashBoardContent from "./DashBoardContent";
import './DashboardPage.css';

const DashboardPage = () => {
  const { t } = useTranslation();
  const dashTxt: any = t('dashboard', { returnObjects: true })

  return (
    <div>
      <PageHeader title={dashTxt?.title}
        rightContent={
          <YearPickerInput
            variant="filled"
            defaultValue={new Date()}
            leftSection={<MdOutlineCalendarToday />}
            rightSection={<IoIosArrowDown />}
            placeholder="Pick year"
          />
        } />
      <div className="h-[calc(100vh - 120px)] overflow-hidden">
        <DashBoardContent />
      </div>
    </div>
  )
}

export default DashboardPage;