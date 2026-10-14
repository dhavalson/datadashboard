import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// import transportReducer from './transportSlice';
// import rssReducer from './rssSlice'
// import salesReturnReducer from './salesReturnSlice'
import distributorReducer from './distributorSlice'
// import paymentReducer from './paymentSlice'
import productReducer from './productSlice'
import primaryOrdersReducer from './primaryOrderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // transport: transportReducer,
    // rss: rssReducer,
    // salesReturn: salesReturnReducer,
    distributor: distributorReducer,
    // payment: paymentReducer,
    product: productReducer,
    primaryOrders: primaryOrdersReducer,
  },
});