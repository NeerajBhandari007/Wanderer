import React, { useEffect } from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import SignUp from './components/auth/page/SignUp';
import SignIn from './components/auth/page/SignIn';
import Feed from './components/feed/page/Feed';
import Protected from './components/auth/page/Protected';
import Comment from "./components/feed/page/Comment"
import { useAppSelector ,useAppDispatch} from './mainStore/common'
import { checkAuthAsync, handleError, selectLoggedInUser, selectUserChecked } from './components/auth/authSlice';
import { fetchLikedPostAsync, fetchLoggedInUserAsync, fetchRandomnUserAsync, fetchUserFreindsAsync } from './components/user/userSlice';
import { fetchAllPostAsync } from './components/feed/feedSlice';
import UserProfile from './components/user/page/UserProfile';
import Chat from './components/chat/page/Chat';
import Search from './components/search/page/Search';
const router = createBrowserRouter([
  {
    path:"/",
    element:(
      <Protected>
        <Feed/>
      </Protected>
      // <Comment/>
    )
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/signIn",
    element: <SignIn />,
  },{
    path:"/myProfile/:id",
    element:(
      <Protected>
        <UserProfile/>
      </Protected>)
  },{
    path:"/chat/",
    element:(
    <Protected>
      <Chat/>
    </Protected>)
  }
  ,{
    path:"/search/",
    element:(
      <Protected>
        <Search/>
      </Protected>)
  }

]);
function App() {
  const user=useAppSelector(selectLoggedInUser)
  const userChecked = useAppSelector(selectUserChecked);
  const dispatch=useAppDispatch();
  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      dispatch(fetchRandomnUserAsync());
      dispatch(fetchAllPostAsync());
      dispatch(fetchLikedPostAsync());
      dispatch(fetchUserFreindsAsync());
      dispatch(fetchLoggedInUserAsync());
      dispatch(handleError())
    }
  }, [dispatch,user]);
  return (
    <div className="App">
      {userChecked && 
        <RouterProvider router={router} />
      }
    </div>
  );
}

export default App;
