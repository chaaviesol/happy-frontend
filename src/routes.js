import Sign from "./pages/sign/Sign";
import Purchase from "./pages/Admin/Dashboard/Purchase/Po_Wrapper";
import Pendingpo from "./components/Pendingpo";
import Home from "./pages/Home/Home";
import POWrapper from "./pages/Admin/Dashboard/purchase orders/Po_Wrapper";
import GoodsReceipt from "./pages/Admin/Dashboard/Goods Receipt/GoodsReceipt_Wrapper";
import PoPdf from "./pages/Admin/Dashboard/Po_Pdf/PoPdf";
import ApproveUsers from "./pages/Admin/Dashboard/ProdAndWorkList/ApproveUsers";
import Worklist from "./pages/Admin/Dashboard/ProdAndWorkList/Worklist";
import Proddetails from "./pages/Admin/Dashboard/ProdAndWorkList/Proddetails";
import Saleslist from "./pages/Sales/Saleslist";
import Salespdf from "./pages/Sales/Salespdf";
import SupplierDetails from "./pages/Admin/Dashboard/ProdAndWorkList/SupplierDetails";
import Supdetails from "./pages/Admin/Dashboard/ProdAndWorkList/Supdetails";
import Customerlist from "./pages/Admin/Dashboard/Customer_view/CustomerView";
import CustomerDetails from "./pages/Admin/Dashboard/Customer_view/Customer_profileview";
import Suppcomponent from "./components/Suppliercomponent/Suppcomponent";
import Transaction from "./components/Suppliercomponent/Transaction";
import Service from "./components/Suppliercomponent/Service";
import Feedback from "./components/Suppliercomponent/Feedback";
import CustomerManager from "./pages/Admin/Dashboard/categoryManager/CustomerManager";
import Profile_full_page from "./pages/Customer/Product_detailed/Profile_full_page";
import Product_list from "./pages/Customer/Cus_products/Product_list";
import CustomerProfileFull from "./pages/Customer/Customer_profile/CustomerProfileFull";
import Cart from "./pages/Customer/Product_cart/Cart";
import Customer_Topbar from "./components/Customer_component/Customer_Topbar";
import Pdfconvert from "./pages/Customer/Product_detailed/Pdfconvert";
import Wishlist_cus from "./pages/Customer/Wishlist_cus/Wishlist_cus";
import Login_create_pass from "./pages/Login_create_pass/Login_create_pass";
import Cus_orderConfirm from "./pages/Customer/cus_order_confirm/Cus_orderConfirm";
import Customer_order_download from "./pages/Customer/cus_order_confirm/Customer_order_download";
import Register1 from "./pages/register_new/Register1";
import New_sales_order from "./pages/Admin/Dashboard/New_sales_order/New_sales_order";
import Supplier_reg from "./pages/Supplier_view/supplier_reg/Supplier_reg";
import M_inventory from "./pages/Admin/Dashboard/Inventory/M_inventory";
import AddproductsWrapper from "./pages/Admin/Dashboard/Products/AddproductsWrapper";
import M_prodlist from "./pages/Admin/Dashboard/ProdAndWorkList/M_prodlist";
import Supplierlist_wrapper from "./pages/Admin/Dashboard/ProdAndWorkList/Supplierlist_wrapper";
import Prodlistapprove from "./pages/Admin/Dashboard/ProdAndWorkList/Prodlistapprove";
import Add_supplier_product from "./pages/Supplier_view/Add_supplier_product";
import Fullpage_supplier_view from "./pages/Supplier_view/Fullpage_supplier_view";
import Adding_full_page from "./pages/Supplier_view/Adding_full_page";
import Suppedit_full from "./pages/Supplier_view/Suppedit_full";
import Product_view_full from "./pages/Supplier_view/Product_view_full";
import New_sales_wrapper from "./pages/Admin/Dashboard/New_sales_order/New_sales_wrapper";
import ProdWorklist_wrapper from "./pages/Admin/Dashboard/ProdAndWorkList/ProdWorklist_wrapper";
import Quotation_wrapper from "./pages/Admin/Dashboard/quotation/Quotation_wrapper";
import PaymentComponent from "./components/admin components/payment/PaymentComponent";
import So_list_wrapper from "./pages/Admin/Dashboard/New_sales_order/So_list_wrapper";
import SoPayment from "./components/admin components/payment/SoPayment";
import CustServiceReq from "./pages/Customer/customer_order/Services/CustServiceReq";
import View_service_request from "./pages/Admin/Dashboard/quotation/View_service_request";
import Adm_service_request_wrapper from "./pages/Admin/Dashboard/Adm_service_request/Adm_service_request_wrapper";
import Admin_navigate from "./pages/Admin/Admin_navigate/Admin_navigate";
import Staff_claim from "./pages/Admin/Dashboard/staff_claim/Staff_claim_wraper";
import Leave_lists from "./pages/Admin/Dashboard/leave_list/Leave_list_wraper";
import Chart_graph from "./components/admin components/Chart_graph";
import Customer_orders_wrap from "./pages/Customer/customer_order/Customer_orders_wrap";
import Unauthorized from "./components/UnAuthorized";
import TaskWorklist from "./pages/Admin/Tasks/TaskWorklist";
import User_access from "./pages/Admin/Dashboard/User_access/User_access";
import { CreateCampaign } from "./pages/Admin/Campaign/CreateCampaign";
import OffersaleMain from "./pages/Customer/Cus_products/OffersaleMain";
import { SettleWrapper } from "./pages/Admin/Profit/SettleWrapper";
import { CreateWrapper } from "./pages/Admin/Profit/CreateWrapper";
import CustomerProfileWrapper from "./pages/Admin/Dashboard/Customer_view/Customer_wrapper";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "taskworklist", element: <TaskWorklist /> },
  { path: "login", element: <Sign /> },
  { path: "unauthorized", element: <Unauthorized /> },
  { path: "login_create_pass", element: <Login_create_pass /> },
  { path: "register_new", element: <Register1 /> },
  { path: "supplier_reg", element: <Supplier_reg /> },
];
export const privateRoutes = [
  { path: "addproducts", element: <AddproductsWrapper /> },
  { path: "purchase", element: <Purchase /> },
  { path: "pendingpo", element: <Pendingpo /> },
  { path: "inventory", element: <M_inventory /> },
  { path: "popdf", element: <PoPdf /> },
  { path: "purchaseorders", element: <POWrapper /> },
  { path: "goodsreceipt", element: <GoodsReceipt /> },
  { path: "prodlist", element: <M_prodlist /> },
  { path: "worklist", element: <Worklist /> },
  { path: "feedback", element: <Feedback /> },
  { path: "category_manager", element: <CustomerManager /> },
  { path: "adm_navigate", element: <Admin_navigate /> },
  { path: "leave_list", element: <Leave_lists /> },
  { path: "staff_claim", element: <Staff_claim /> },
  { path: "chart", element: <Chart_graph /> },
  { path: "saleslist", element: <Saleslist /> },
  { path: "salespdf", element: <Salespdf /> },
  { path: "suppdetails", element: <SupplierDetails /> },
  { path: "supplierlist", element: <Supplierlist_wrapper /> },
  { path: "supp", element: <Supdetails /> },
  { path: "customerlist", element: <Customerlist /> },
  { path: "customerdetails", element: <CustomerProfileWrapper /> },
  { path: "suppcomponent", element: <Suppcomponent /> },
  { path: "transaction", element: <Transaction /> },
  { path: "service", element: <Service /> },
  { path: "productapprove", element: <Prodlistapprove /> },
  { path: "admin_quotation", element: <Quotation_wrapper /> },
  { path: "so_list", element: <So_list_wrapper /> },
  { path: "proddetails", element: <Proddetails /> },
  {
    path: "adm_service_view",
    element: <Adm_service_request_wrapper />,
  },

  { path: "payment", element: <PaymentComponent /> },
  { path: "sopayment", element: <SoPayment /> },
  { path: "new_sales_wrapper", element: <New_sales_wrapper /> },
 

  { path: "productworklist", element: <ProdWorklist_wrapper /> },
 

  { path: "new_sales_order", element: <New_sales_wrapper /> },
  { path: "view_sr", element: <View_service_request /> },
  { path: "quotation", element: <Quotation_wrapper /> },
  { path: "approveuser", element: <ApproveUsers /> },
  { path: "user_access", element: <User_access /> },
  { path: "createcampaign", element: <CreateCampaign /> },
  { path: "createshare", element: <CreateWrapper /> },
  { path: "viewdistribution", element: <SettleWrapper /> },
];
export const supplierRoutes=[
  { path: "supplier_view", element: <Fullpage_supplier_view /> },
  { path: "sup_edit_profile", element: <Suppedit_full /> },
  { path: "supplier_product_view", element: <Product_view_full /> },
  { path: "sup_prod__add", element: <Add_supplier_product /> },
  { path: "supplier_adding_products", element: <Adding_full_page /> },
]
export const customerRoutes = [
  { path: "wish_list", element: <Wishlist_cus /> },
  { path: "custservicereqs", element: <CustServiceReq /> },
  { path: "customerprofile", element: <CustomerProfileFull /> },
  { path: "customer_cart", element: <Cart /> },
  { path: "customer_topbar", element: <Customer_Topbar /> },

  { path: "customer_orders", element: <Customer_orders_wrap /> },

  { path: "cus_order_confirmation", element: <Cus_orderConfirm /> },

  { path: "custservicereqs", element: <CustServiceReq /> },
  { path: "product_detailed", element: <Profile_full_page /> },

  { path: "product_list", element: <Product_list /> },
  { path: "pdfconvert", element: <Pdfconvert /> },

  {
    path: "downloadorder",
    element: <Customer_order_download />,
  },
  {
    path: "offersale",
    element: <OffersaleMain />,
  },
];
