import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    section: "",
    category: "",
  },
  reducers: {
    setCategory: (state, action) => {
      state.section = action.payload.section;
      state.category = action.payload.category;
    },
  },
});

export const { setCategory } = categorySlice.actions;
export default categorySlice.reducer;
