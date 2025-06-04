import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import {
  cancelRefreshThread,
  hasTokenExpired,
  startTokenRefreshThread,
} from "./components/auth/TokenMgmt";
import BreadcrumbsNav from "./components/breadCrumbs/BreadcrumbsNav";
import { Sidebar } from "./sidebar/Sidebar";
import Footer from "../components/Footer";

interface MainLayoutInput {
  sideBarWidth?: string;
  appTitle?: string;
}

const MainLayout = (props: MainLayoutInput) => {
  var sideWidth = props.sideBarWidth;
  const { width } = useWindowSize();
  const [mobileMode, setMobileMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const widthInEm = width / 16;
  const responsive = widthInEm < 70;

  if (!sideWidth) {
    sideWidth = "280px";
  }

  useEffect(() => {
    setMobileMode(responsive);
  }, [responsive, setMobileOpen]);

  useEffect(() => {
    if (hasTokenExpired()) {
      navigate("/login");
      return;
    }
  });

  useEffect(() => {
    startTokenRefreshThread();
    return () => {
      cancelRefreshThread;
    };
  }, []);

  const display = mobileMode ? "block" : "none";
  const interviewMenu = window.location.pathname == "/app/urllogin";
  return (
    // <div className="flex h-screen  transition-all">
    <div className="flex  transition-all">
      <div
        className={`sidebar-menu-container text-black ${
          !responsive ? "px-3" : "p-0"
        } transition-all duration-300 ${!responsive ? "w-[240px]" : "w-0"}`}
      >
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          responsive={responsive}
          width={sideWidth}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        {!interviewMenu && (
          <div className="px-2 pt-5 pb-3">
            <BreadcrumbsNav
              display={display}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>
        )}
        {/* <div className="flex-1 overflow-y-auto"> */}
        <div className="flex-1">
          <Outlet />
          <div className="mt-auto">
            <Footer responsive={responsive} />
          </div>
        </div>
      </div>
    </div>
    //  <div className='flex h-screen transition-all'>
    //   <div className={sidebar-menu-container text-black ${!responsive ? 'px-3' : 'p-0'} transition-all duration-300 ${!responsive ? "w-[240px]" : "w-0"}}>
    //     <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} responsive={responsive} width={sideWidth} />
    //   </div>
    //   <div className="flex-1 flex flex-col min-h-screen">
    //     {!interviewMenu && (
    //       <div className="px-2 pt-5 pb-3">
    //         <BreadcrumbsNav display={display} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    //       </div>
    //     )}
    //     <div className="flex-1 overflow-y-auto">
    //       <Outlet />
    //       <div className="mt-auto">
    //         <Footer responsive={responsive} />
    //       </div>
    //     </div>

    //   </div>
    // </div>
  );
};

export { MainLayout };
export type { MainLayoutInput };
