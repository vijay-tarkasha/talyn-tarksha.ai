import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { BsBarChartLine } from "react-icons/bs";
// import { FaUser } from "react-icons/fa";
// import { FaRegFolder } from "react-icons/fa6";
import { LuFile, LuLayoutDashboard } from "react-icons/lu";
// import { MdGroups3 } from "react-icons/md";
import { RiBriefcase5Line, RiLogoutCircleLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import Logo from "../../../public/images/tallogo.png";
import { useHandleError } from "../../components/util/util";
import ProfileImage from "../../components/widget/ProfileImage";
import { ServiceEndpoint } from "../../config/ServiceEndpoints";
import { clearAuthInfo } from "../../Session";
import { useTenantFormStore } from "../../wire/AppStoreFactory";
import { useNavigation } from "../../wire/errorToast";
import { navigateToLogin } from "../components/auth/RedirectControl";
import { ConfirmationModal } from "../components/dialog/ConfirmationModal";
import "./Sidebar.css";
// import { IoIosPeople } from "react-icons/io";
import { PiUsersThree } from "react-icons/pi";
import { TbUserScan } from "react-icons/tb";
import { BiBuildings } from "react-icons/bi";
// import { BsFillBuildingsFill } from "react-icons/bs";

interface SidebarInput {
  appTitle?: string;
  width: string;
  mobileOpen?: any;
  setMobileOpen?: any;
  responsive?: boolean;
  isTrue?: any;
}

const Sidebar = (props: SidebarInput) => {
  const { t } = useTranslation();
  const { handle500Error } = useHandleError();
  const location = useLocation();
  const { navigateTo } = useNavigation();
  const [userData, setUserData] = useState<any>({});
  const [opened, { open, close }] = useDisclosure(false);
  const { width: _sideBarWidth, mobileOpen, setMobileOpen, responsive } = props;
  const apiEndpoint = ServiceEndpoint.company.restApi;
  const store = useTenantFormStore(apiEndpoint);
  const endPoint = ServiceEndpoint.apiBaseUrl + ServiceEndpoint.auth.logout.api;

  const handleDrawerToggle = () => {
    if (setMobileOpen) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleClick = () => {
    open();
  };

  const handleLogOut = (event: any) => {
    event.stopPropagation();
    const req = {
      refresh: localStorage.getItem("refreshToken"),
    };
    axios
      .post(endPoint, req)
      .then((_d: any) => {})
      .finally(() => {
        clearAuthInfo();
        navigateToLogin();
      });
  };

  const goToProfile = () => {
    navigateTo("/app/profile");
    handleDrawerToggle();
  };

  const menuList = [
    {
      icon: <LuLayoutDashboard />,
      label: t("sidebarMenu.dashboard"),
      path: "/app/dashboard",
    },
    {
      icon: <BiBuildings />,
      label: t("sidebarMenu.company"),
      path: "/app/company",
    },
    {
      icon: <RiBriefcase5Line />,
      label: t("sidebarMenu.jobs"),
      path: "/app/jobs",
    },
    {
      icon: <LuFile />,
      label: t("sidebarMenu.applications"),
      path: "/app/applications",
    },
    {
      icon: <PiUsersThree />, // Add an appropriate icon
      label: t("sidebarMenu.candidates"), // Add the translation for 'Candidates' here
      path: "/app/candidates", // Link to the Candidates page
    },
    { icon: <TbUserScan />, label: t("sidebarMenu.users"), path: "/app/users" },
  ];

  const interviewMenu = window.location.pathname == "/app/urllogin";

  useEffect(() => {
    store
      .get({})
      .then((d) => {
        setUserData(d);
      })
      .catch((res) => {
        handle500Error(res?.response?.data?.status_code, res?.status);
      });
  }, []);

  const handleMenuNavigation = (path: any) => {
    navigateTo(path);
    handleDrawerToggle();
  };

  const drawerList = (
    // <div className="sidebar">
    //   <div className="sidebar-header">
    //     <div className='auth-logo-container'>
    //       <div className='auth-logo' onClick={() => navigateTo("/app/dashboard")}>
    //         <img src={Logo} />
    //       </div>
    //     </div>
    //   </div>
    //   <Box className="sidebar-middle">
    //     {!interviewMenu && menuList.map((d) => (
    //       <div key={d.label}
    //         className={location.pathname.startsWith(d.path) ? 'menu-list selected-menu-list' : 'menu-list'}
    //         onClick={() => handleMenuNavigation(d.path)}>
    //         <div className='menu-icon'>{d.icon}</div>
    //         <div className='menu-label'>{d.label}</div>
    //       </div>
    //     ))}
    //   </Box>

    //   {!interviewMenu && (
    //     <div className="sidebar-footer">
    //       <div className="sidebar-logout-footer" >
    //         <RiLogoutCircleLine className='logout-icon' />
    //         <div onClick={handleClick}>{t('sidebarMenu.logout')}</div>
    //       </div>
    //       <div className={location.pathname.startsWith('/app/profile') ?
    //         "sidebar-profile-footer sidebar-selected-profile-footer" : "sidebar-profile-footer"}
    //         onClick={goToProfile}>
    //         <MdPerson4 className='profile-icon' />
    //         <div className='admin-text'> {userData.company_name}
    //           <div className='admin-sub-text'>{userData.email}</div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    //   <ConfirmationModal close={close} opened={opened} submit={handleLogOut}
    //     description={t('sidebarMenu.confirmDialog.description')} />
    // </div>
    <div className="text-black flex flex-col h-full fixed ">
      <div className="flex justify-center items-center py-3">
        <div
          className="cursor-pointer h-[80px] item-center flex"
          onClick={() => navigateTo("/app/dashboard")}
        >
          <img src={Logo} alt="Logo" className="h-full" />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-2">
        {!interviewMenu &&
          menuList.map((d) => (
            <div
              key={d.label}
              className={`flex lg:w-50 items-center px-2 py-2 rounded-xl cursor-pointer transition-all 
              ${
                location.pathname.startsWith(d.path)
                  ? "menu-list selected-menu-list"
                  : "menu-list"
              }
            `}
              onClick={() => handleMenuNavigation(d.path)}
            >
              <div className="sm:text-2xl md:text-1xl mr-2">
                {d.icon}
              </div>
              <div className="text-sm font-semibold">{d.label}</div>
            </div>
          ))}
      </div>

      {!interviewMenu && (
        <div className="p-3 fixed bottom-0 left-0 w-[240px]">
          <div
            className="flex items-center cursor-pointer py-3 px-2 rounded-md sidebar-logout-footer"
            onClick={handleClick}
          >
            <RiLogoutCircleLine className="text-xl mr-3 logout-icon" />
            <div>{t("sidebarMenu.logout")}</div>
          </div>
          <div
            className={`flex items-center p-2 rounded-md cursor-pointer transition-all 
            ${
              location.pathname.startsWith("/app/profile")
                ? "sidebar-profile-footer sidebar-selected-profile-footer"
                : "sidebar-profile-footer"
            }
          `}
            onClick={goToProfile}
          >
            <div>
              {/* <MdPerson4 className="text-xl mr-3" /> */}
              <div className="text-xl mr-3">
                <ProfileImage
                  name={userData?.company_name}
                  id={userData?.id}
                  className={"profile_sm"}
                />
              </div>
            </div>
            <div className="text-sm admin-text break-words whitespace-normal w-[170px]">
              {userData.company_name}
              <div className="text-xs admin-sub-text break-words whitespace-normal w-[170px]">
                {userData.email}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        close={close}
        opened={opened}
        submit={handleLogOut}
        description={t("sidebarMenu.confirmDialog.description")}
      />
    </div>
  );

  if (responsive) {
    return (
      // <Drawer
      //   opened={mobileOpen}
      //   onClose={handleDrawerToggle}
      //   position="left"
      //   size={250}
      //   transitionProps={{ transition: 'scale-x', duration: 150 }}
      //   padding="xs"
      //   withCloseButton={false}
      //   className="sidebar-drawer">
      //   {drawerList}
      // </Drawer>
      <Drawer
        opened={mobileOpen}
        onClose={handleDrawerToggle}
        position="left"
        size={250}
        transitionProps={{ transition: "scale-x", duration: 150 }}
        padding="xs"
        withCloseButton={false}
        className="sidebar-drawer"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-center items-center py-2">
            <div
              className="cursor-pointer h-[80px] item-center flex"
              onClick={() => navigateTo("/app/dashboard")}
            >
              <img src={Logo} alt="Logo" className="h-full" />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-14rem)] pb-3">
            {!interviewMenu &&
              menuList.map((d) => (
                <div
                  key={d.label}
                  className={`flex items-center px-2 py-1.5 rounded-xl cursor-pointer transition-all
              ${
                location.pathname.startsWith(d.path)
                  ? "menu-list selected-menu-list"
                  : "menu-list"
              }
            `}
                  onClick={() => handleMenuNavigation(d.path)}
                >
                  <div className="text-base sm:text-xs md:text-base mr-3">
                    {d.icon}
                  </div>
                  <div className="text-base sm:text-xs md:text-base">
                    {d.label}
                  </div>
                </div>
              ))}
          </div>

          {!interviewMenu && (
            <div className="p-2 absolute bottom-0 left-0 w-full shadow-md">
              <div
                className="flex items-center cursor-pointer py-3 px-2 rounded-md sidebar-logout-footer"
                onClick={handleClick}
              >
                <RiLogoutCircleLine className="text-xl mr-3 logout-icon" />
                <div>{t("sidebarMenu.logout")}</div>
              </div>

              <div
                className={`flex items-center p-2 rounded-md cursor-pointer transition-all 
            ${
              location.pathname.startsWith("/app/profile")
                ? "sidebar-profile-footer sidebar-selected-profile-footer"
                : "sidebar-profile-footer"
            }
          `}
                onClick={goToProfile}
              >
                {/* <MdPerson4 className="text-xl mr-3" /> */}
                <div className="text-xl mr-3">
                  <ProfileImage
                    name={userData?.company_name}
                    id={userData?.id}
                    className={"profile_sm"}
                  />
                </div>
                <div className="text-sm admin-text break-words whitespace-normal w-[170px]">
                  {userData.company_name}
                  <div className="text-xs admin-sub-text break-words whitespace-normal w-[170px]">
                    {userData.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ConfirmationModal
          close={close}
          opened={opened}
          submit={handleLogOut}
          description={t("sidebarMenu.confirmDialog.description")}
        />
      </Drawer>
    );
  } else if (responsive) {
    return (
      <Drawer
        opened
        position="left"
        size={80}
        padding="xs"
        onClose={() => {}}
        className="sidebar-drawer"
      >
        {drawerList}
      </Drawer>
    );
  } else {
    return drawerList;
  }
};

export { Sidebar };
export type { SidebarInput };
