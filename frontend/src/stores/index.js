import { configureStore } from "@reduxjs/toolkit"
import cardsReducer from "./cardsSlice"
import darkModeReducer from "./darkModeSlice"
import toastReducer from './toastSlice'
import { thunk } from 'redux-thunk'
import notesReducer from "./notesSlice"

export const store = configureStore({
  reducer: {
    cards: cardsReducer,
    darkMode: darkModeReducer,
    toast: toastReducer,
    notes: notesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})
