// import { useEffect } from "react";
// import { getPxcel } from "../../wire/errorToast";
// import UploadedCandidates from "../application/UploadedApplications";
// import StatisticsChart from "./chart/StatisticsChart";
// import JobListings from "./JobListings";
// import { useTranslation } from "react-i18next";
// import StatisticsChart1 from "./chart/StatisticsChart1";
// import StatisticsChart2 from "./chart/StatisticsChart2";
// import StatisticsChart3 from "./chart/StatisticsChart3";
// import StatisticsChart4 from "./chart/StatisticsChart4";

// const DashBoardContent = () => {
//   const { t } = useTranslation();
//   const title: any = t("dashboard", { returnObjects: true });
//   useEffect(() => {
//     const element: any = document.querySelector(".chart-container");
//     if (element) {
//       element.style.height = getPxcel("30%", "200px");
//     }
//   }, []);

//   return (
//     <div className="lg:space-x-0 px-4 py-2 gap-3 w-full lg:block xl:flex overflow-y-auto h-[calc(100vh-70px)] sm:h-auto transition-all duration-500 ease-out">
//       <div className="flex-none md:flex-7 space-y-2 xl:h-[calc(100vh-8rem)]   transition-all duration-500 ease-in-out">
//         <div className="space-y-4 border-gray-100 border-1 rounded-lg p-2 m-0 grid grid-cols-1 transition-all duration-500 ease-in-out">
//           <div className="text-base md:text-lg font-semibold">
//             {title?.chartTitle}
//           </div>
//           <StatisticsChart />
//         </div>
//         <div className="space-y-4 border-gray-100 border-1 rounded-lg p-2 mt-3 m-0 grid grid-cols-1 transition-all duration-500 ease-in-out">
//           <JobListings />
//         </div>
//       </div>
//       <div
//         className="flex-none md:flex-3 xl:h-[calc(100vh-8rem)]
//                      transition-all duration-500 ease-in-out"
//       >
//         <UploadedCandidates />
//       </div>
//     </div>
//   );
// };

// export default DashBoardContent;

// import { useEffect } from "react";
// import { getPxcel } from "../../wire/errorToast";
// import UploadedCandidates from "../application/UploadedApplications";
// // // import StatisticsChart from "./chart/StatisticsChart"
// // import JobListings from "./JobListings"
// import { useTranslation } from "react-i18next";
// // import Chart1 from "./chart/Chart1"
// // import Chart2 from "./chart/Chart2"
// // import Chart3 from "./chart/Chart3"
// // import Chart4 from "./chart/Chart4"
// import StatisticsChart1 from "./chart/StatisticsChart1";
// import StatisticsChart2 from "./chart/StatisticsChart2";
// import StatisticsChart3 from "./chart/StatisticsChart3";
// import StatisticsChart4 from "./chart/StatisticsChart4";
// // import { PalmyraGrid } from "@palmyralabs/rt-forms-mantine";
// // import { TalynSummaryGridControls } from "../../components/dataControl/TalynSummaryGridControls";
// // import { GridCustomizer, useGridColumnCustomizer } from "@palmyralabs/rt-forms";
// import JobListings from "./JobListings";

// const DashBoardContent = () => {
//   const { t } = useTranslation();
//   const title: any = t("dashboard", { returnObjects: true });
//   useEffect(() => {
//     const element: any = document.querySelector(".chart-container");
//     if (element) {
//       element.style.height = getPxcel("30%", "200px");
//     }
//   }, []);
//   // const gridCustomizer: GridCustomizer = useGridColumnCustomizer(customConfig);
//   // const customConfig: Record<string, ((d: CellGetter) => CellGetter)> = {
//   //     'action': enhance
//   // }
//   const jobTexts: any = t("jobPage", { returnObjects: true });
//   const btnTexts: any = t("buttonLabels", { returnObjects: true });

//   const getPluginOptions = (): any => {
//     return {
//       customAddText: btnTexts.job.cJob,
//       filter: true,
//       quickSearch: true,
//     };
//   };

//   return (
//     <>
//       <div className="lg:space-x-0 px-4 py-2 gap-2 w-full lg:block xl:flex overflow-y-auto h-[calc(100vh-70px)] sm:h-auto transition-all duration-500 ease-out">
//         <div className="flex-none md:flex-7 space-y-2  xl:pb-10 pb-3 transition-all duration-500 ease-in-out">
//           <div className="space-y-1 p-1 m-0 grid grid-cols-2 gap-2 transition-all duration-500 ease-in-out">
//             <div className="overflow-hidden">
//               <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
//                 <div className="text-base md:text-lg font-semibold p-2">
//                   {title?.chartTitle1}
//                   {/* <PalmyraGrid DataGridControls={TalynSummaryGridControls}
//                                     columns={} customizer={}
//                                     title={jobTexts?.title} ref={ } getPluginOptions={getPluginOptions}
//                                     endPoint={''} pageSize={[10, 20, 30]}
//                                     EmptyChild={() => (<div>No Job Found</div>)}
//                                 // onDataChange={(data)=>console.log(data)}
//                                 /> */}
//                   <StatisticsChart1 />
//                   {/* <Chart1 /> */}
//                 </div>
//               </div>
//               <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
//             </div>
//             <div className="overflow-hidden">
//               <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
//                 <div className="text-base md:text-lg font-semibold p-2">
//                   {title?.chartTitle2}
//                   {/* <Chart2 /> */}
//                   <StatisticsChart2 />
//                 </div>
//               </div>
//               <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
//             </div>
//             <div className="overflow-hidden">
//               <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
//                 <div className="text-base md:text-lg font-semibold p-2">
//                   {title?.chartTitle3}
//                   <StatisticsChart3 />
//                   {/* <Chart3 /> */}
//                 </div>
//               </div>
//               <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
//             </div>
//             <div className="overflow-hidden">
//               <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
//                 <div className="text-base md:text-lg font-semibold p-2">
//                   {title?.chartTitle4}
//                   <StatisticsChart4 />
//                   {/* <Chart4 /> */}
//                 </div>
//               </div>
//               <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
//             </div>
//           </div>

//           <div className="space-y-4 border-gray-100 border-1 rounded-lg p-2 mt-3 m-0 grid grid-cols-1 transition-all duration-500 ease-in-out">
//             <JobListings />
//           </div>
//         </div>
//         <div
//           className="flex-none md:flex-3 xl:h-[calc(100vh-8rem)] lg:h-auto 
//                     pb-12 transition-all duration-500 ease-in-out"
//         >
//           <UploadedCandidates />
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashBoardContent;

import { useEffect } from "react";
import { getPxcel } from "../../wire/errorToast";
import UploadedCandidates from "../application/UploadedApplications";
import { useTranslation } from "react-i18next";
import StatisticsChart1 from "./chart/StatisticsChart1";
import StatisticsChart2 from "./chart/StatisticsChart2";
import StatisticsChart3 from "./chart/StatisticsChart3";
import StatisticsChart4 from "./chart/StatisticsChart4";
import JobListings from "./JobListings";

const DashBoardContent = () => {
  const { t } = useTranslation();
  const title: any = t("dashboard", { returnObjects: true });

  useEffect(() => {
    const element: any = document.querySelector(".chart-container");
    if (element) {
      element.style.height = getPxcel("30%", "200px");
    }
  }, []);

  // const jobTexts: any = t("jobPage", { returnObjects: true });
  // const btnTexts: any = t("buttonLabels", { returnObjects: true });

  // const getPluginOptions = (): any => {
  //   return {
  //     customAddText: btnTexts.job.cJob,
  //     filter: true,
  //     quickSearch: true,
  //   };
  // };

  return (
    <>
      <div className="lg:space-x-0 px-4 py-2 gap-2 w-full lg:block xl:flex overflow-y-auto h-[calc(100vh-70px)] sm:h-auto transition-all duration-500 ease-out">
        <div className="flex-none md:flex-7 space-y-2 xl:pb-10 pb-3 transition-all duration-500 ease-in-out">
          <div className="space-y-1 p-1 m-0 grid grid-cols-2 gap-2 transition-all duration-500 ease-in-out">
            <div className="overflow-hidden">
              <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
                <div className="text-base md:text-lg font-semibold p-2">
                  {title?.chartTitle1}
                  <StatisticsChart1 />
                </div>
              </div>
              <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
            </div>
            <div className="overflow-hidden">
              <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
                <div className="text-base md:text-lg font-semibold p-2">
                  {title?.chartTitle2}
                  <StatisticsChart2 />
                </div>
              </div>
              <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
            </div>
            <div className="overflow-hidden">
              <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
                <div className="text-base md:text-lg font-semibold p-2">
                  {title?.chartTitle3}
                  <StatisticsChart3 />
                </div>
              </div>
              <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
            </div>
            <div className="overflow-hidden">
              <div className="border-gray-100 border-5 rounded-lg h-64 md:h-56">
                <div className="text-base md:text-lg font-semibold p-2">
                  {title?.chartTitle4}
                  <StatisticsChart4 />
                </div>
              </div>
              <div className="my-2 mx-5 w-96 h-1 bg-gray-100"></div>
            </div>
          </div>
          <div className="space-y-4 border-gray-100 border-1 rounded-lg p-2 mt-3 m-0 grid grid-cols-1 transition-all duration-500 ease-in-out">
            <JobListings />
          </div>
        </div>
        <div className="flex-none md:flex-3 pb-12 transition-all duration-500 ease-in-out">
          <UploadedCandidates />
        </div>
      </div>
    </>
  );
};

export default DashBoardContent;
