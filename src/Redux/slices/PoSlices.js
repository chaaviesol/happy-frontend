import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  draftDataExist: false,
  formData: {},
  supplierNames: [],
  logisticsNames: [],
  showSupplierNames: false,
  showLogisticsNames: false,
  filteredSupplier: [],
  filteredLogistics: [],
  notesArray: [{}, {}],
  productsForSelectedSupplierArr: [],
  productTableArr: [{}, {}, {}],
  showProductNamesBox: "",
  totalAmount: "",
  apiFormData: {},
  showNewLogistics: false,
  newLogistics: {},
};

const poSlice = createSlice({
  name: "purchaseOrder",
  initialState,
  reducers: {
    UPDATE_FORM_DATA: (state, action) => {
      state.formData = {
        ...state.formData,
        [action.payload.name]: action.payload.value,
      };
    },
    SET_SUP_AND_LOGISTICS: (state, action) => {
      return {
        ...state,
        supplierNames: action.payload.suppliers,
        logisticsNames: action.payload.logistics,
      };
    },
    FILTER_SUP_OR_LOGISTICS: (state, action) => {
      return {
        ...state,
        [action.payload.name]: action.payload.filteredData,
      };
    },
    SHOW_SUPPLIER_NAMES: (state) => {
      return {
        ...state,
        showSupplierNames: true,
        showLogisticsNames: false,
      };
    },
    SHOW_LOGISTICS_NAMES: (state) => {
      return {
        ...state,
        showLogisticsNames: true,
        showSupplierNames: false,
      };
    },
    HIDE_BOXES: (state) => {
      state.showLogisticsNames = false;
      state.showSupplierNames = false;
      state.filteredSupplier = [];
      state.filteredLogistics = [];
    },
    ADD_NOTES: (state, action) => {
      return {
        ...state,
        notesArray: action.payload,
      };
    },
    EXTRA_NOTE: (state) => {
      return {
        ...state,
        notesArray: [...state.notesArray, 3],
      };
    },
    SET_PRODUCTS_FOR_SELECTED_SUPPLIER: (state, action) => {
      return {
        ...state,
        productsForSelectedSupplierArr: action.payload,
      };
    },
    TOGGLE_SHOW_PRODUCT_BOXES: (state, action) => {
      return {
        ...state,
        showProductNamesBox: action.payload,
      };
    },
    UPDATE_PRODUCT_TABLE_ARRAY: (state, action) => {
      state.productTableArr = action.payload;
    },
    ADD_EXTRA_PRODUCT_ROW: (state) => {
      return {
        ...state,
      };
    },
    UPDATE_TOTAL: (state, action) => {
      console.log(action)
      state.totalAmount = action.payload;
    },
    UPDATE_FORM_DATA_DRAFT: (state, action) => {
      state.formData = action.payload;
    },
    TOGGLE_DRAFT_DATA: (state, action) => {
      return {
        ...state,
        draftDataExist: action.payload,
      };
    },
    UPDATE_API_FORM_DATA: (state, action) => {
      return {
        ...state,
        apiFormData: action.payload,
      };
    },
    SHOW_DOWNLOAD_PDF_BTN: (state) => {
      return {
        ...state,
        showDownloadPdf: true,
      };
    },
    SHOW_NEW_LOGISTICS: (state, action) => {
      return {
        ...state,
        showNewLogistics: action.payload,
      };
    },
    NEW_LOGISTICS: (state, action) => {
      return {
        ...state,
        newLogistics: {
          ...state.newLogistics,
          [action.payload.name]: action.payload.value,
        },
      };
    },
    CLEAR_NEW_LOGISTICS: (state) => {
      return {
        ...state,
        newLogistics: {},
      };
    },
    RESET_STATE: (state) => {
      
      return initialState;
    },
  },
});
export const {
  UPDATE_FORM_DATA,
  SET_SUP_AND_LOGISTICS,
  FILTER_SUP_OR_LOGISTICS,
  SHOW_SUPPLIER_NAMES,
  SHOW_LOGISTICS_NAMES,
  HIDE_BOXES,
  ADD_NOTES,
  EXTRA_NOTE,
  SET_PRODUCTS_FOR_SELECTED_SUPPLIER,
  TOGGLE_SHOW_PRODUCT_BOXES,
  UPDATE_PRODUCT_TABLE_ARRAY,
  ADD_EXTRA_PRODUCT_ROW,
  UPDATE_TOTAL,
  UPDATE_TO,
  UPDATE_FORM_DATA_DRAFT,
  TOGGLE_DRAFT_DATA,
  UPDATE_API_FORM_DATA,
  SHOW_DOWNLOAD_PDF_BTN,
  SHOW_NEW_LOGISTICS,
  NEW_LOGISTICS,
  CLEAR_NEW_LOGISTICS,
  RESET_STATE
} = poSlice.actions;

export default poSlice.reducer;
