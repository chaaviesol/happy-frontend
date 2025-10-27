import * as React from "react";
import "./sidebar.css";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  List,
  Typography,
  IconButton,
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
  AddShoppingCart,
  Warehouse,
  Menu,
  AddCircle,
  Toc,
  AccountCircle,
  Logout,
  Category,
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ConstructionIcon from "@mui/icons-material/Construction";
import { useNavigate } from "react-router-dom";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import AddTaskIcon from "@mui/icons-material/AddTask";
import useAuth from "../../hooks/useAuth";
const drawerWidth = 240;



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
  // necessary for content to be below app bar
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
  const [open, setOpen] = React.useState(false);
  const { auth} = useAuth();
  console.log("pp==>usertype",auth.userType);
  
  const allowedPages = auth.userType==="SU" ?  [
    "Hey Happy",
    "Inventory",
    "NewProducts",
    "Productlist",
    "Category",
    "NewUser",
    "Worklist",
    "CreatePO",
    "POlist",
    "Supplierlist",
    "Newsalesorder",
    "SOlist",
    "Customerlist",
    "Quotationworklist",
    "Service&Return",
    "Leavelist",
    "Staffclaim",
    "Staffaccess",
    "Createcampaign",
    "Accountdetails",
    "Updateaccounts"
  ] : auth.allowedPages

  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleRoute = (index, clickedWorkList) => {
    if (open && index !== 6) {
      const routes = {
        0: "/adm_navigate",
        1: "/inventory",
        2: "/addproducts",
        3: "/prodlist",
        4: "/category_manager",
        5: "/register_new",
        6: "/worklist",
        6.1: "/worklist",
        6.2: "/productworklist",
        7: "/purchase",
        8: "/purchaseorders",
        9: "/supplierlist",
        10: "/customerlist",
        11: "/new_sales_order",
        12: "/so_list",
        13: "/admin_quotation",
        14: "/adm_service_view",
        15: "/leave_list",
        16: "/staff_claim",
        17: "/user_access",
        18: "/createcampaign",
        19:"/taskworklist",
        20:"/createshare",
        21:"/viewdistribution"
      };

      if (index === 6.1) {
        // for color
        navigate("/worklist", { state: clickedWorkList });
      } else if (index === 6.2) {
        navigate("/productworklist", { state: clickedWorkList });
      } else {
        navigate(routes[index] || "");
      }
    } else if (open && index === 6) {
      setShowWorkList(!showWorkList);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent" open={open} 
      onMouseEnter={() => setOpen(true)}   // 👈 opens on hover
  onMouseLeave={() => setOpen(false)}
      >
        <DrawerHeader>
          {open === false ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                ...(open && { display: "none" }),
              }}
            >
              <Menu />
            </IconButton>
          ) : (
            <IconButton>
              {theme.direction === "rtl" ? (
                <ChevronRight />
              ) : (
                <ChevronLeft
                  onClick={handleDrawerClose}
                  sx={{ color: "#b88a44" }}
                />
              )}
            </IconButton>
          )}
        </DrawerHeader>

        <List sx={{ margin: "0", padding: "0" }}>
          {[
            "Hey Happy",
            "Inventory",
            "New Products",
            "Product list",
            "Category",
            "New User",
            "Worklist",
            "Create PO",
            "PO list",
            "Supplier list",
            "Customer list",
            "New sales order",
            "SO list",
            // "Quotation worklist",
            // "Service & Return",
            // "Leave list",
            // "Staff claim",
            // "Staff Access",
            // "Create Campaign",
            // "Task worklist",
            // "Update accounts",
            "Account details",
          ].map((text, index) => {
            const normalizedText = text.toLowerCase().replace(/\s/g, "");

            if (
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
                    color: "#b88a44 ",
                    height:
                      index === 6 ? (showWorkList ? "135px" : "76px") : "76px",
                    backgroundColor: "#00342E",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      handleRoute(index);
                      handleDrawerOpen();
                    }}
                    sx={{
                      transition: "all 0.3s ease",
                      minHeight: 50,
                      px: 2.5,
                      backgroundColor: "#00342E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ":hover": {
                        bgcolor: "#AF5",
                        color: "green",
                      },
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
                      {index === 0 && (
                        <AccountCircle
                          style={{
                            color: currentPage === 0 ? "red" : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 1 && (
                        <Warehouse
                          style={{
                            color:
                              currentPage === "inventory"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 2 && (
                        <AddCircle
                          style={{
                            color:
                              currentPage === "product" ? "white" : "#b88a44 ",
                          }}
                        />
                      )}
                      {/* Add similar blocks for other index values */}
                      {index === 3 && (
                        <FeaturedPlayList
                          style={{
                            color:
                              currentPage === "productlist"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 4 && (
                        <Category
                          style={{
                            color:
                              currentPage === "category" ? "white" : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 5 && (
                        <PersonAdd
                          style={{
                            color:
                              currentPage === "register" ? "white" : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 6 && (
                        <>
                          <CheckCircle
                            style={{
                              color:
                                currentPage === "worklist"
                                  ? "white"
                                  : "#b88a44 ",
                            }}
                          />
                          {!showWorkList ? (
                            <ArrowDropDown
                              style={{
                                fontSize: "38px",
                                position: "absolute",
                                marginLeft: "300px", //150
                                marginTop: "-6.8px",
                                color:
                                  currentPage === "register"
                                    ? "white"
                                    : "#b88a44 ",
                              }}
                            />
                          ) : (
                            <ArrowDropUp
                              style={{
                                fontSize: "38px",
                                position: "absolute",
                                marginLeft: "300px",
                                marginTop: "-6.8px",
                                color:
                                  currentPage === "register"
                                    ? "white"
                                    : "#b88a44 ",
                              }}
                            />
                          )}
                        </>
                      )}
                      {index === 7 && (
                        <AddShoppingCart
                          style={{
                            color:
                              currentPage === "purchase" ? "white" : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 8 && (
                        <Toc
                          style={{
                            color:
                              currentPage === "polist" ? "white" : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 9 && (
                        <GroupIcon
                          style={{
                            color:
                              currentPage === "supplier list"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 10 && (
                        <GroupIcon
                          style={{
                            color:
                              currentPage === "customer list"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 11 && (
                        <ShoppingCartCheckoutIcon
                          style={{
                            color:
                              currentPage === "new_sales_order"
                                ? "white"
                                : "#b88a44",
                          }}
                        />
                      )}
                      {index === 12 && (
                        <FormatListNumberedIcon
                          style={{
                            color:
                              currentPage === "so_list" ? "white" : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 13 && (
                        <RequestQuoteIcon
                          style={{
                            color:
                              currentPage === "Quotation worklist"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 14 && (
                        <ConstructionIcon
                          style={{
                            color:
                              currentPage === "Service & Return"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 15 && (
                        <RecentActorsIcon
                          style={{
                            color:
                              currentPage === "Leave list"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 16 && (
                        <AddTaskIcon
                          style={{
                            color:
                              currentPage === "Staff claim list"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 17 && (
                        <GroupIcon
                          style={{
                            color:
                              currentPage === "staff access"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}

                      {index === 18 && (
                        <Menu
                          style={{
                            color:
                              currentPage === "createCampaign"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 19 && (
                        <Menu
                          style={{
                            color:
                              currentPage === "taskworklist"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      
                      {index === 20 && (
                        <Menu
                          style={{
                            color:
                              currentPage === "updateaccounts"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                      {index === 21 && (
                        <Menu
                          style={{
                            color:
                              currentPage === "accountdetails"
                                ? "white"
                                : "#b88a44 ",
                          }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                  {index === 6 && (
                    <>
                      {showWorkList ? (
                        <div
                          style={{
                            paddingTop: "5px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            transition: "opacity 0.3s ease-in-out",
                          }}
                        >
                          <div className="sidebar_dropdown">
                            <span
                              className="sidebar_link_span"
                              style={{
                                color:
                                  activeWorklistPage === "user" ? "white" : "",
                              }}
                              onClick={() => {
                                handleRoute(6.1, "user");
                              }}
                            >
                              Users
                            </span>
                          </div>

                          <div className="sidebar_dropdown">
                            <span
                              className="sidebar_link_span"
                              style={{
                                color:
                                  activeWorklistPage === "product"
                                    ? "white"
                                    : "",
                              }}
                              onClick={() => {
                                handleRoute(6.2, "product");
                              }}
                            >
                              Products
                            </span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
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
