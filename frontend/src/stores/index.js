import { configureStore } from "@reduxjs/toolkit"
import { thunk } from 'redux-thunk'
import cardsReducer from "./cardsSlice"
import darkModeReducer from "./darkModeSlice"
import toastReducer from './toastSlice'
import notesReducer from "./notesSlice"
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    darkMode: darkModeReducer,
    toast: toastReducer,
    notes: notesReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
