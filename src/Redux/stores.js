import { configureStore } from '@reduxjs/toolkit'
import happy_data from "./SliceRedux"
import PoSlicesReducer from './slices/PoSlices'



export const stores = configureStore({
    reducer: {
        happy_store: happy_data,
        poSlices: PoSlicesReducer
        
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware(),
    devTools:true
})
