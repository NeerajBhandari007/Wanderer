import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchFollowUserId,
  fetchLikedPost,
  fetchLoggedInUser,
  fetchOldChat,
  fetchRandomnUser,
  fetchUserFreinds,
  fetchUserInfoById,
  likeComment,
  likePost,
  totalCommentLike,
  unFollowUserId,
  unlikeComment,
  unlikePost,
  updateUser,
} from "./userApi";

interface UserDetails {
    status: string;
    randomStatus:string,
    userInfo: object | null;
    random: any,
    // message:string
    likedPost:any
    profileInfo:any
    friends:any
    selectedFriend:any
    chatMessage:any
    oldMessage:any
  }
const initialState:UserDetails = {
  status: "idle",
  randomStatus:"idle",
  userInfo: null,
  random:[],
  // message:"",
  likedPost:[],
  profileInfo:null,
  friends:[],
  selectedFriend:null,
  chatMessage:[],
  oldMessage:[]
};

export const fetchLoggedInUserAsync = createAsyncThunk(
    "user/fetchLoggedInUser",
    async () => {
      const response:any = await fetchLoggedInUser();
      return response.data;
    }
);
export const fetchUserInfoByIdAsync = createAsyncThunk(
    "user/fetchUserInfoById",
    async (id:any) => {
      const response:any = await fetchUserInfoById(id);
      return response.data;
    }
);
export const fetchRandomnUserAsync = createAsyncThunk(
    "user/fetchRandomnUser",
    async () => {
      const response:any = await fetchRandomnUser();
      return response.data;
    }
);
export const fetchFollowUserIdAsync = createAsyncThunk(
    "user/fetchFollowUserId",
    async (id:any) => {
      const response:any = await fetchFollowUserId(id);
      return response.data;
    }
);
export const noFollowUserIdAsync = createAsyncThunk(
  "user/nofetchFollowUserId",
  async (id:any) => {
    const response:any = await fetchFollowUserId(id);
    return response.data;
  }
);
export const fetchLikedPostAsync = createAsyncThunk(
    "user/fetchLikedPost",
    async () => {
      const response:any = await fetchLikedPost();
      return response.data;
    }
);

export const likePostAsync = createAsyncThunk(
  "user/likePost",
  async (userId:any) => {
    const response:any = await likePost(userId);
    // console.log(response.data)
    return response.data;
  }
);
export const unlikePostAsync = createAsyncThunk(
"user/unlikePost",
async (userId:any) => {
  const response:any = await unlikePost(userId);
  return response.data;
}
);
export const likeCommentAsync = createAsyncThunk(
"user/likeComment",
async (commentId:any) => {
  const response:any = await likeComment(commentId);
  return response.data;
}
);
export const unlikeCommentAsync = createAsyncThunk(
"user/unlikeComment",
async (commentId:any) => {
  const response:any = await unlikeComment(commentId);
  return response.data;
}
);
export const totalCommentLikeAsync = createAsyncThunk(
"user/totalCommentLike",
async (commentId:any) => {
  const response:any = await totalCommentLike(commentId);
  return response.data;
}
);

