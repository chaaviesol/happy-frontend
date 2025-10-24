import React from 'react'
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import {
  ChevronLeft,
  ChevronRight,
  People,
  Mail,
  Inbox,
  ShoppingCart,
  Receipt,
  CheckCircle,
  PersonAdd,
  FeaturedPlayList,
  AddShoppingCart,
  Warehouse,
  Menu,
  AddCircle,
  AssignmentTurnedIn,
  MenuBook,
  SensorOccupied,
  Person,
  PersonSearch,
  DashboardCustomize,
  Toc,
  Autorenew,
  LocalAtm,
  Home,
  AccountCircle,
  Logout,
  Category,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

export default function H_Side({children,type}) {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = React.useState(type);
  
    console.log("type>>>>>>>>", type);
  
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
  
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };
    const handleRoute = (index) => {
      if (open) {
        const routes = {
          0: "",
          1: "/inventory",
          2: "/prodlist",
          3: "/category_manager",
          4: "/register_new",
          5: "/worklist",
          6: "/purchase",
          7: "/purchaseorders",
          8: "/supplierlist",
          9:"/new_sales_order",
          11: "/worklist",
        };
  
        navigate(routes[index] || "");
      }
    };
  
  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}

      <Drawer variant="permanent" open={open}>
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
            "Product list",
            "Category",
            "New User",
            "Work list",
            "Create PO",
            "PO list",
            "Supplier list",
            "New sales order"
          ].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{
                display: "block",
                color: "#b88a44 ",
                height: "76px",
                backgroundColor: "#00342E",
              }}
            >
              <ListItemButton
                onClick={() => {
                  handleRoute(index);
                  handleDrawerOpen();
                }}
                sx={{
                  minHeight: 50,
                  justifyContent: "center",
                  px: 2.5,
                  backgroundColor: "#00342E",

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
                  }}
                >
                  {/* const iconColor = hover || currentPage === 'category' ? 'green' : 'white'; */}

                  <Typography title="Home" variant="body1">
                    {index === 0 && (
                      <AccountCircle
                        style={{
                          color: currentPage === 0 ? "red" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography title="Inventory" variant="body1">
                    {index === 1 && (
                      <Warehouse
                        style={{
                          color:
                            currentPage === "inventory" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  {/* <Typography title="New Product" variant="body1">
                    {index === 2 && (
                      <AddCircle
                        style={{
                          color:
                            currentPage === "product" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography> */}
                  <Typography title="product list" variant="body1">
                    {index === 2 && (
                      <FeaturedPlayList
                        style={{
                          color:
                            currentPage === "productlist"
                              ? "white"
                              : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography title="Category" variant="body1">
                    {index === 3 && (
                      <Category
                        style={{
                          color:
                            currentPage === "category" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  {/* {index === 5 && <PeopleIcon style={{ color: "#b88a44 " }} />} */}
                  <Typography title="New User" variant="body1">
                    {index === 4 && (
                      <PersonAdd
                        style={{
                          color:
                            currentPage === "register" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography title="Work list" variant="body1">
                    {index === 5 && (
                      <CheckCircle
                        style={{
                          color:
                            currentPage === "worklist" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  {/* <Typography title="Admin">{index === 8 && <DashboardCustomize style= {{ color: "#b88a44 " }} />}</Typography> */}
                  {/* {index === 9 && <ShoppingCartIcon style={{ color: "#b88a44 " }} />} */}
                  <Typography title="Create PO" variant="body1">
                    {index === 6 && (
                      <AddShoppingCart
                        style={{
                          color:
                            currentPage === "purchase" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography title="PO lists" variant="body1">
                    {index === 7 && (
                      <Toc
                        style={{
                          color: currentPage === "poso" ? "white" : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography title="Supplier list" variant="body1">
                    {index === 8 && (
                      <Toc
                        style={{
                          color:
                            currentPage === "supplierlist"
                              ? "white"
                              : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography title="New sales order" variant="body1">
                    {index === 9 && (
                      <Toc
                        style={{
                          color:
                            currentPage === "new_sales_order"
                              ? "white"
                              : "#b88a44 ",
                        }}
                      />
                    )}
                  </Typography>

                  {/* {index === 12 && <ReceiptIcon style={{ color: "#b88a44 " }} />} */}
                  {/* <Typography title="Sales Order lists">{index === 13 && <Toc style={{ color: "#b88a44 " }} />}</Typography> */}
                  {/* <Typography title="Invioce"> {index === 14 && <Autorenew style={{ color: "#b88a44 " }} />}</Typography> */}
                  {/* <Typography title="Billing"> {index === 15 && <LocalAtm style={{ color: "#b88a44 " }} />}</Typography> */}
                  {/* {index === 16 && <LogoutIcon style={{ color: "#b88a44 " }} />} */}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* <Divider /> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
