import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../features/LoaderSlice";

export default configureStore({
  reducer: {
    loader: loaderReducer,
  },
});
