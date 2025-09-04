import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Customer_cart_Data: [],
  tempTflse: false,
  wishlsit_data: [],
  wallet_data: []
};

export const Redux_slice = createSlice({
  name: "updateStore",
  initialState,
  reducers: {
    addcart: (state, actions) => {
      state.Customer_cart_Data = actions.payload;
      console.log("actions.payload ====>", actions.payload);
    },
    trflseSetting: (state) => {
      if (state.tempTflse) {
        state.tempTflse = false;
      } else {
        state.tempTflse = true;
      }
      console.log("state.tempTflse====>", state.tempTflse);
    },
    addwishlist: (state, actions) => {
      state.wishlsit_data = actions.payload; 
      console.log("actions.payload ====>", actions.payload);
    },
    addwallet: (state, actions) => {
      state.wallet_data = actions.payload;
      console.log("actions.payload ====>", actions.payload);
    },
  },
});

export const { addcart, trflseSetting, addwishlist, addwallet } = Redux_slice.actions;

export default Redux_slice.reducer;
