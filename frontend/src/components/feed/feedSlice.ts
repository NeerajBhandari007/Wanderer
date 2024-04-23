import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import {
  createComment,
  createCommentToComment,
  createPost,
  deletePost,
  fetchAllPost,
  fetchPostLikeById,
} from "./feedApi";

interface feedDetails {
    status: string;
    allPosts: any 
    postSuccess:any
    close:number
    area:string
    areaComment:object|null
    Likeclose:number,
    postLikeUser:any,
    delete:any
  }
const initialState:feedDetails = {
  status: "idle",
  allPosts: [],
  postSuccess:"false",
  close:-1,
  area:"Add a comment.....",
  areaComment:null,
  Likeclose:-1,
  postLikeUser:null,
  delete :true
};

export const fetchAllPostAsync = createAsyncThunk(
    "feed/fetchAllPost",
    async () => {
      const response:any = await fetchAllPost();
      return response.data;
    }
);

export const createPostAsync = createAsyncThunk(
    "feed/createPost",
    async (postData:object) => {
      const response:any = await createPost(postData);
      return response.data;
    }
);
export const createCommentAsync = createAsyncThunk(
    "feed/createComment",
    async (postData:any) => {
      const response:any = await createComment(postData);
      return response.data;
    }
);
export const createCommentToCommentAsync = createAsyncThunk(
    "feed/createCommentToComment",
    async (postData:any) => {
      const response:any = await createCommentToComment(postData);
      return response.data;
    }
);
export const fetchPostLikeByIdAsync = createAsyncThunk(
    "feed/fetchPostLikeById",
    async (id:any) => {
      const response:any = await fetchPostLikeById(id);
      return response.data;
    }
);
export const deletePostAsync = createAsyncThunk(
    "feed/deletePost",
    async (id:any) => {
      const response:any = await deletePost(id);
      return response.data;
    }
);


export const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
      handleClose(state,action: PayloadAction<number>) {
        const num = action.payload;
        state.close=num
      },
      handleArea(state,action: PayloadAction<string>){
        const cont=action.payload;
        state.area=cont
      },
      handleAreaComment(state,action: PayloadAction<object>){
        const cont=action.payload;
        state.areaComment=cont
      },
      handleLikeClose(state,action: PayloadAction<number>) {
        const num = action.payload;
        state.Likeclose=num
      },
      updatePost(state,action: any) {
        const arr = action.payload;
        state.allPosts=arr
      },
      updateDel(state) {
        state.delete=true
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllPostAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchAllPostAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.allPosts = action.payload;
        })
        .addCase(createPostAsync.pending, (state) => {
          state.postSuccess = "flase";
        })
        .addCase(createPostAsync.fulfilled, (state, action) => {
          state.postSuccess = "true";
          state.allPosts = action.payload;
        })
        .addCase(createCommentAsync.pending, (state) => {
          state.status = "pending";
        })
        .addCase(createCommentAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.allPosts = action.payload;
        })
        .addCase(createCommentToCommentAsync.pending, (state) => {
          state.status = "pending";
        })
        .addCase(createCommentToCommentAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.allPosts = action.payload;
        })
        .addCase(fetchPostLikeByIdAsync.pending, (state) => {
          state.status = "pending";
          state.postLikeUser=null
        })
        .addCase(fetchPostLikeByIdAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.postLikeUser = action.payload;
        })
        .addCase(deletePostAsync.pending, (state) => {
          state.status = "pending";
          state.delete=true
        })
        .addCase(deletePostAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.delete=false
        })
    },
  });
  
  export const selectAllPost = (state:any) => state.feed.allPosts;
  export const selectFeedStatus= (state:any) => state.feed.status;
  export const selectpostSuccess= (state:any) => state.feed.postSuccess;
  export const selectClose= (state:any) => state.feed.close;
  export const selectLikeClose= (state:any) => state.feed.Likeclose;
  export const selectArea= (state:any) => state.feed.area;
  export const selectAreaComment= (state:any) => state.feed.areaComment;
  export const selectPostLikeUser= (state:any) => state.feed.postLikeUser;
  export const selectDelete= (state:any) => state.feed.delete;
  export const {updateDel, handleClose,handleArea,handleAreaComment,handleLikeClose,updatePost } = feedSlice.actions;
  export default feedSlice.reducer;