export const fetchUserFreindsAsync = createAsyncThunk(
"user/fetchUserFreinds",
async () => {
  const response:any = await fetchUserFreinds();
  return response.data;
}
);
export const fetchOldChatAsync = createAsyncThunk(
"user/fetchOldChat",
async (userId:any) => {
  const response:any = await fetchOldChat(userId);
  return response.data;
}
);
export const unFollowUserIdAsync = createAsyncThunk(
"user/unFollowUserId",
async (userId:any) => {
  const response:any = await unFollowUserId(userId);
  return response.data;
}
);
export const nounFollowUserIdAsync = createAsyncThunk(
"user/nounFollowUserId",
async (userId:any) => {
  const response:any = await unFollowUserId(userId);
  return response.data;
}
);
export const updateUserAsync = createAsyncThunk(
"user/updateUser",
async (userData:any) => {
  const response:any = await updateUser(userData);
  return response.data;
}
);


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      removeUser(state, action: PayloadAction<string>) {
        const userIdToRemove = action.payload;
        state.random = state.random.filter((user: any) => user.id !== userIdToRemove);
      },
      handleFriend(state, action: PayloadAction<object>) {
        const selected = action.payload;
        state.selectedFriend = selected;
      },
      handleChat(state, action: PayloadAction<object>) {
        const m1 = action.payload;
        state.chatMessage = [...state.chatMessage,m1];
      },
      clearOldMessage(state) {
        state.oldMessage=[];
      },
      clearChat(state) {
        state.chatMessage = [];
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchLoggedInUserAsync.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.userInfo = action.payload;
        })
        .addCase(fetchUserInfoByIdAsync.pending, (state) => {
          state.status = "loading";
          state.profileInfo = null;
        })
        .addCase(fetchUserInfoByIdAsync.fulfilled, (state, action) => {
          state.status = "loaded";
          state.profileInfo = action.payload;
         
        })
        .addCase(fetchRandomnUserAsync.pending, (state) => {
          state.randomStatus="loading"
        })
        .addCase(fetchRandomnUserAsync.fulfilled, (state, action) => {
          state.randomStatus="loaded"
          state.random = action.payload;
        })
        .addCase(fetchLikedPostAsync.pending, (state) => {
          // state.status="loading"
        })
        .addCase(fetchLikedPostAsync.fulfilled, (state, action) => {
          // state.status="loaded"
          state.likedPost = action.payload;
        })
        .addCase(fetchFollowUserIdAsync.pending, (state) => {
        })
        .addCase(fetchFollowUserIdAsync.fulfilled, (state, action) => {
          state.profileInfo=action.payload;
          state.userInfo=action.payload
        })
        .addCase(unFollowUserIdAsync.pending, (state) => {
        })
        .addCase(unFollowUserIdAsync.fulfilled, (state, action) => {
          state.profileInfo=action.payload;
          state.userInfo=action.payload
        })
        .addCase(nounFollowUserIdAsync.pending, (state) => {
        })
        .addCase(nounFollowUserIdAsync.fulfilled, (state, action) => {
          state.userInfo=action.payload
        })
        .addCase(noFollowUserIdAsync.pending, (state) => {
        })
        .addCase(noFollowUserIdAsync.fulfilled, (state, action) => {
          state.userInfo=action.payload
        })
        .addCase(updateUserAsync.pending, (state) => {
          // state.status="loading"
        })
        .addCase(updateUserAsync.fulfilled, (state, action) => {
          state.profileInfo=action.payload;
          state.userInfo=action.payload;
        })
        .addCase(likePostAsync.pending, (state) => {
          // state.status="loading"
        })
        .addCase(likePostAsync.fulfilled, (state, action) => {
          state.likedPost=action.payload;
        })
        .addCase(unlikePostAsync.pending, (state) => {
          // state.status="loading"
        })
        .addCase(unlikePostAsync.fulfilled, (state, action) => {
          state.likedPost=action.payload;
        })
        .addCase(fetchUserFreindsAsync.pending, (state) => {
          // state.status="loading"
        })
        .addCase(fetchUserFreindsAsync.fulfilled, (state, action) => {
          state.friends=action.payload;
        })
        .addCase(fetchOldChatAsync.pending, (state) => {
          // state.status="loading"
        })
        .addCase(fetchOldChatAsync.fulfilled, (state, action) => {
          state.oldMessage=action.payload;
        })
    },
  });
  
  export const selectUserInfo = (state:any) => state.user.userInfo;
  export const selectUserStatus = (state:any) => state.user.status;
  export const selectRandomUser = (state:any) => state.user.random;
  export const selectRandomStatus = (state:any) => state.user.randomStatus;
  export const selectLikedPost = (state:any) => state.user.likedPost;
  export const selectProfileInfo = (state:any) => state.user.profileInfo;
  export const selectUserFriends = (state:any) => state.user.friends;
  export const selectedFriend = (state:any) => state.user.selectedFriend;
  export const selectChatMessage = (state:any) => state.user.chatMessage;
  export const selectOldChat = (state:any) => state.user.oldMessage;
  export const { removeUser,handleFriend,handleChat,clearOldMessage,clearChat } = userSlice.actions;
  export default userSlice.reducer;
  