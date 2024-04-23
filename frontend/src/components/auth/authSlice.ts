import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { checkAuth, createUser, loginUser, signOut } from "./authApi";

interface AuthState {
    loggedInUserToken: string | null;
    status: string;
    error: string | null;
    userChecked: boolean;
  }

  
const initialState:AuthState = {
  loggedInUserToken: null,
  status: "idle",
  error: null,
  userChecked: false
}


export const createUserAsync = createAsyncThunk(
  "auth/createUser",
  async (userInfo:object, thunkAPI) => {
    const response:any = await createUser(userInfo);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const loginUserAsync = createAsyncThunk(
    "user/loginUser",
    async (loginInfo:object, { rejectWithValue }) => {
      try {
        // console.log(loginInfo)
        const response:any = await loginUser(loginInfo);
        return response.data;
      } catch (error) {
        // console.log(error);
        // rejectWithValue is a utility function that we can return (or throw ) in 
        // your action creator to return a rejected response with a defined payload and meta. 
        return rejectWithValue(error);
      }
    }
  );
  export const checkAuthAsync = createAsyncThunk(
    'user/checkAuth',
    async () => {
      try {
        const response:any = await checkAuth();
        return response.data;
      } catch (error) {
        // console.log(error);
      }
    }
  );
  export const signOutAsync = createAsyncThunk(
    'user/signOut',
    async () => {
      try {
        const response:any = await signOut();
        return response.data;
      } catch (error) {
        // console.log(error);
      }
    }
  );

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loggedInUserToken = action.payload;
        state.status = "idle";
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload as string | null;;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loggedInUserToken = action.payload;
        state.status = "idle";
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload as string | null;;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state, action) => {
        state.loggedInUserToken = null;
        state.status = "idle";
      })
      
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.userChecked = false;
      });
      
      
  },
});

export const selectLoggedInUser=(state:any)=>state.auth.loggedInUserToken;
export const selectError = (state:any) => state.auth.error;
export const selectStatus = (state:any) => state.auth.status;
export const selectUserChecked = (state:any) => state.auth.userChecked;
export default authSlice.reducer;