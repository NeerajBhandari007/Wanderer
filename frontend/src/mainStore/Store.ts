import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/auth/authSlice"
import userReducer from "../components/user/userSlice";
import feedReducer from "../components/feed/feedSlice"
import searchReducer from "../components/search/searchSlice"


export const store = configureStore({
  reducer: {
    auth:authReducer,
    user:userReducer,
    feed:feedReducer,
    search:searchReducer
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch