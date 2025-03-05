import * as React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  useMediaQuery,
} from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import NotificationIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useProSidebar } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../services/Auth/AuthService";
import { persistor } from "../store";

function AppHeader() {
  const dispatch = useDispatch();
  const { collapseSidebar, toggleSidebar, broken } = useProSidebar();
  const [err, setErr] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const userDetails = JSON.parse(localStorage.getItem("user")) || {};
  const handleCloseUserMenu = () => {
    dispatch(userLogout()).then((data) => {
      if (data.payload.status === 200) {
        persistor.flush();
        window.localStorage.clear();
        window.location.replace("/signin");
      } else {
        setErr(err.response.data);
      }
    });
  };

  // Media query for responsiveness (mobile/tablet)
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");

  return (
    <AppBar position="sticky" sx={styles.appBar}>
      {window.location.pathname.includes("reset-password") ||
        window.location.pathname.includes("/verify-email/") ||
        window.location.pathname === "/forget-password" ||
        window.location.pathname === "/signin" ||
        window.location.pathname === "/signup" ? (
        <Toolbar>
          <Box className="center-card">
            <h2>IRBHUB</h2>
          </Box>
        </Toolbar>
      ) : (
        <Toolbar>
          {/* Sidebar toggle for mobile/tablet */}
          <IconButton
            onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
          >
            <MenuTwoToneIcon sx={styles.iconColor} />
          </IconButton>

          {/* Title */}
          {!isMobileOrTablet && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ display: "inline" }}>
                IRBHUB
              </Typography>
            </Box>
          )}

          {/* User Type Info */}
          {!isMobileOrTablet ? (
            <Box className="center-card">
              <h2>
                {userDetails.user_type === "admin"
                  ? "Admin Portal"
                  : userDetails.user_type === "Voting Member"
                    ? "Voting Member Portal"
                    : userDetails.user_type === "Committee Chair"
                      ? "Committee Chair Portal"
                      : userDetails.user_type === "Office Staff"
                        ? "Office Portal"
                        : userDetails.user_type === "external_monitor"
                          ? "Clinical Trial Monitor Portal"
                          : userDetails.user_type === "super_admin"
                            ? "Super Admin"
                            : ""}
              </h2>
            </Box>
          ) : (
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="body1">
                {userDetails.user_type === "admin"
                  ? "Admin"
                  : userDetails.user_type === "Voting Member"
                    ? "Voting Member"
                    : userDetails.user_type === "Committee Chair"
                      ? "Committee Chair"
                      : userDetails.user_type === "Office Staff"
                        ? "Office Portal"
                        : userDetails.user_type === "external_monitor"
                          ? "Clinical Trial Monitor"
                          : userDetails.user_type === "super_admin"
                            ? "Super Admin"
                            : ""}
              </Typography>
            </Box>
          )}

          {/* Icons for mobile/tablet */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isMobileOrTablet && (
              <>
                <IconButton title="Notification" sx={styles.iconColor}>
                  <Badge badgeContent={14} color="error">
                    <NotificationIcon />
                  </Badge>
                </IconButton>
                <IconButton title="Settings" sx={styles.iconColor}>
                  <SettingsIcon />
                </IconButton>
              </>
            )}
            <IconButton title="Logout" sx={styles.iconColor}>
              <LogoutIcon onClick={handleCloseUserMenu} />
            </IconButton>
          </Box>
        </Toolbar>
      )}
    </AppBar>
  );
}

const styles = {
  appBar: {
    bgcolor: "neutral.main",
  },
  appLogo: {
    borderRadius: 2,
    width: 80,
    ml: 2,
    cursor: "pointer",
  },
  iconColor: {
    color: "#ffffff",
  },
};

export default AppHeader;
