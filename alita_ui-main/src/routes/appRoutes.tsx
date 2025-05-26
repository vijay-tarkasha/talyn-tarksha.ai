import { Navigate } from "react-router-dom";
import CompaniesPage from "../pages/companies/CompaniesPage";
import CompanyEditPage from "../pages/companies/CompanyEditPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import JobNewPage from "../pages/jobs/JobNewPage";
import JobsGridPage from "../pages/jobs/JobsGridPage";
import ProfileEditPage from "../pages/profile/ProfileEditPage";
import ProfilePage from "../pages/profile/ProfilePage";
import UsersGridPage from "../pages/users/UsersGridPage";
import UsersNewPage from "../pages/users/UserNewPage";
import ApplicationGridPage from "../pages/application/ApplicationGridPage";
import ApplicationNewPage from "../pages/application/ApplicationNewPage";
import CandidateGridpage from "../pages/Candidate/CandidateGridpage";
import CandidateNewpage from "../pages/Candidate/CandidateNewpage";
// import NewcandidateGridpage from "../pages/Candidate/CandidateGridpage";
// import Newcannewpage from "../pages/Candidate/CandidateNewpage";
// import CandidateNewPage from "../pages/candidates/ApplicationNewPage";
// import CandidateGridPage from "../pages/candidates/ApplicationGridPage";

const appRoutes = [
  {
    name: "index",
    index: true,
    element: <Navigate to="login" replace={true} />,
    state: "index",
  },
  // {
  //   path: "home",
  //   name: "Home",
  //   element: <HomePage />,
  //   state: "home"
  // },
  {
    path: "dashboard",
    name: "Dashboard",
    element: <DashboardPage />,
    state: "dashboard",
  },
  {
    path: "company",
    name: "Company",
    element: <CompaniesPage pageName="companies" />,
    state: "companies",
  },
  {
    path: "company/:id/edit",
    name: "Edit",
    element: <CompanyEditPage pageName="companies" />,
    state: "companies",
  },
  {
    path: "jobs",
    name: "Jobs",
    element: <JobsGridPage pageName="jobs" />,
    state: "jobs",
  },
  {
    path: "jobs/new",
    name: "New",
    element: <JobNewPage pageName="jobs" />,
    state: "jobs",
  },
  {
    path: "applications",
    name: "Applications",
    element: <ApplicationGridPage pageName="applications" />,
    state: "applications",
  },
  {
    path: "applications/new",
    name: "New",
    element: <ApplicationNewPage pageName="applications" />,
    state: "applications",
  },

  {
    path: "candidates",
    name: "candidates",
    element: <CandidateGridpage pageName="candidates" />,
    state: "candidates",
  },
  {
    path: "candidates/new",
    name: "New",
    element: <CandidateNewpage pageName="candidates" />,
    state: "candidates",
  },
  {
    path: "profile",
    name: "Profile",
    element: <ProfilePage />,
    state: "profile",
  },
  {
    path: "profile/edit",
    name: "Edit",
    element: <ProfileEditPage pageName="profile" />,
    state: "profile",
  },
  {
    path: "users",
    name: "Users",
    element: <UsersGridPage pageName="users" />,
    state: "profile",
  },
  {
    path: "users/new",
    name: "New",
    element: <UsersNewPage pageName="users" />,
    state: "profile",
  },
];

export { appRoutes };
