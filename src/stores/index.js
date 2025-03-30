import { configureStore } from "@reduxjs/toolkit"
import cardsReducer from "./cardsSlice"
import darkModeReducer from "./darkModeSlice"
import { thunk } from 'redux-thunk'

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    darkMode: darkModeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
