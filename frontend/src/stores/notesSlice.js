import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3001/notes";

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
    try {
        const response = await axios.get(API_URL);
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
    const response = await axios.post(API_URL, note); 
    return response.data;
});

export const updateNote = createAsyncThunk("notes/updateNote", async ({ id, content }) => {
    const response = await axios.put(`${API_URL}/${id}`, { content }); 
    return response.data; 
});

export const deleteNote = createAsyncThunk("notes/deleteNote", async (id) => {
    await axios.delete(`${API_URL}/${id}`); 
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
