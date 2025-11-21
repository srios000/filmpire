import { createSlice } from '@reduxjs/toolkit';

export const genreOrCategory = createSlice({
  name: 'genreOrCategory',
  initialState: {
    genreIdOrCategoryName: '',
    page: 1,
    searchQuery: '',
  },
  reducers: {
    selectGenreOrCategory: (state, action) => {
      state.genreIdOrCategoryName = action.payload;
      state.searchQuery = '';
      state.page = 1;
    },
    searchMovie: (state, action) => {
      state.searchQuery = action.payload;
      state.genreIdOrCategoryName = '';
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { selectGenreOrCategory, searchMovie, setPage } = genreOrCategory.actions;

export default genreOrCategory.reducer;
