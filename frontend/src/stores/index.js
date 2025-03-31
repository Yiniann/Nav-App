import { configureStore } from "@reduxjs/toolkit"
import cardsReducer from "./cardsSlice"
import darkModeReducer from "./darkModeSlice"
import toastReducer from './toastSlice'
import { thunk } from 'redux-thunk'

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    darkMode: darkModeReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
