import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { title: "Blog", description: "YiNiann's Site", url: "https://en1an.com", buttonText: "前往博客 👉" },
  { title: "Shuttle", description: "Network service", url: "https://shuttle.en1an.com", buttonText: "Shuttle 🚀" },
  { title: "Tg", description: "Contact Me", url: "https://t.me/y1niannn", buttonText: "Telegram ✈️", isNewTab: true },
];

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addCard } = cardsSlice.actions;
export default cardsSlice.reducer;
