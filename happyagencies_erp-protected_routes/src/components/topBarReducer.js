export const INITIAL_STATE = {
  type: "",
  category_specs: [],
  suppliers: [],
  brands: [],
};

export const productDeatilsReducer = (state, action) => {
  switch (action.type) {
    case "Type": {
      return {
        ...state,
        type: action.payload,
      };
    }
    case "CATEGORY_SPECS": {
      return {
        ...state,

        category_specs: action.payload,
      };
    }
    case "SUPPLIERS": {
      return {
        ...state,
        suppliers: action.payload,
      };
    }
    case "BRANDS": {
      return {
        ...state,
        brands: action.payload,
      };
    }

    default:
      return state;
  }
};
