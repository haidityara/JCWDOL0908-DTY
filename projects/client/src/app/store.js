import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../features/LoaderSlice";
import userReducer from "../features/auth/slice/UserSlice";

export default configureStore({
  reducer: {
    loader: loaderReducer,
    user: userReducer,
  },
});
