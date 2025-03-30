import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { title: "Blog", description: "YiNiann's Site", url: "https://en1an.com", buttonText: "Go to Blog 📖" },
  { title: "Shuttle", description: "Network service", url: "https://shuttle.en1an.com", buttonText: "Shuttle 🚀" },
  { title: "Tg", description: "Contact Me", url: "https://t.me/y1niannn", buttonText: "Telegram 📬 ", isNewTab: true },
  { title: "Image Host", description: "Picture Management", url: "https://img.en1an.com", buttonText: "Lsky 🖼️", isNewTab: true },
  { title: "Ai", description: "On-Device LLM", url: "https://ai.en1an.com", buttonText: "Open-Web UI 💻", isNewTab: true },
  { title: "Mcsm", description: "Game Control Panel", url: "https://mcsm.en1an.com", buttonText: "MCSM Panel 🎮", isNewTab: true },
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
