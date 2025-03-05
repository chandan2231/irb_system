import React from "react";
import SideNav from "./components/SideNav";
import AppHeader from "./components/AppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ForgetPassword from "./containers/Auth/ForgetPassword";
import SignIn from "./containers/Auth/SignIn";
import SignUp from "./containers/Auth/SignUp";
import Backdrop from "@mui/material/Backdrop";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import Dashboard from "./containers/Dashboard/Dashboard";
import ProtocolDetails from "./containers/Dashboard/ProtocolDetails";
import ContinuingReview from "./containers/ContinuingReview/ContinuingReview";
import ContinuingReviewDetails from "./containers/ContinuingReview/ContinuingReviewDetails";
import ProtocolAmendmentRequest from "./containers/ProtocolAmendmentRequest/ProtocolAmendmentRequest";
import ProtocolAmendmentRequestDetails from "./containers/ProtocolAmendmentRequest/ProtocolAmendmentRequestDetails";
import AdverseEvents from "./containers/AdverseEvents/AdverseEvents";
import AdverseEventsDetails from "./containers/AdverseEvents/AdverseEventsDetails";
import PromptlyReportableEvent from "./containers/PromptlyReportableEvent/PromptlyReportableEvent";
import PromptlyReportableEventDetails from "./containers/PromptlyReportableEvent/PromptlyReportableEventDetails";
import StudyCloseoutRequest from "./containers/StudyCloseoutRequest/StudyCloseoutRequest";
import StudyCloseoutRequestDetails from "./containers/StudyCloseoutRequest/StudyCloseoutRequestDetails";
import ApprovedProtocolList from "./containers/Admin/ProtocolList/ApprovedProtocolList";
import UnderReviewProtocolList from "./containers/Admin/ProtocolList/UnderReviewProtocolList";
import CreatedProtocolList from "./containers/Admin/ProtocolList/CreatedProtocolList";
import ContinuinReviewList from "./containers/Admin/ContinuinReviewList/ContinuinReviewList";
import UsersList from "./containers/Admin/UsersList/UsersList";
import AdminProtocolDetails from "./containers/Admin/ProtocolList/AdminProtocolDetails";
import AdminContinuingReviewDetails from "./containers/Admin/ContinuinReviewList/AdminContinuingReviewDetails";
import AdminPromptlyReportableEvent from "./containers/Admin/PromptlyReportableEvent/PromptlyReportableEvent";
import AdminPromptlyReportableEventDetails from "./containers/Admin/PromptlyReportableEvent/AdminPromptlyReportableEventDetails";
import AdminStudyCloseoutRequest from "./containers/Admin/StudyCloseoutRequest/StudyCloseoutRequest";
import AdminStudyCloseoutRequestDetails from "./containers/Admin/StudyCloseoutRequest/AdminStudyCloseoutRequestDetails";
import AdminAdverseEvents from "./containers/Admin/AdverseEvents/AdverseEvents";
import AdminAdverseEventsDetails from "./containers/Admin/AdverseEvents/AdminAdverseEventsDetails";
import AdminProtocolAmendmentRequest from "./containers/Admin/ProtocolAmendmentRequest/ProtocolAmendmentRequest";
import AdminProtocolAmendmentRequestDetails from "./containers/Admin/ProtocolAmendmentRequest/AdminProtocolAmendmentRequestDetails";
import AdminRejectedProtocols from "./containers/Admin/ProtocolList/RejectedProtocols";
import Members from "./containers/Admin/Members/Members";
import SuperAdminMembers from "./containers/SuperAdmin/Members/Members";
import EventPriceList from "./containers/SuperAdmin/EventPriceList/EventPriceList";
import ProtocolEventList from "./containers/Admin/ProtocolEvents/ProtocolEventList";
import VotingMemberProtocolList from "./containers/VotingMembers/ProtocolList";
import CommitteeChairProtocolList from "./containers/CommitteeChair/CommitteeChairProtocolList";
import ApprovalMemberDetails from "./containers/CommitteeChair/ApprovalMemberDetails";
import Communication from "./containers/Communication/Communication";
import PayPalButton from "./components/PaymentPage";
import CanclePayment from "./components/CanclePayment";
import SuccessPayment from "./components/SuccessPayment";
import UploadProtocolDocument from "./containers/Dashboard/UploadProtocolDocument";
import OfficeApprovedProtocolList from "./containers/OfficePortal/ProtocolList/ApprovedProtocolList";
import OfficeUnderReviewProtocolList from "./containers/OfficePortal/ProtocolList/UnderReviewProtocolList";
import OfficeCreatedProtocolList from "./containers/OfficePortal/ProtocolList/CreatedProtocolList";
import OfficeContinuinReviewList from "./containers/OfficePortal/ContinuinReviewList/ContinuinReviewList";
import OfficeUsersList from "./containers/OfficePortal/UsersList/UsersList";
import OfficeProtocolDetails from "./containers/OfficePortal/ProtocolList/AdminProtocolDetails";
import OfficeContinuingReviewDetails from "./containers/OfficePortal/ContinuinReviewList/AdminContinuingReviewDetails";
import OfficePromptlyReportableEvent from "./containers/OfficePortal/PromptlyReportableEvent/PromptlyReportableEvent";
import OfficePromptlyReportableEventDetails from "./containers/OfficePortal/PromptlyReportableEvent/AdminPromptlyReportableEventDetails";
import OfficeStudyCloseoutRequest from "./containers/OfficePortal/StudyCloseoutRequest/StudyCloseoutRequest";
import OfficeStudyCloseoutRequestDetails from "./containers/OfficePortal/StudyCloseoutRequest/AdminStudyCloseoutRequestDetails";
import OfficeAdverseEvents from "./containers/OfficePortal/AdverseEvents/AdverseEvents";
import OfficeAdverseEventsDetails from "./containers/OfficePortal/AdverseEvents/AdminAdverseEventsDetails";
import OfficeProtocolAmendmentRequest from "./containers/OfficePortal/ProtocolAmendmentRequest/ProtocolAmendmentRequest";
import OfficeProtocolAmendmentRequestDetails from "./containers/OfficePortal/ProtocolAmendmentRequest/AdminProtocolAmendmentRequestDetails";
import OfficeRejectedProtocols from "./containers/OfficePortal/ProtocolList/RejectedProtocols";
import ExternalMonitor from "./containers/Dashboard/ExternalMonitor";
import ClinicalResearchCoordinator from "./containers/Dashboard/ClinicalResearchCoordinator";
import MasterList from "./containers/Admin/MasterList/MasterList";
import ExternalMonitorProtocol from "./containers/ExternalMonitor/ExternalMonitorProtocol";
import ResetPassword from "./containers/Auth/ResetPassword";
import EmailVerification from "./containers/Auth/EmailVerification";
import AddEvents from "./containers/Admin/ProtocolEvents/AddEvents";
import TransactionList from "./containers/SuperAdmin/TransactionList";
import CreatedProtocolListSuperAdmin from "./containers/SuperAdmin/ProtocolList/CreatedProtocolList";
import NotAuthorized from "./components/NotAuthorized";
import { userRoutes } from "./utility/Constants";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  function getCookieValue(name) {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
      return match[2];
    }
  }

  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { mappedPermissions, loading, error } = useSelector((state) => ({
      error: state.auth.error,
      mappedPermissions: state.auth.mappedPermissions,
      loading: state.auth.loading,
    }));
    const allowedRoutes = mappedPermissions.map((perm) => perm.route);
    console.log("location.pathname", location.pathname);
    if (!allowedRoutes.includes(location.pathname)) {
      return <Navigate to="/not-authorized" replace />;
    }
    return children;
  };

  const OnlyLoggedOutRoute = ({ children }) => {
    const {
      userDetail: userDetailsFromStore,
      userDetailsLoading,
      userDetailsError,
    } = useSelector((state) => ({
      userDetailsError: state.auth.error,
      userDetail: state.auth.userDetail,
      userDetailsLoading: state.auth.loading,
    }));

    if (
      !userDetailsFromStore?.token ||
      !userDetailsFromStore?.token === null ||
      !userDetailsFromStore?.token === ""
    ) {
      return children;
    }
    const path = userRoutes[userDetailsFromStore?.user_type] || "/dashboard";
    return <Navigate to={`${path}`} replace />;
  };

  if (loader) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <ProSidebarProvider>
      <CssBaseline />
      <AppHeader />
      <Box sx={styles.container}>
        <BrowserRouter>
          <SideNav />
          <Box sx={styles.mainSection} component={"main"}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/external-monitor"
                element={
                  <ProtectedRoute>
                    <ExternalMonitor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crc"
                element={
                  <ProtectedRoute>
                    <ClinicalResearchCoordinator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/protocol-details"
                element={
                  <ProtectedRoute>
                    <ProtocolDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/communication"
                element={
                  <ProtectedRoute>
                    <Communication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <PayPalButton />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <SuccessPayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cancel"
                element={
                  <ProtectedRoute>
                    <CanclePayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/continuin-review"
                element={
                  <ProtectedRoute>
                    <ContinuingReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-protocol-document"
                element={
                  <ProtectedRoute>
                    <UploadProtocolDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/continuin-review-details"
                element={
                  <ProtectedRoute>
                    <ContinuingReviewDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/protocol-amendment-request"
                element={
                  <ProtectedRoute>
                    <ProtocolAmendmentRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/protocol-amendment-request-details"
                element={
                  <ProtectedRoute>
                    <ProtocolAmendmentRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/adverse-events"
                element={
                  <ProtectedRoute>
                    <AdverseEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/adverse-events-details"
                element={
                  <ProtectedRoute>
                    <AdverseEventsDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promptly-reportable-event"
                element={
                  <ProtectedRoute>
                    <PromptlyReportableEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promptly-reportable-event-details"
                element={
                  <ProtectedRoute>
                    <PromptlyReportableEventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-close-request"
                element={
                  <ProtectedRoute>
                    <StudyCloseoutRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-close-request-details"
                element={
                  <ProtectedRoute>
                    <StudyCloseoutRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approved-protocol-list"
                element={
                  <ProtectedRoute>
                    <ApprovedProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/under-review-protocols"
                element={
                  <ProtectedRoute>
                    <UnderReviewProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rejected-protocols"
                element={
                  <ProtectedRoute>
                    <AdminRejectedProtocols />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/created-protocols"
                element={
                  <ProtectedRoute>
                    <CreatedProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/super/created-protocols"
                element={
                  <ProtectedRoute>
                    <CreatedProtocolListSuperAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/protocol-details"
                element={
                  <ProtectedRoute>
                    <AdminProtocolDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/continuin-review-list"
                element={
                  <ProtectedRoute>
                    <ContinuinReviewList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/continuin-review-details"
                element={
                  <ProtectedRoute>
                    <AdminContinuingReviewDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users-list"
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/protocol-amendment-request"
                element={
                  <ProtectedRoute>
                    <AdminProtocolAmendmentRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/protocol-amendment-request-details"
                element={
                  <ProtectedRoute>
                    <AdminProtocolAmendmentRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/adverse-events"
                element={
                  <ProtectedRoute>
                    <AdminAdverseEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/adverse-events-details"
                element={
                  <ProtectedRoute>
                    <AdminAdverseEventsDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/promptly-reportable-event"
                element={
                  <ProtectedRoute>
                    <AdminPromptlyReportableEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/promptly-reportable-event-details"
                element={
                  <ProtectedRoute>
                    <AdminPromptlyReportableEventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/study-close-request"
                element={
                  <ProtectedRoute>
                    <AdminStudyCloseoutRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/study-close-request-details"
                element={
                  <ProtectedRoute>
                    <AdminStudyCloseoutRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/super/members"
                element={
                  <ProtectedRoute>
                    <SuperAdminMembers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/event-price-list"
                element={
                  <ProtectedRoute>
                    <EventPriceList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/protocol-event-list"
                element={
                  <ProtectedRoute>
                    <ProtocolEventList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/master-list"
                element={
                  <ProtectedRoute>
                    <MasterList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/transaction-list"
                element={
                  <ProtectedRoute>
                    <TransactionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-event"
                element={
                  <ProtectedRoute>
                    <AddEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/protocol-list"
                element={
                  <ProtectedRoute>
                    <VotingMemberProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/protocol-details"
                element={
                  <ProtectedRoute>
                    <AdminProtocolDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/committee-chair/protocol-list"
                element={
                  <ProtectedRoute>
                    <CommitteeChairProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/committee-chair/protocol-details"
                element={
                  <ProtectedRoute>
                    <AdminProtocolDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/committee-chair/approval-member-details"
                element={
                  <ProtectedRoute>
                    <ApprovalMemberDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/office/approved-protocol-list"
                element={
                  <ProtectedRoute>
                    <OfficeApprovedProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/under-review-protocols"
                element={
                  <ProtectedRoute>
                    <OfficeUnderReviewProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/rejected-protocols"
                element={
                  <ProtectedRoute>
                    <OfficeRejectedProtocols />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/created-protocols"
                element={
                  <ProtectedRoute>
                    <OfficeCreatedProtocolList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/protocol-details"
                element={
                  <ProtectedRoute>
                    <OfficeProtocolDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/continuin-review-list"
                element={
                  <ProtectedRoute>
                    <OfficeContinuinReviewList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/continuin-review-details"
                element={
                  <ProtectedRoute>
                    <OfficeContinuingReviewDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/users-list"
                element={
                  <ProtectedRoute>
                    <OfficeUsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/protocol-amendment-request"
                element={
                  <ProtectedRoute>
                    <OfficeProtocolAmendmentRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/protocol-amendment-request-details"
                element={
                  <ProtectedRoute>
                    <OfficeProtocolAmendmentRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/adverse-events"
                element={
                  <ProtectedRoute>
                    <OfficeAdverseEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/adverse-events-details"
                element={
                  <ProtectedRoute>
                    <OfficeAdverseEventsDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/promptly-reportable-event"
                element={
                  <ProtectedRoute>
                    <OfficePromptlyReportableEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/promptly-reportable-event-details"
                element={
                  <ProtectedRoute>
                    <OfficePromptlyReportableEventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/study-close-request"
                element={
                  <ProtectedRoute>
                    <OfficeStudyCloseoutRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/study-close-request-details"
                element={
                  <ProtectedRoute>
                    <OfficeStudyCloseoutRequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/office/master-list"
                element={
                  <ProtectedRoute>
                    <MasterList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/external/monitor"
                element={
                  <ProtectedRoute>
                    <ExternalMonitorProtocol />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/external/monitor/upload/report"
                element={
                  <ProtectedRoute>
                    <UploadProtocolDocument />
                  </ProtectedRoute>
                }
              />

              {/* special routes */}
              <Route
                path="/signin"
                element={
                  <OnlyLoggedOutRoute>
                    <SignIn />
                  </OnlyLoggedOutRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <OnlyLoggedOutRoute>
                    <SignUp />
                  </OnlyLoggedOutRoute>
                }
              />
              <Route
                path="/forget-password"
                element={
                  <OnlyLoggedOutRoute>
                    <ForgetPassword />
                  </OnlyLoggedOutRoute>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <OnlyLoggedOutRoute>
                    <ResetPassword />
                  </OnlyLoggedOutRoute>
                }
              />
              <Route
                path="/verify-email/:token"
                element={
                  <OnlyLoggedOutRoute>
                    <EmailVerification />
                  </OnlyLoggedOutRoute>
                }
              />

              {/* not authorized route  */}
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </Box>
    </ProSidebarProvider>
  );
}

/* @type {import("@mui/icons-material").SxProps } */

const styles = {
  container: {
    display: "flex",
    bgcolor: "neutral.light",
    height: "calc(100% - 64px)",
  },
  mainSection: {
    p: 1,
    height: "100%",
    width: "100%",
    overflow: "auto",
  },
};

export default App;
