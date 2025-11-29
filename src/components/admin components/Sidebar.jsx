import * as React from "react";
import "./sidebar.css";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PersonAdd,
  FeaturedPlayList,
  Warehouse,
  Menu,
  AccountCircle,
  Category,
  ArrowDropDown,
  ArrowDropUp,
  Toc,
} from "@mui/icons-material";
import PaymentIcon from '@mui/icons-material/Payment';

import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const drawerWidth = 240;

// Drawer open/close styles
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#00342E",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 0.8),
  color: "#b88a44",
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children, type, activeWorklistPage }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(type);
  const [showWorkList, setShowWorkList] = React.useState(false);
  const [showUsers, setShowUsers] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { auth } = useAuth();
  const theme = useTheme();

  const allowedPages =
    auth.userType === "SU"
      ? [
        "Hey Happy",
        "Inventory",
        // "NewProducts",
        "Productlist",
        "Category",
        "NewUser",
        "Worklist",
        // "CreatePO",
        "POlist",
        "Supplierlist",
        // "Newsalesorder",
        "SOlist",
        "Customerlist",
        // "Quotationworklist",
        // "Service&Return",
        // "Leavelist",
        // "Staffclaim",
        // "Staffaccess",
        // "Createcampaign",
        "Accountdetails",
        "Updateaccounts",
        "Expenses"
      ]
      : auth.allowedPages;

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Unified navigation handler
  const handleRoute = (index, clickedSubItem) => {
    const routes = {
      0: "/adm_navigate",
      1: "/inventory",
      // 2: "/addproducts",
      2: "/prodlist",
      3: "/category_manager",
      4: "/register_new",
      5: "/worklist",
      5.1: "/worklist",
      5.2: "/productworklist",
      6: "/users",
      6.1: "/supplierlist",
      6.2: "/customerlist",
      // 7: "/purchase",
      7: "/purchaseorders",
      // 11: "/new_sales_order",
      8: "/so_list",
      // 13: "/admin_quotation",
      // 14: "/adm_service_view",
      // 15: "/leave_list",
      // 16: "/staff_claim",
      // 17: "/user_access",
      // 18: "/createcampaign",
      // 19:"/taskworklist",
      // 20:"/createshare",
      9: "/viewdistribution",
      10: "/OpExpenses",
      11: "/payment_out",
      12: "/payment_in",
    };

    setOpen(true);

    // Worklist dropdown toggle
    if (index === 5) {
      setShowWorkList((prev) => !prev);
      return;
    }
    // Users dropdown toggle
    if (index === 6) {
      setShowUsers((prev) => !prev);
      return;
    }

    // Worklist sub-items
    if (index === 5.1) {
      navigate("/worklist", { state: clickedSubItem });
      return;
    }
    if (index === 5.2) {
      navigate("/productworklist", { state: clickedSubItem });
      return;
    }

    // Users sub-items
    if (index === 6.1) {
      navigate("/supplierlist");
      return;
    }
    if (index === 6.2) {
      navigate("/customerlist");
      return;
    }

    // Normal routes
    if (routes[index]) navigate(routes[index]);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DrawerHeader>
          {open === false ? (
            <IconButton onClick={handleDrawerOpen}>
              <Menu />
            </IconButton>
          ) : (
            <IconButton>
              {theme.direction === "rtl" ? (
                <ChevronRight />
              ) : (
                <></>
                // <ChevronLeft
                //   onClick={handleDrawerClose}
                //   sx={{ color: "#b88a44" }}
                // />
              )}
            </IconButton>
          )}
        </DrawerHeader>

        <List sx={{ margin: 0, padding: 0 }}>
          {[
            "Hey Happy",
            "Inventory",
            // "New Products",
            "Product list",
            "Category",
            "New User",
            "Worklist",
            "Users",
            // "Create PO",
            "Purchase Order",
            "Sales Order",
            // "New sales order",
            // "Quotation worklist",
            // "Service & Return",
            // "Leave list",
            // "Staff claim",
            // "Staff Access",
            // "Create Campaign",
            // "Task worklist",
            // "Update accounts",
            "Account details",
            "Expenses",
            "Payment Out",
            "Payment In",
          ].map((text, index) => {
            const normalizedText = text.toLowerCase().replace(/\s/g, "");

            if (
              index === 0 ||
              !allowedPages?.length ||
              allowedPages.some(
                (allowedPage) =>
                  allowedPage.toLowerCase().trim() === normalizedText
              )
            ) {
              return (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    display: "block",
                    color: "#b88a44",
                    height:
                      index === 5
                        ? showWorkList
                          ? "135px"
                          : "76px"
                        : index === 6
                          ? showUsers
                            ? "135px"
                            : "76px"
                          : "76px",
                    backgroundColor: "#00342E",
                  }}
                >
                  <ListItemButton
                    onClick={() => handleRoute(index)}
                    sx={{
                      minHeight: 50,
                      px: 2.5,
                      backgroundColor: "#00342E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ":hover": { bgcolor: "#AF5", color: "green" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {index === 0 && <AccountCircle sx={{ color: "#b88a44" }} />}
                      {index === 1 && <Warehouse sx={{ color: "#b88a44" }} />}
                      {index === 2 && <FeaturedPlayList sx={{ color: "#b88a44" }} />}
                      {index === 3 && <Category sx={{ color: "#b88a44" }} />}
                      {index === 4 && <PersonAdd sx={{ color: "#b88a44" }} />}
                      {index === 5 && (
                        <>
                          <CheckCircle sx={{ color: "#b88a44" }} />
                          {!showWorkList ? (
                            <ArrowDropDown
                              sx={{
                                fontSize: "38px",
                                position: "absolute",
                                marginLeft: "300px",
                                marginTop: "-6.8px",
                                color: "#b88a44",
                              }}
                            />
                          ) : (
                            <ArrowDropUp
                              sx={{
                                fontSize: "38px",
                                position: "absolute",
                                marginLeft: "300px",
                                marginTop: "-6.8px",
                                color: "#b88a44",
                              }}
                            />
                          )}
                        </>
                      )}
                      {index === 6 && (
                        <>
                          <GroupIcon sx={{ color: "#b88a44" }} />
                          {!showUsers ? (
                            <ArrowDropDown
                              sx={{
                                fontSize: "38px",
                                position: "absolute",
                                marginLeft: "300px",
                                marginTop: "-6.8px",
                                color: "#b88a44",
                              }}
                            />
                          ) : (
                            <ArrowDropUp
                              sx={{
                                fontSize: "38px",
                                position: "absolute",
                                marginLeft: "300px",
                                marginTop: "-6.8px",
                                color: "#b88a44",
                              }}
                            />
                          )}
                        </>
                      )}
                      {index === 7 && <Toc sx={{ color: "#b88a44" }} />}
                      {index === 8 && (
                        <FormatListNumberedIcon sx={{ color: "#b88a44" }} />
                      )}
                      {index === 9 && <Menu sx={{ color: "#b88a44" }} />}
                      {index === 10 && <Menu sx={{ color: "#b88a44" }} />}
                      {index === 11 && <PaymentIcon sx={{ color: "#b88a44" }} />}
                      {index === 12 && <PaymentIcon sx={{ color: "#b88a44" }} />}
                    </ListItemIcon>

                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>

                  {/* Worklist dropdown */}
                  {index === 5 && showWorkList && (
                    <div
                      style={{
                        paddingTop: "5px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div className="sidebar_dropdown">
                        <span
                          className="sidebar_link_span"
                          style={{
                            color:
                              activeWorklistPage === "user" ? "white" : "",
                          }}
                          onClick={() => handleRoute(5.1, "user")}
                        >
                          Users
                        </span>
                      </div>
                      <div className="sidebar_dropdown">
                        <span
                          className="sidebar_link_span"
                          style={{
                            color:
                              activeWorklistPage === "product" ? "white" : "",
                          }}
                          onClick={() => handleRoute(5.2, "product")}
                        >
                          Products
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Users dropdown */}
                  {index === 6 && showUsers && (
                    <div
                      style={{
                        paddingTop: "5px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div className="sidebar_dropdown">
                        <span
                          className="sidebar_link_span"
                          onClick={() => handleRoute(6.1)}
                        >
                          Suppliers
                        </span>
                      </div>
                      <div className="sidebar_dropdown">
                        <span
                          className="sidebar_link_span"
                          onClick={() => handleRoute(6.2)}
                        >
                          Customers
                        </span>
                      </div>
                    </div>
                  )}
                </ListItem>
              );
            }
            return null;
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
