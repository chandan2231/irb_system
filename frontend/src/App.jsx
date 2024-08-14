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
            console.log('res', res)
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
