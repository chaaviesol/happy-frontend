export const INITIAL_STATE = {
    draftDataExist:false,
    formData:{},
    supplierNames: [],
    logisticsNames: [],
    showSupplierNames: false,
    showLogisticsNames: false,
    filteredSupplier: [],
    filteredLogistics: [],
    notesArray:[{},{}],
    productsForSelectedSupplierArr:[],
    productTableArr:[{},{},{}],
    showProductNamesBox:"",
    totalAmount:"",
    apiFormData:{},
    showNewLogistics:false,
    newLogistics:{}
  };
  
  export const createPoReducer = (state, action) => {
      switch (action.type) {
          case ACTIONS.UPDATE_FORM_DATA : {
              return{
                  ...state,
                  formData:{
                      ...state.formData,
                      [action.payload.name]:action.payload.value
                  }
                 
              }
          }
          case ACTIONS.SET_SUP_AND_LOGISTICS:{
              return {
                  ...state,
                  supplierNames:action.payload.suppliers,
                  logisticsNames:action.payload.logistics
  
              }
          }
          case ACTIONS.FILTER_SUP_OR_LOGISTICS:{
              return {
                  ...state,
                [action.payload.name]:action.payload.filteredData
  
              }
          }
          case ACTIONS.SHOW_SUPPLIER_NAMES:{
              return {
                  ...state,
                  showSupplierNames:true,
                  showLogisticsNames: false,
  
              }
          }
          case ACTIONS.SHOW_LOGISTICS_NAMES:{
              return {
                  ...state,
                  showLogisticsNames: true,
                  showSupplierNames:false,
  
  
              }
          }
          case ACTIONS.HIDE_BOXES:{
              return {
                  ...state,
                  showLogisticsNames: false,
                  showSupplierNames:false,
                  filteredSupplier: [],
                  filteredLogistics: [],
              }
          }
          case ACTIONS.ADD_NOTES:{
              return{
                  ...state,
                notesArray:action.payload
              }
          }
          case ACTIONS.EXTRA_NOTE:{
              return{
                  ...state,
                 notesArray:[...state.notesArray,3]
                 
              }
          }
          case ACTIONS.SET_PRODUCTS_FOR_SELECTED_SUPPLIER:{
              return{
                  ...state,
                  productsForSelectedSupplierArr:action.payload
              }
          }
          case ACTIONS.TOGGLE_SHOW_PRODUCT_BOXES:{
              return{
                  ...state,
                  showProductNamesBox:action.payload
              }
          }
          case ACTIONS.UPDATE_PRODUCT_TABLE_ARRAY:{
              return{
                  ...state,
                  productTableArr:action.payload
              }
          }
          case ACTIONS.ADD_EXTRA_PRODUCT_ROW:{
              return{
                  ...state,
  
              }
          }
          case ACTIONS.UPDATE_TOTAL:{
              return{
                  ...state,
                  totalAmount:action.payload
  
              }
          }
          case ACTIONS.UPDATE_FORM_DATA_DRAFT:{
              return{
                  ...state,
                  formData:action.payload
  
              }
          }
          case ACTIONS.TOGGLE_DRAFT_DATA:{
              return{
                  ...state,
                  draftDataExist:action.payload
  
              }
          }
          case ACTIONS.UPDATE_API_FORM_DATA:{
              return{
                  ...state,
                  apiFormData:action.payload
  
              }
          }
          case ACTIONS.SHOW_DOWNLOAD_PDF_BTN:{
              return{
                  ...state,
                  showDownloadPdf:true
  
              }
          }
          case ACTIONS.SHOW_NEW_LOGISTICS:{
              return{
                  ...state,
                  showNewLogistics:action.payload
  
              }
          }
          case ACTIONS.NEW_LOGISTICS:{
              return{
                  ...state,
                  newLogistics:{
                    ...state.newLogistics,
                  [action.payload.name]:action.payload.value
                  }
  
              }
          }
          case ACTIONS.CLEAR_NEW_LOGISTICS:{
              return{
                  ...state,
                  newLogistics:{}                  
  
              }
          }
          default:
              return state;
          
      }
  
  };
  
  export const ACTIONS = {
    CLEAR: "CLEAR",
    SET_SUP_AND_LOGISTICS: "SET_SUP_AND_LOGISTICS",
    SHOW_SUPPLIER_NAMES:"SHOW_SUPPLIER_NAMES",
    SHOW_LOGISTICS_NAMES:"SHOW_LOGISTICS_NAMES",
    UPDATE_FORM_DATA:"UPDATE_FORM_DATA",
    HIDE_BOXES:"HIDE_BOXES",
    FILTER_SUP_OR_LOGISTICS:"FILTER_SUP_OR_LOGISTICS",
    ADD_NOTES:"ADD_NOTES",
    EXTRA_NOTE:"EXTRA_NOTE",
    SET_PRODUCTS_FOR_SELECTED_SUPPLIER:"SET_PRODUCTS_FOR_SELECTED_SUPPLIER",
    TOGGLE_SHOW_PRODUCT_BOXES:"TOGGLE_SHOW_PRODUCT_BOXES",
    UPDATE_PRODUCT_TABLE_ARRAY:"UPDATE_PRODUCT_TABLE_ARRAY",
    ADD_EXTRA_PRODUCT_ROW:"ADD_EXTRA_PRODUCT_ROW",
    UPDATE_TOTAL:"UPDATE_TOTAL",
    UPDATE_FORM_DATA_DRAFT:"UPDATE_FORM_DATA_DRAFT",
    TOGGLE_DRAFT_DATA:"TOGGLE_DRAFT_DATA",
    UPDATE_API_FORM_DATA:"UPDATE_API_FORM_DATA",
    SHOW_NEW_LOGISTICS:"SHOW_NEW_LOGISTICS",
    NEW_LOGISTICS:"NEW_LOGISTICS",
    CLEAR_NEW_LOGISTICS:"CLEAR_NEW_LOGISTICS"
  };