import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"


const API_URL = "http://localhost:3001/cards"


export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const response = await fetch(API_URL)
  return response.json()
})

// 添加卡片
export const addCard = createAsyncThunk("cards/addCard", async (newCard) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCard),
  })
  return response.json()
})

const cardsSlice = createSlice({
  name: "cards",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  },
})

export default cardsSlice.reducer
