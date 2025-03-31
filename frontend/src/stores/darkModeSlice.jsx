import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("darkMode") === "true";

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      const newMode = !state;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
