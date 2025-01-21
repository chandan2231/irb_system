import SideNav from "./components/SideNav";
import AppHeader from "./components/AppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./containers/Auth/SignIn";
import SignUp from "./containers/Auth/SignUp";
import Backdrop from "@mui/material/Backdrop";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
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
import Members from "./containers/Admin/Members/Members";
import EventPriceList from "./containers/Admin/EventPriceList/EventPriceList";
import ProtocolEventList from "./containers/Admin/ProtocolEvents/ProtocolEventList";
import VotingMemberProtocolList from "./containers/VotingMembers/ProtocolList";
import CommitteeChairProtocolList from "./containers/CommitteeChair/CommitteeChairProtocolList";
import ApprovalMemberDetails from "./containers/CommitteeChair/ApprovalMemberDetails";
import Communication from "./containers/Communication/Communication";
import PayPalButton from "./components/PaymentPage";
import CanclePayment from "./components/CanclePayment";
import SuccessPayment from "./components/SuccessPayment";
import { validateUserToken } from "./services/Auth/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { Box, CssBaseline } from "@mui/material";
import UploadDocument from "./containers/UploadDoc";

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
              <Route path="/protocol-details" element={<ProtocolDetails />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="/upload-document/:protocolId/:researchType" element={<UploadDocument />} />
              <Route path="/payment" element={<PayPalButton />} />
              <Route path="/success" element={<SuccessPayment />} />
              <Route path="/cancel" element={<CanclePayment />} />
              <Route path="/continuin-review" element={<ContinuingReview />} />
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
                path="/admin/created-protocols"
                element={<CreatedProtocolList />}
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
                path="/admin/event-price-list"
                element={<EventPriceList />}
              />
              <Route
                path="/admin/protocol-event-list"
                element={<ProtocolEventList />}
              />
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
