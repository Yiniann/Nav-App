import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";  // 使用你已经配置好的 api 实例

const API_URL = "/notes";

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  try {
    const response = await api.get(API_URL);  // 使用 api 实例
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch notes");
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
});

export const addNote = createAsyncThunk("notes/addNote", async (note) => {
  const response = await api.post(API_URL, note);  // 使用 api 实例
  return response.data;
});

export const updateNote = createAsyncThunk("notes/updateNote", async ({ id, content }) => {
  try {
      const response = await api.put(`${API_URL}/${id}`, { content });
      console.log("Backend response after update:", response.data);  // 确保返回了更新后的数据
      return response.data;  // 返回更新后的数据
  } catch (error) {
      console.error("Error updating note:", error);  // 错误处理
      throw error;
  }
});


export const deleteNote = createAsyncThunk("notes/deleteNote", async (id) => {
  await api.delete(`${API_URL}/${id}`);  // 使用 api 实例
  return id;
});

const notesSlice = createSlice({
  name: "notes",
  initialState: { notes: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload || [];
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const { id, content } = action.payload;
        state.notes = state.notes.map((note) =>
          note.id === id ? { ...note, content } : note
        );
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      });
  },
});

export default notesSlice.reducer;
