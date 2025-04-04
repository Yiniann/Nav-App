import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";  // 引入已经配置拦截器的 api 实例

const API_URL = "http://localhost:3001/cards";

// 获取卡片
export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const response = await api.get(API_URL);  // 使用 api 实例发送请求
  return response.data;
});

// 添加卡片
export const addCard = createAsyncThunk("cards/addCard", async (newCard, { getState }) => {
  const cardsCount = getState().cards.length;  
  newCard.order = cardsCount + 1;

  const response = await api.post(API_URL, newCard, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
});

// 删除卡片
export const removeCard = createAsyncThunk("cards/removeCard", async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);  // 使用 api 实例发送删除请求
  if (response.status === 200) return id; 
  throw new Error("Failed to delete card");
});

// 持久化排序
export const reorderCards = createAsyncThunk(
  "cards/reorderCards",
  async ({ sourceIndex, destinationIndex }, { getState }) => {
    let cards = [...getState().cards];

    const [movedItem] = cards.splice(sourceIndex, 1);
    cards.splice(destinationIndex, 0, movedItem);

    const updatedCards = cards.map((card, index) => ({ ...card, order: index }));

    const response = await api.post(`${API_URL}/reorder`, updatedCards, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 200) {
      throw new Error('Failed to reorder cards');
    }

    return updatedCards;
  }
);

// Redux Slice
const cardsSlice = createSlice({
  name: "cards",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        return action.payload.sort((a, b) => a.order - b.order);
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.push(action.payload); 
      })
      .addCase(removeCard.fulfilled, (state, action) => {
        return state.filter((card) => card.id !== action.payload);  
      })      
      .addCase(reorderCards.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export default cardsSlice.reducer;
