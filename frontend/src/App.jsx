import React from "react";
import SideNav from "./components/SideNav";
import AppHeader from "./components/AppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgetPassword from "./containers/Auth/ForgetPassword";
import SignIn from "./containers/Auth/SignIn";
import SignUp from "./containers/Auth/SignUp";
import Backdrop from "@mui/material/Backdrop";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { validateUserToken } from "./services/Auth/AuthService";
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
  // const validateToken = async (e) => {
  //   try {
  //     const cookieName = "accessToken";
  //     const getCookie = getCookieValue(cookieName);
  //     let res = await axios.get(baseURL + "/auth/", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: getCookie,
  //       },
  //     });
  //     if (res.status === 200) {
  //       setLoader(false);
  //       if (["/signin", "/signup", "/"].includes(window.location.pathname)) {
  //         window.location.replace("/dashboard");
  //       }
  //     } else {
  //       if (!["/signin", "/signup"].includes(window.location.pathname)) {
  //         window.location.replace("/signin");
  //       }
  //       setLoader(false);
  //     }
  //   } catch (err) {
  //     setLoader(false);
  //     if (!["/signin", "/signup"].includes(window.location.pathname)) {
  //       window.location.replace("/signin");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const cookieName = "accessToken";
  //   const getCookie = getCookieValue(cookieName);
  //   let data = { token: getCookie };
  //   console.log("data", data);
  //   dispatch(validateUserToken(data)).then((data) => {
  //     try {
  //       console.log("Validate token", data);
  //       if (data.payload.status === 200) {
  //         setLoader(false);
  //         if (["/signin", "/signup", "/"].includes(window.location.pathname)) {
  //           window.location.replace("/dashboard");
  //         }
  //       } else {
  //         if (!["/signin", "/signup"].includes(window.location.pathname)) {
  //           window.location.replace("/signin");
  //         }
  //         setLoader(false);
  //       }
  //     } catch (err) {
  //       setLoader(false);
  //       if (!["/signin", "/signup"].includes(window.location.pathname)) {
  //         window.location.replace("/signin");
  //       }
  //     }
  //   });
  // }, [dispatch]);

  // useEffect(() => {
  //   validateToken();
  // }, [dispatch]);

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
              {/* <Route element={<PrivateRoutes />}> */}

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/external-monitor" element={<ExternalMonitor />} />
              <Route path="/crc" element={<ClinicalResearchCoordinator />} />
              <Route path="/protocol-details" element={<ProtocolDetails />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/payment" element={<PayPalButton />} />
              <Route path="/success" element={<SuccessPayment />} />
              <Route path="/cancel" element={<CanclePayment />} />
              <Route path="/continuin-review" element={<ContinuingReview />} />
              <Route
                path="/upload-protocol-document"
                element={<UploadProtocolDocument />}
              />
              <Route
                path="/continuin-review-details"
                element={<ContinuingReviewDetails />}
              />
              <Route
                path="/protocol-amendment-request"
                element={<ProtocolAmendmentRequest />}
              />
              <Route
                path="/protocol-amendment-request-details"
                element={<ProtocolAmendmentRequestDetails />}
              />
              <Route path="/adverse-events" element={<AdverseEvents />} />
              <Route
                path="/adverse-events-details"
                element={<AdverseEventsDetails />}
              />
              <Route
                path="/promptly-reportable-event"
                element={<PromptlyReportableEvent />}
              />
              <Route
                path="/promptly-reportable-event-details"
                element={<PromptlyReportableEventDetails />}
              />
              <Route
                path="/study-close-request"
                element={<StudyCloseoutRequest />}
              />
              <Route
                path="/study-close-request-details"
                element={<StudyCloseoutRequestDetails />}
              />
              <Route
                path="/admin/approved-protocol-list"
                element={<ApprovedProtocolList />}
              />
              <Route
                path="/admin/under-review-protocols"
                element={<UnderReviewProtocolList />}
              />
              <Route
                path="/admin/rejected-protocols"
                element={<AdminRejectedProtocols />}
              />
              <Route
                path="/admin/created-protocols"
                element={<CreatedProtocolList />}
              />
              <Route
                path="/admin/super/created-protocols"
                element={<CreatedProtocolListSuperAdmin />}
              />
              <Route
                path="/admin/protocol-details"
                element={<AdminProtocolDetails />}
              />
              <Route
                path="/admin/continuin-review-list"
                element={<ContinuinReviewList />}
              />
              <Route
                path="/admin/continuin-review-details"
                element={<AdminContinuingReviewDetails />}
              />
              <Route path="/admin/users-list" element={<UsersList />} />
              <Route
                path="/admin/protocol-amendment-request"
                element={<AdminProtocolAmendmentRequest />}
              />
              <Route
                path="/admin/protocol-amendment-request-details"
                element={<AdminProtocolAmendmentRequestDetails />}
              />
              <Route
                path="/admin/adverse-events"
                element={<AdminAdverseEvents />}
              />
              <Route
                path="/admin/adverse-events-details"
                element={<AdminAdverseEventsDetails />}
              />
              <Route
                path="/admin/promptly-reportable-event"
                element={<AdminPromptlyReportableEvent />}
              />
              <Route
                path="/admin/promptly-reportable-event-details"
                element={<AdminPromptlyReportableEventDetails />}
              />
              <Route
                path="/admin/study-close-request"
                element={<AdminStudyCloseoutRequest />}
              />
              <Route
                path="/admin/study-close-request-details"
                element={<AdminStudyCloseoutRequestDetails />}
              />
              <Route path="/admin/members" element={<Members />} />
              <Route
                path="/admin/super/members"
                element={<SuperAdminMembers />}
              />
              <Route
                path="/admin/event-price-list"
                element={<EventPriceList />}
              />
              <Route
                path="/admin/protocol-event-list"
                element={<ProtocolEventList />}
              />
              <Route path="/admin/master-list" element={<MasterList />} />
              <Route
                path="/admin/transaction-list"
                element={<TransactionList />}
              />
              <Route path="/admin/add-event" element={<AddEvents />} />
              <Route
                path="/member/protocol-list"
                element={<VotingMemberProtocolList />}
              />
              <Route
                path="/member/protocol-details"
                element={<AdminProtocolDetails />}
              />
              <Route
                path="/committee-chair/protocol-list"
                element={<CommitteeChairProtocolList />}
              />
              <Route
                path="/committee-chair/protocol-details"
                element={<AdminProtocolDetails />}
              />
              <Route
                path="/committee-chair/approval-member-details"
                element={<ApprovalMemberDetails />}
              />

              {/* </Route> */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/verify-email/:token"
                element={<EmailVerification />}
              />

              <Route
                path="/office/approved-protocol-list"
                element={<OfficeApprovedProtocolList />}
              />
              <Route
                path="/office/under-review-protocols"
                element={<OfficeUnderReviewProtocolList />}
              />
              <Route
                path="/office/rejected-protocols"
                element={<OfficeRejectedProtocols />}
              />
              <Route
                path="/office/created-protocols"
                element={<OfficeCreatedProtocolList />}
              />
              <Route
                path="/office/protocol-details"
                element={<OfficeProtocolDetails />}
              />
              <Route
                path="/office/continuin-review-list"
                element={<OfficeContinuinReviewList />}
              />
              <Route
                path="/office/continuin-review-details"
                element={<OfficeContinuingReviewDetails />}
              />
              <Route path="/office/users-list" element={<OfficeUsersList />} />
              <Route
                path="/office/protocol-amendment-request"
                element={<OfficeProtocolAmendmentRequest />}
              />
              <Route
                path="/office/protocol-amendment-request-details"
                element={<OfficeProtocolAmendmentRequestDetails />}
              />
              <Route
                path="/office/adverse-events"
                element={<OfficeAdverseEvents />}
              />
              <Route
                path="/office/adverse-events-details"
                element={<OfficeAdverseEventsDetails />}
              />
              <Route
                path="/office/promptly-reportable-event"
                element={<OfficePromptlyReportableEvent />}
              />
              <Route
                path="/office/promptly-reportable-event-details"
                element={<OfficePromptlyReportableEventDetails />}
              />
              <Route
                path="/office/study-close-request"
                element={<OfficeStudyCloseoutRequest />}
              />
              <Route
                path="/office/study-close-request-details"
                element={<OfficeStudyCloseoutRequestDetails />}
              />
              <Route path="/office/master-list" element={<MasterList />} />
              <Route
                path="/external/monitor"
                element={<ExternalMonitorProtocol />}
              />
              <Route
                path="/external/monitor/upload/report"
                element={<UploadProtocolDocument />}
              />
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
