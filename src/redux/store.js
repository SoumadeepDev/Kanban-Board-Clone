import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardsSlice";

export const store = configureStore({
  reducer: {
    boards: boardReducer,
  },
});
