import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3001/cards";

// 获取卡片
export const fetchCards = createAsyncThunk("cards/fetchCards", async () => {
  const response = await fetch(API_URL);
  return response.json();
});

// 添加卡片
export const addCard = createAsyncThunk("cards/addCard", async (newCard) => {
  //生成order号码
  const cardsCount = await fetch(API_URL).then(res => res.json()).then(data => data.length);
  newCard.order = cardsCount + 1

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCard),
  });
  return response.json();
});

// 删除卡片
export const removeCard = createAsyncThunk("cards/removeCard", async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (response.ok) return id;
  throw new Error("Failed to delete card");
});

// **持久化排序**
export const reorderCards = createAsyncThunk(
  "cards/reorderCards",
  async ({ sourceIndex, destinationIndex }, { getState }) => {
    let cards = [...getState().cards];

    // 调整顺序
    const [movedItem] = cards.splice(sourceIndex, 1);
    cards.splice(destinationIndex, 0, movedItem);

    // 重新计算 `order`，并发送更新请求
    const updatedCards = cards.map((card, index) => ({ ...card, order: index }));

    await fetch(`${API_URL}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCards),
    });

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
        // **按照 order 排序后再更新 state**
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
