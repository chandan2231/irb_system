import * as React from "react";
import { useState, useEffect } from "react";
import { Typography, useTheme } from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { approvedProtocolListCheck } from "../services/Dashboard/DashboardService";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import GradingIcon from "@mui/icons-material/Grading";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ReorderIcon from "@mui/icons-material/Reorder";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

function SideNav() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("user")) || {};
  const { approvedProtocolListCount, loading, error } = useSelector(
    (state) => ({
      error: state.dashboard.error,
      approvedProtocolListCount: state.dashboard.approvedProtocolListCount,
      loading: state.dashboard.loading,
    })
  );
  useEffect(() => {
    if (userDetails) {
      let data = { userId: userDetails.id };
      dispatch(approvedProtocolListCheck(data));
    }
  }, [dispatch, userDetails && userDetails?.id !== null]);

  return location.pathname.includes("/reset-password/") ||
    location.pathname.includes("/verify-email/") ||
    location.pathname === "/forget-password" ||
    location.pathname === "/signin" ||
    location.pathname === "/signup" ? (
    <></>
  ) : (
    <Sidebar
      style={{ height: "100%", top: "auto" }}
      breakPoint="md"
      width="280px"
      backgroundColor={theme.palette.primary.white}
    >
      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              // backgroundColor: active ? theme.palette.neutral.main : undefined,
              color: active ? theme.palette.neutral.main : undefined,
              "&:hover": {
                color: active ? theme.palette.primary.black : undefined,
              },
            };
          },
        }}
      >
        {userDetails.user_type === "admin" ? (
          <>
            <MenuItem
              active={
                location.pathname === "/admin/created-protocols" ? true : false
              }
              component={<Link to="/admin/created-protocols" />}
              icon={<FormatListBulletedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Created Protocols
              </Typography>
            </MenuItem>

            <MenuItem
              active={
                location.pathname === "/admin/under-review-protocols"
                  ? true
                  : false
              }
              component={<Link to="/admin/under-review-protocols" />}
              icon={<GradingIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Under Review Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/admin/approved-protocol-list"
                  ? true
                  : false
              }
              component={<Link to="/admin/approved-protocol-list" />}
              icon={<ChecklistRtlIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Approved Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/admin/rejected-protocols" ? true : false
              }
              component={<Link to="/admin/rejected-protocols" />}
              icon={<PlaylistRemoveIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Rejected Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/admin/members" ? true : false}
              component={<Link to="/admin/members" />}
              icon={<GroupAddOutlinedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Members List
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/admin/event-price-list" ? true : false
              }
              component={<Link to="/admin/event-price-list" />}
              icon={<AttachMoneyIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Event Price
              </Typography>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/admin/protocol-event-list"}
              component={<Link to="/admin/protocol-event-list" />}
              icon={<CalendarMonthOutlinedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Protocol Events
              </Typography>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/admin/users-list" ? true : false}
              component={<Link to="/admin/users-list" />}
              icon={<ManageAccountsOutlinedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Applicants
              </Typography>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/admin/master-list" ? true : false}
              component={<Link to="/admin/master-list" />}
              icon={<FormatListBulletedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Master List
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/admin/continuin-review-list" ||
                location.pathname === "/admin/continuin-review-details"
                  ? true
                  : false
              }
              component={<Link to="/admin/continuin-review-list" />}
              icon={<ReorderIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Continuing Review List
              </Typography>
            </MenuItem>
            <SubMenu
              label="Event And Request"
              icon={<AddBusinessOutlinedIcon />}
              style={{ fontWeight: "500", fontSize: "0.875rem" }}
            >
              <MenuItem
                active={
                  location.pathname === "/admin/protocol-amendment-request" ||
                  location.pathname ===
                    "/admin/protocol-amendment-request-details"
                    ? true
                    : false
                }
                component={<Link to="/admin/protocol-amendment-request" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Protocol Amendment Request
                </Typography>
              </MenuItem>
              <MenuItem
                active={
                  location.pathname === "/admin/adverse-events" ||
                  location.pathname === "/admin/adverse-events-details"
                    ? true
                    : false
                }
                component={<Link to="/admin/adverse-events" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Adverse Events
                </Typography>
              </MenuItem>
              <MenuItem
                active={
                  location.pathname === "/admin/promptly-reportable-event" ||
                  location.pathname ===
                    "/admin/promptly-reportable-event-details"
                    ? true
                    : false
                }
                component={<Link to="/admin/promptly-reportable-event" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Promptly Reportable Event
                </Typography>
              </MenuItem>
              <MenuItem
                active={
                  location.pathname === "/admin/study-close-request" ||
                  location.pathname === "/admin/study-close-request-details"
                    ? true
                    : false
                }
                component={<Link to="/admin/study-close-request" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Study Closeout Request
                </Typography>
              </MenuItem>
            </SubMenu>
          </>
        ) : userDetails.researcher_type === "user" ? (
          <>
            <MenuItem
              active={
                location.pathname === "/dashboard" ||
                location.pathname === "/protocol-details"
                  ? true
                  : false
              }
              component={<Link to="/dashboard" />}
              icon={<AddBusinessOutlinedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Protocol List
              </Typography>
            </MenuItem>

            {approvedProtocolListCount !== null &&
              approvedProtocolListCount > 0 && (
                <>
                  <MenuItem
                    active={
                      location.pathname === "/continuin-review" ||
                      location.pathname === "/continuin-review-details"
                        ? true
                        : false
                    }
                    component={<Link to="/continuin-review" />}
                    icon={<GroupAddOutlinedIcon />}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "500", fontSize: "0.875rem" }}
                    >
                      Continuing Review
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    active={
                      location.pathname === "/protocol-amendment-request" ||
                      location.pathname ===
                        "/protocol-amendment-request-details"
                        ? true
                        : false
                    }
                    component={<Link to="/protocol-amendment-request" />}
                    icon={<AddBusinessOutlinedIcon />}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "500", fontSize: "0.875rem" }}
                    >
                      Protocol Amendment Request
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    active={
                      location.pathname === "/adverse-events" ||
                      location.pathname === "/adverse-events-details"
                        ? true
                        : false
                    }
                    component={<Link to="/adverse-events" />}
                    icon={<AddBusinessOutlinedIcon />}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "500", fontSize: "0.875rem" }}
                    >
                      Adverse Events
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    active={
                      location.pathname === "/promptly-reportable-event" ||
                      location.pathname === "/promptly-reportable-event-details"
                        ? true
                        : false
                    }
                    component={<Link to="/promptly-reportable-event" />}
                    icon={<AddBusinessOutlinedIcon />}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "500", fontSize: "0.875rem" }}
                    >
                      Promptly Reportable Event
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    active={
                      location.pathname === "/study-close-request" ||
                      location.pathname === "/study-close-request-details"
                        ? true
                        : false
                    }
                    component={<Link to="/study-close-request" />}
                    icon={<AddBusinessOutlinedIcon />}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "500", fontSize: "0.875rem" }}
                    >
                      Study Closeout Request
                    </Typography>
                  </MenuItem>
                </>
              )}
            <MenuItem
              active={location.pathname === "/external-monitor" ? true : false}
              component={<Link to="/external-monitor" />}
              icon={<SupervisedUserCircleIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Clinical Trial Monitor List
              </Typography>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/crc" ? true : false}
              component={<Link to="/crc" />}
              icon={<SupervisedUserCircleIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Clinical Research Coordinator
              </Typography>
            </MenuItem>
          </>
        ) : userDetails.user_type === "Voting Member" ? (
          <MenuItem
            active={
              location.pathname === "/member/protocol-list" ||
              location.pathname === "/member/protocol-details"
                ? true
                : false
            }
            component={<Link to="/member/protocol-list" />}
            icon={<FormatListBulletedOutlinedIcon />}
          >
            <Typography
              variant="body2"
              style={{ fontWeight: "500", fontSize: "0.875rem" }}
            >
              Protocol Voting List
            </Typography>
          </MenuItem>
        ) : userDetails.user_type === "Committee Chair" ? (
          <MenuItem
            active={
              location.pathname === "/committee-chair/protocol-list" ||
              location.pathname === "/committee-chair/protocol-details"
                ? true
                : false
            }
            component={<Link to="/committee-chair/protocol-list" />}
            icon={<FormatListBulletedOutlinedIcon />}
          >
            <Typography
              variant="body2"
              style={{ fontWeight: "500", fontSize: "0.875rem" }}
            >
              Protocol List
            </Typography>
          </MenuItem>
        ) : userDetails.user_type === "Office Staff" ? (
          <>
            <MenuItem
              active={
                location.pathname === "/office/created-protocols" ? true : false
              }
              component={<Link to="/office/created-protocols" />}
              icon={<FormatListBulletedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Created Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/office/under-review-protocols"
                  ? true
                  : false
              }
              component={<Link to="/office/under-review-protocols" />}
              icon={<GradingIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Under Review Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/office/approved-protocol-list"
                  ? true
                  : false
              }
              component={<Link to="/office/approved-protocol-list" />}
              icon={<ChecklistRtlIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Approved Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/office/rejected-protocols"
                  ? true
                  : false
              }
              component={<Link to="/office/rejected-protocols" />}
              icon={<PlaylistRemoveIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Rejected Protocols
              </Typography>
            </MenuItem>
            <MenuItem
              active={location.pathname === "/office/users-list" ? true : false}
              component={<Link to="/office/users-list" />}
              icon={<ManageAccountsOutlinedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Applicants
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/office/master-list" ? true : false
              }
              component={<Link to="/office/master-list" />}
              icon={<FormatListBulletedIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Master List
              </Typography>
            </MenuItem>
            <MenuItem
              active={
                location.pathname === "/office/continuin-review-list" ||
                location.pathname === "/office/continuin-review-details"
                  ? true
                  : false
              }
              component={<Link to="/office/continuin-review-list" />}
              icon={<ReorderIcon />}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: "500", fontSize: "0.875rem" }}
              >
                Continuing Review List
              </Typography>
            </MenuItem>
            <SubMenu
              label="Event And Request"
              icon={<AddBusinessOutlinedIcon />}
              style={{ fontWeight: "500", fontSize: "0.875rem" }}
            >
              <MenuItem
                active={
                  location.pathname === "/office/protocol-amendment-request" ||
                  location.pathname ===
                    "/office/protocol-amendment-request-details"
                    ? true
                    : false
                }
                component={<Link to="/office/protocol-amendment-request" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Protocol Amendment Request
                </Typography>
              </MenuItem>
              <MenuItem
                active={
                  location.pathname === "/office/adverse-events" ||
                  location.pathname === "/office/adverse-events-details"
                    ? true
                    : false
                }
                component={<Link to="/office/adverse-events" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Adverse Events
                </Typography>
              </MenuItem>
              <MenuItem
                active={
                  location.pathname === "/office/promptly-reportable-event" ||
                  location.pathname ===
                    "/office/promptly-reportable-event-details"
                    ? true
                    : false
                }
                component={<Link to="/office/promptly-reportable-event" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Promptly Reportable Event
                </Typography>
              </MenuItem>
              <MenuItem
                active={
                  location.pathname === "/office/study-close-request" ||
                  location.pathname === "/office/study-close-request-details"
                    ? true
                    : false
                }
                component={<Link to="/office/study-close-request" />}
              >
                <Typography
                  variant="body2"
                  style={{ fontWeight: "500", fontSize: "0.875rem" }}
                >
                  Study Closeout Request
                </Typography>
              </MenuItem>
            </SubMenu>
          </>
        ) : userDetails.user_type === "external_monitor" ? (
          <MenuItem
            active={
              location.pathname === "/external/monitor" ||
              location.pathname === "/protocol-details"
                ? true
                : false
            }
            component={<Link to="/external/monitor" />}
            icon={<AddBusinessOutlinedIcon />}
          >
            <Typography
              variant="body2"
              style={{ fontWeight: "500", fontSize: "0.875rem" }}
            >
              Protocol List
            </Typography>
          </MenuItem>
        ) : (
          <></>
        )}
      </Menu>
    </Sidebar>
  );
}

export default SideNav;
