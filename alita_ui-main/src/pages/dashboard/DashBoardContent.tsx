import { useEffect } from "react";
import { getPxcel } from "../../wire/errorToast";
import UploadedCandidates from "../application/UploadedApplications";
import StatisticsChart from "./chart/StatisticsChart";
import JobListings from "./JobListings";
import { useTranslation } from "react-i18next";

const DashBoardContent = () => {
  const { t } = useTranslation();
  const title: any = t("dashboard", { returnObjects: true });
  useEffect(() => {
    const element: any = document.querySelector(".chart-container");
    if (element) {
      element.style.height = getPxcel("30%", "200px");
    }
  }, []);

  return (
    <div className="lg:space-x-0 px-4 py-2 gap-3 w-full lg:block xl:flex overflow-y-auto h-[calc(100vh-70px)] sm:h-auto transition-all duration-500 ease-out">
      <div className="flex-none md:flex-7 space-y-2 xl:h-[calc(100vh-8rem)] lg:h-auto overflow-y-auto xl:pb-12 pb-3 transition-all duration-500 ease-in-out">
        <div className="space-y-4 border-gray-100 border-1 rounded-lg p-2 m-0 grid grid-cols-1 transition-all duration-500 ease-in-out">
          <div className="text-base md:text-lg font-semibold">
            {title?.chartTitle}
          </div>
          <StatisticsChart />
        </div>
        <div className="space-y-4 border-gray-100 border-1 rounded-lg p-2 mt-3 m-0 grid grid-cols-1 transition-all duration-500 ease-in-out">
          <JobListings />
        </div>
      </div>
      <div
        className="flex-none md:flex-3 xl:h-[calc(100vh-8rem)] lg:h-auto overflow-y-auto 
                    pb-12 transition-all duration-500 ease-in-out"
      >
        <UploadedCandidates />
      </div>
    </div>
  );
};

export default DashBoardContent;
