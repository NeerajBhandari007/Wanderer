import React, { useState } from 'react'
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { clearSearchItem, searchPostAsync, searchUserAsync, selectSearchPost, selectSearchUser } from '../searchSlice'
import Posts from '../../feed/page/Posts'
import Navbar from '../../navbar/Navbar'

export default function Search() {
  const [user, setUser] = useState(true) 
  const [post, setPost] = useState(false) 
  const userSearched=useAppSelector(selectSearchUser)
  const postSearched=useAppSelector(selectSearchPost)
  // console.log(postSearched)
  const dispatch=useAppDispatch()
  function callSearch(){
    const x=document.getElementById("search") as HTMLTextAreaElement;
    const data=x.value.trim()
    if(data===""){
      dispatch(clearSearchItem())
    }else{
      dispatch(searchUserAsync({content:data}))
      dispatch(searchPostAsync({content:data}))
    }
  }
  function debounce(func:any,tim:number){
    var timer:any;
    return(()=>{
      clearTimeout(timer)
      timer=setTimeout(()=>{
        func();
      },tim)
    }  
    )
  }
  const betterCallSearch=debounce(callSearch,400);
  function handleUser(){
    const element1 = document.getElementById('user');
    const element2 = document.getElementById('post');
      if (element1 && element2) {
        element2.classList.remove('border-4');
        element1.classList.add('border-4');
      }
      setUser(true)
      setPost(false)
  }
  function handlePost(){
    const element1 = document.getElementById('user');
    const element2 = document.getElementById('post');
      if (element1 && element2) {
        element1.classList.remove('border-4');
        element2.classList.add('border-4');
      }
      setUser(false)
      setPost(true)
  }
  return (
    <>
      <Navbar/>
      <div className='pt-20 bg-gradient-to-t from-gray-50 to-teal-200 h-screen w-full flex flex-col items-center'>
        <div className='flex w-5/6 md:w-1/2 pt-4'>
            <textarea id="search" className='rounded-2xl w-full text-sm p-2 px-3 mr-2 bg-teal-50 h-[38px]' placeholder='#Explore' cols={60} onKeyUp={betterCallSearch} ></textarea>
        </div>
        <div className='flex flex-col w-5/6 md:w-3/4 pt-8 h-full overflow-y-hidden'>
            <div className='flex w-full'>
                <h1 id="user" className='w-1/2 font-bold text-gray-900 text-lg border-b-4 border-4 pb-2 border-teal-950 cursor-pointer' onClick={handleUser}>Users</h1>
                <h1 id="post" className='w-1/2 font-bold text-gray-900 text-lg border-b-4 pb-2 border-teal-950 cursor-pointer' onClick={handlePost}>Posts</h1>
            </div>
            {user && <div className='flex flex-col h-5/6  overflow-y-scroll'>
                {userSearched.length>0 && 
                userSearched.map((elem:any)=>{
                    return(<div className='flex items-center border-b-2 p-2 border-teal-950'>
                    <div className='h-[38px] w-[38px] bg-teal-950 border-2 border-teal-950 rounded-full mr-4'>
                        {elem.userImage!=null &&<img src={elem.userImage} className='object-cover rounded-full h-full w-full' alt='profile'/>}
                    </div>
                    <p className='text-base text-gray-800 font-semibold'>{elem.username}</p>
                </div>)
                })
                }
                {userSearched.length===0 && <div className='w-full flex justify-center items-center h-5/6 text-gray-800 font-bold text-4xl'>No Such User Exists</div>}
            </div>}
            {post && <div className='flex flex-col h-5/6  overflow-y-scroll'>
                {postSearched.length>0 && 
                <Posts posts={postSearched}/>
                }
                {postSearched.length===0 && <div className='w-full flex justify-center items-center h-5/6 text-gray-800 font-bold text-4xl'>No Such Post Exists</div>}
            </div>}
        </div>
    </div>
    </>
    
  )
}
