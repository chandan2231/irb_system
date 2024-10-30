import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./config/theme";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import SideNav from "./components/SideNav";
import AppHeader from "./components/AppHeader";
import { ProSidebarProvider } from "react-pro-sidebar";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./store/index.js";
import { CookiesProvider } from 'react-cookie';
import SignIn from "./containers/Auth/SignIn";
import SignUp from "./containers/Auth/SignUp";
import Backdrop from '@mui/material/Backdrop';
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
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
import ProtocolEventList from "./containers/Admin/ProtocolEvents/ProtocolEventList.jsx";

function App() {
  const [loader, setLoader] = useState(true)
  //const navigate = useNavigate();
  function getCookieValue(name) 
    {
      const regex = new RegExp(`(^| )${name}=([^;]+)`)
      const match = document.cookie.match(regex)
      if (match) {
        return match[2]
      }
    }
    const validateToken = async e => {
        try{
            const cookieName = 'accessToken';
            const getCookie = getCookieValue(cookieName)
            let res = await axios.get('http://localhost:8800/api/auth/', 
            { headers: 
                {
                    "Content-Type": 'application/json',
                    'token': getCookie
                }
            })
            if(res.status === 200){
                setLoader(false);
                if(['/signin', '/signup', '/'].includes(window.location.pathname)){
                  window.location.replace('/dashboard')
                }
            } else {
              if(!['/signin', '/signup'].includes(window.location.pathname)){
                window.location.replace('/signin')
              }
              setLoader(false);
            }
        } catch (err){
            setLoader(false);
            if(!['/signin', '/signup'].includes(window.location.pathname)){
              window.location.replace('/signin')
            }
        }
    }
    useEffect(() => {
        validateToken()
    });
    if (loader) {
      return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }

  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <ProSidebarProvider>
              <CssBaseline />
              <AppHeader />
              <Box sx={styles.container}>
                <BrowserRouter>
                  <SideNav />
                  <Box sx={styles.mainSection} component={"main"}>
                    <Routes>
                      {/* <Route element={<PrivateRoutes />}> */}
                        <Route path='/dashboard' element={<Dashboard/>} />
                        <Route path='/protocol-details' element={<ProtocolDetails/>} />
                        <Route path='/continuin-review' element={<ContinuingReview/>} />
                        <Route path='/continuin-review-details' element={<ContinuingReviewDetails/>} />
                        <Route path='/protocol-amendment-request' element={<ProtocolAmendmentRequest/>} />
                        <Route path='/protocol-amendment-request-details' element={<ProtocolAmendmentRequestDetails/>} />
                        <Route path='/adverse-events' element={<AdverseEvents/>} />
                        <Route path='/adverse-events-details' element={<AdverseEventsDetails/>} />
                        <Route path='/promptly-reportable-event' element={<PromptlyReportableEvent/>} />
                        <Route path='/promptly-reportable-event-details' element={<PromptlyReportableEventDetails/>} />
                        <Route path='/study-close-request' element={<StudyCloseoutRequest/>} />
                        <Route path='/study-close-request-details' element={<StudyCloseoutRequestDetails/>} />
                        <Route path='/admin/approved-protocol-list' element={<ApprovedProtocolList/>} />
                        <Route path='/admin/under-review-protocols' element={<UnderReviewProtocolList/>} />
                        <Route path='/admin/created-protocols' element={<CreatedProtocolList/>} />
                        <Route path='/admin/protocol-details' element={<AdminProtocolDetails/>} />
                        <Route path='/admin/continuin-review-list' element={<ContinuinReviewList/>} />
                        <Route path='/admin/continuin-review-details' element={<AdminContinuingReviewDetails/>} />
                        <Route path='/admin/users-list' element={<UsersList/>} />
                        <Route path='/admin/protocol-amendment-request' element={<AdminProtocolAmendmentRequest/>} />
                        <Route path='/admin/protocol-amendment-request-details' element={<AdminProtocolAmendmentRequestDetails/>} />
                        <Route path='/admin/adverse-events' element={<AdminAdverseEvents/>} />
                        <Route path='/admin/adverse-events-details' element={<AdminAdverseEventsDetails/>} />
                        <Route path='/admin/promptly-reportable-event' element={<AdminPromptlyReportableEvent/>} />
                        <Route path='/admin/promptly-reportable-event-details' element={<AdminPromptlyReportableEventDetails/>} />
                        <Route path='/admin/study-close-request' element={<AdminStudyCloseoutRequest/>} />
                        <Route path='/admin/study-close-request-details' element={<AdminStudyCloseoutRequestDetails/>} />
                        <Route path='/admin/members' element={<Members/>} />
                        <Route path='/admin/event-price-list' element={<EventPriceList/>} />
                        <Route path='/admin/protocol-event-list' element={<ProtocolEventList/>} />
                      {/* </Route> */}
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                    </Routes>
                  </Box>
                </BrowserRouter>
              </Box>
            </ProSidebarProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </CookiesProvider>
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
