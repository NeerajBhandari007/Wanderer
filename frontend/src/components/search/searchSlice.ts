import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { searchPost, searchUser } from "./searchApi";

interface searchDetails {
    status: string;
    searchUser:any,
    searchPost:any
  }
const initialState:searchDetails = {
  status: "idle",
  searchUser:[],
  searchPost:[]
};

export const searchUserAsync = createAsyncThunk(
    "search/searchUser",
    async (data:any) => {
      const response:any = await searchUser(data);
      return response.data;
    }
);
export const searchPostAsync = createAsyncThunk(
    "search/searchPost",
    async (data:any) => {
      const response:any = await searchPost(data);
      return response.data;
    }
);


export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
      clearSearchItem(state) {
        state.searchUser=[]
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(searchUserAsync.pending, (state) => {
          state.status = "loading";
          state.searchUser = [];
        })
        .addCase(searchUserAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.searchUser = action.payload;
        })
        .addCase(searchPostAsync.pending, (state) => {
          state.status = "loading";
          state.searchPost = [];
        })
        .addCase(searchPostAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.searchPost = action.payload;
        })
    },
  });
  
  export const selectSearchUser = (state:any) => state.search.searchUser;
  export const selectSearchPost = (state:any) => state.search.searchPost;
  export const { clearSearchItem } = searchSlice.actions;
  
  export default searchSlice.reducer;
  