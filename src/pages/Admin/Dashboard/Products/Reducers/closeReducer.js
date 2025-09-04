export const INITIAL_STATE = {
  suppliers: false,
  category: false,
  subCategory: false,
  filteredSupplier: [],
  filteredCategory: [],
  filteredSubCategory: [],
  selectedSupplier: "",
  selectedCategory: "",
  selectedSubCategory: "",
  typingSupplier: "",
  typingCategory: "",
  typingSubCategory: "",
};

export const closeProductInputsReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_SUPPLIER": {
      return {
        ...state,
        suppliers: true,
        category: false,
        subCategory: false,
      };
    }
    case "SHOW_CATEGORY": {
      return {
        ...state,
        category: true,
        suppliers: false,
        subCategory: false,
      };
    }

    case "SHOW_SUBCATEGORY": {
      return {
        ...state,
        subCategory: true,
        suppliers:false,
        category:false,
      };
    }

    case "FILTER_SUPPLIER": {
      return {
        ...state,
        filteredSupplier: action.payload,
      };
    }
    case "FILTER_CATEGORY": {
      return {
        ...state,
        filteredCategory: action.payload,
      };
    }
    case "FILTER_SUBCATEGORY": {
      return {
        ...state,
        filteredSubCategory: action.payload,
      };
    }

    case "CLICK_SUPPLIER": {
      return {
        ...state,
        selectedSupplier: action.payload,
        typingSupplier:""
      };
    }
    case "CLICK_CATEGORY": {
      return {
        ...state,
        selectedCategory: action.payload,
        typingCategory:""
      };
    }
    case "CLICK_SUBCATEGORY": {
      return {
        ...state,
        selectedSubCategory: action.payload,
        typingSubCategory:""
      };
    }
    case "TYPING_SUPPLIER": {
      return {
        ...state,
        typingSupplier: action.payload,
      };
    }
    case "TYPING_CATEGORY": {
      return {
        ...state,
        typingCategory: action.payload,
      };
    }
    case "TYPING_SUBCATEGORY": {
      return {
        ...state,
        typingSubCategory: action.payload,
      };
    }
    case "CLEAR": {
      return {
        ...state,
        suppliers: false,
        category: false,
        subCategory: false,
      };
    }
    case "CLEAR_SUPPLIER": {
      return {
        ...state,
        selectedSupplier: "",
      };
    }
    case "CLEAR_CATEGORY": {
      return {
        ...state,
        selectedCategory: "",
      };
    }
    case "CLEAR_SUBCATEGORY": {
      return {
        ...state,
        selectedSubCategory: "",
      };
    }
    default:
      return state;
  }
};

export const ACTIONS = {
  CLEAR: "CLEAR",
};
