import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001/cards";

// 获取卡片
export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const response = await axios.get(API_URL);
  return response.data;  // axios 返回的对象中包含 `data` 属性
});

// 添加卡片
export const addCard = createAsyncThunk("cards/addCard", async (newCard, { getState }) => {
  const cardsCount = getState().cards.length;  // 从 Redux 获取卡片数量
  newCard.order = cardsCount + 1;  // 计算新的 order

  const response = await axios.post(API_URL, newCard, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
});

// 删除卡片
export const removeCard = createAsyncThunk("cards/removeCard", async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  if (response.status === 200) return id;  // axios 删除请求成功时返回状态 200
  throw new Error("Failed to delete card");
});

// 持久化排序
export const reorderCards = createAsyncThunk(
  "cards/reorderCards",
  async ({ sourceIndex, destinationIndex }, { getState }) => {
    let cards = [...getState().cards];

    // 调整顺序
    const [movedItem] = cards.splice(sourceIndex, 1);
    cards.splice(destinationIndex, 0, movedItem);

    // 重新计算 `order`，并发送更新请求
    const updatedCards = cards.map((card, index) => ({ ...card, order: index }));

    const response = await axios.post(`${API_URL}/reorder`, updatedCards, {
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
        // 按照 order 排序后更新 state
        return action.payload.sort((a, b) => a.order - b.order);
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.push(action.payload);  // 添加新卡片
      })
      .addCase(removeCard.fulfilled, (state, action) => {
        return state.filter((card) => card.id !== action.payload);  // 直接从 state 中删除卡片
      })      
      .addCase(reorderCards.fulfilled, (state, action) => {
        return action.payload;  // 更新排序后的卡片列表
      });
  },
});

export default cardsSlice.reducer;
