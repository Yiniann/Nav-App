import { configureStore } from "@reduxjs/toolkit";
import cardsReducer from "./cardsSlice";
import darkModeReducer from "./darkModeSlice";

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    darkMode: darkModeReducer,
  },
});
