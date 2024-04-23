import React, { useEffect, useState } from 'react'

import { FaImage } from "react-icons/fa6";
import { PiVideoFill } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { fetchFollowUserIdAsync, removeUser, selectLikedPost, selectRandomStatus, selectRandomUser, selectUserFriends, selectUserInfo, selectUserStatus } from '../../user/userSlice';
import {  createPostAsync, selectAllPost,  selectpostSuccess } from '../feedSlice';

import { Link } from 'react-router-dom';
import Posts from './Posts';
import Navbar from '../../navbar/Navbar';
import LoaderOverlay from '../../loader/Loader';

export default function Feed() {
  const user=useAppSelector(selectUserInfo);
  const posts=useAppSelector(selectAllPost);
  const postSuccess=useAppSelector(selectpostSuccess);
  const randomUser=useAppSelector(selectRandomUser);
  const userStatus=useAppSelector(selectUserStatus)
  const randomStatus=useAppSelector(selectRandomStatus)
  const friends=useAppSelector(selectUserFriends);
  // console.log(friends)
  var friendsPosts=[]
  var suggestedPosts=[]
  if(user && posts.length>0 && friends.length>0){
    var OthersPosts = posts.filter((post:any) => post.authorId !== user.id);
    friendsPosts = OthersPosts.filter((post:any) => friends.some((friend:any) => friend.id === post.authorId));
    suggestedPosts = OthersPosts.filter((post:any) => !friends.some((friend:any) => friend.id === post.authorId));
    // console.log("friendsPosts:",friendsPosts)
    // console.log("suggestedPosts:",suggestedPosts)
  }else if(user && posts && friends.length===0){
    OthersPosts = posts.filter((post:any) => post.authorId !== user.id);
    suggestedPosts = OthersPosts
  }
  
  
  
  const LikedPost=useAppSelector(selectLikedPost);
  // console.log(LikedPost)
  // console.log(user)
  // console.log(posts)
  const dispatch=useAppDispatch();
  function follow(id:any){
    dispatch(removeUser(id));
    dispatch(fetchFollowUserIdAsync(id))
  }

  const [actualImage, setActualImage] = useState<string | null>(null);
  const [actualVideo, setActualVideo] = useState<string | null>(null);

  const handleImageChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // console.log(files)
    
    if(files && files.length > 0){
    const image=files[0];
    // console.log(image)
    const data=new FormData()
    data.append("file",image)
    data.append("upload_preset","extlfxcg")
    data.append("cloud_name","dvsncjncq")
    // console.log(data)
    fetch("https://api.cloudinary.com/v1_1/dvsncjncq/image/upload",{
      method: "post",
      body:data
    }).then((res)=>res.json()).then((data)=>{
      setActualImage(data.url)
      // console.log(data.url)
    }).catch((err)=>console.log(err))
    
  };
  }
  const handleVideoChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // console.log(files)
    
    if(files && files.length > 0){
    const video=files[0];
    // console.log(video)
    const data=new FormData()
    data.append("file",video)
    data.append("upload_preset","ew7s2xr9")
    data.append("cloud_name","dvsncjncq")
    // console.log(data)
    fetch("https://api.cloudinary.com/v1_1/dvsncjncq/video/upload",{
      method: "post",
      body:data
    }).then((res)=>res.json()).then((data)=>{
      setActualVideo(data.url)
      // console.log(data.url)
    }).catch((err)=>console.log(err))
    
  };
  };
  
  function postdata(){
    const textareaElement = document.getElementById("content") as HTMLTextAreaElement;
    const tag1 = document.getElementById("tags1") as HTMLTextAreaElement;
    const tag2 = document.getElementById("tags2") as HTMLTextAreaElement;
    const data = textareaElement.value.trim();
    const t1 = tag1.value;
    const t2 = tag2.value;
    if(data===""&&actualImage===null&&actualVideo===null){
      alert("Please Give Something To Post")
    }else{
      if(t1!=="TrailTag-1"&&t2!=="TrailTag-2"){
        var obj={
          content:data,
          imageUrl:actualImage,
          videoUrl:actualVideo,
          tags:[t1,t2]
        }
        // console.log(obj)
        dispatch(createPostAsync(obj))  
      }else{
        alert("Please Select the Trail Tags")
      }
    }
    
  }
  
  // function handlePostClose(id:any){
  //   console.log(id)
  //   dispatch(handleClose(id));
  // }
  // function handleLike(id:any){
  //   console.log(id)
  //   dispatch(handleLikeClose(id));
  // }
  // function createComment(id:number){
  //   const textareaElement = document.getElementById(`PostComment${id}`) as HTMLTextAreaElement;
  //   const data = textareaElement.value.trim();
  //   if(data===""){
  //     alert("please write something to comment")
  //   }else{
  //     var comm={
  //       obj:{content:data},
  //       postId:id
  //     }
  //     console.log(comm)
  //     dispatch(createCommentAsync(comm));
  //     textareaElement.value = "";
  //   }
  // }

  useEffect(() => {
    if(postSuccess==="true"){
      const textAreaElement = document.getElementById("content") as HTMLTextAreaElement;
      textAreaElement.value = "";
      setActualVideo(null)
      setActualImage(null)
      const selectElement1 = document.getElementById("tags1") as HTMLSelectElement;
      const selectElement2 = document.getElementById("tags2") as HTMLSelectElement;
      selectElement1.value = "TrailTag-1";
      selectElement2.value = "TrailTag-2";
    }
    
  }, [postSuccess])
  // useEffect(() => {
  //   dispatch(fetchLoggedInUserAsync());
  // }, [])
  
  
  
  return (
    <>
    
    <div className='bg-gradient-to-t from-gray-50 to-teal-200 min-h-screen'>
      {/* navbar */}
      <Navbar/>
      {!user && posts.length===0 && <LoaderOverlay></LoaderOverlay>}
      <section className='w-full z-10 pt-16 md:pt-20 flex justify-center'>
        {/* left part */}{userStatus==="loaded"&&
        <div className='hidden md:block w-1/4 fixed left-0  min:h-screen p-4'>
            <div className='w-full bg-teal-100 relative h-80 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex-col items-end'>
                 <div className='w-full h-1/3 bg-teal-600  rounded-t-xl'>
                 {user.coverImage!==null && <img src={user.coverImage} className='object-cover w-full h-full rounded-t-xl' alt='profile'/>}
                 </div>
                 <div style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)' }} className='w-[90px] h-[90px] rounded-full top-1/3 bg-gradient-to-t from-gray-100 to-teal-400 mr-4 border-4 border-teal-950'>
                   {user.userImage!==null && <img src={user.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
                 </div>
                 <div className='font-semibold mt-12'>{user.username}</div>
                 <div className='flex w-full justify-evenly items-center mt-4'>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm text-slate-500'>Posts</p>
                        <p className='font-bold text-lg'>{user.posts.length}</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm text-slate-500'>Followers</p>
                        <p className='font-bold text-lg'>{user.followers.length}</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-semibold text-sm text-slate-500'>Following</p>
                        <p className='font-bold text-lg'>{user.followedTo.length}</p>
                    </div>
                    
                 </div>
                 <div className='flex w-full justify-center'>
                   <Link to={`/myProfile/${user.id}`}  className='mt-4 mx-4 font-semibold text-base w-3/4 flex justify-center text-slate-600 bg-teal-50 rounded-xl py-2'>My Profile</Link>
                 </div>
                </div>
            <div className='flex flex-col items-start mt-4'>
                <div className='text-lg text-slate-700 font-semibold'>Interests</div>
            </div>
            <div className='flex flex-wrap mt-4'>
              {user.interests.map((elem:string)=>{
                return(<p className='bg-teal-200 px-3 py-1 rounded-2xl text-slate-600 text-sm mr-4 font-medium mb-4'>{elem}</p>
              )
              })}
                </div>
            
        </div>}
        {/* center part */}
        <div className=' w-full md:w-1/2 min:h-screen p-2 flex flex-col'>
          {/* stories */}
            {/* <div className="w-full h-20 mb-5 flex items-center p-2">
              <div className='flex items-center overflow-x-scroll'>
                <div className='relative mr-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-xl'>
                  <div className='w-[60px] h-[70px] rounded-xl bg-white flex justify-center items-center'>
                    <div className='w-[37px] h-[37px]  bg-slate-700 rounded-full'>
                      {user && user.userImage!==null && <img src={user.userImage} className='object-cover h-full w-full' alt='profile'/>}
                    </div>
                  </div>
                  <div  style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)' }} className='rounded-full w-[21px] h-[21px] bg-teal-800 top-[50px] flex justify-center items-center'>
                    <GoPlus className=' text-slate-400 text-xl '/>
                  </div>
                </div>
                <div className='relative rounded-xl mr-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                  <div className='w-[60px] h-[70px] rounded-xl bg-teal-800 flex justify-center items-center'>
                  </div>
                  <div className='absolute rounded-full w-[22px] h-[22px] bg-slate-200 top-1 left-1 flex justify-center items-center'>
                  </div>
                </div>
                
              </div>
            </div> */}
            {/* new post */}
            <div className=" bg-teal-200 h-fit shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl w-full py-4 mb-5 p-2">
              <div className='flex w-full items-center justify-evenly mb-2'>
                <div className='w-[38px] h-[45px] rounded-md bg-teal-900 border-2 border-teal-950 '>
                  {user && user.userImage!==null && <img src={user.userImage} className='object-cover h-full w-full' alt='profile'/>}
                </div>
                <textarea id='content' placeholder='What is on your mind?' className='rounded-2xl bg-teal-100 w-4/5 p-2 px-4 text-sm'  cols={60} rows={1}></textarea>
              </div>
              <div className='mb-4 flex items-center justify-center'>
                <select name="trailTag1" id="tags1" className='mr-2 bg-teal-100 rounded-2xl px-1 text-sm text-gray-700 outline-none cursor-pointer'>
                  <option value="TrailTag-1">TrailTag-1</option>
                  <option value="#Wanderlust">#Wanderlust</option>
                  <option value="#ExploreNature">#ExploreNature</option>
                  <option value="#AdventureAwaits">#AdventureAwaits</option>
                  <option value="#TravelDiaries">#TravelDiaries</option>
                  <option value="#NatureLover">#NatureLover</option>
                  <option value="#ScenicViews">#ScenicViews</option>
                  <option value="#ExploreTheWorld">#ExploreTheWorld</option>
                  <option value="#OutdoorAdventure">#OutdoorAdventure</option>
                  <option value="#IntoTheWild">#IntoTheWild</option>
                  <option value="#DiscoverEarth">#DiscoverEarth</option>
                </select>
                <select name="trailTag2" id="tags2" className='mr-2 bg-teal-100 rounded-2xl px-1 text-sm text-gray-700 outline-none cursor-pointer'>
                  <option value="TrailTag-2">TrailTag-2</option>
                  <option value="#WildernessExploration">#WildernessExploration</option>
                  <option value="#NaturePhotography">#NaturePhotography</option>
                  <option value="#TravelInspiration">#TravelInspiration</option>
                  <option value="#EcoTravel">#EcoTravel</option>
                  <option value="#GreenDestinations">#GreenDestinations</option>
                  <option value="#SustainableTravel">#SustainableTravel</option>
                  <option value="#BeautifulLandscapes">#BeautifulLandscapes</option>
                  <option value="#NatureWalks">#NatureWalks</option>
                  <option value="#ExploreOutdoors">#ExploreOutdoors</option>
                  <option value="#EarthBeauty">#EarthBeauty</option>
                </select>
              </div>
              {(actualImage!==null || actualVideo!==null) &&
               <div className='w-full h-48 flex justify-center bg-teal-100 rounded-2xl mb-4 p-2'>
                {actualImage!==null && <div className='w-1/2 h-full'>
                <img src={actualImage==null?undefined:actualImage} alt="Selected" className=' w-full h-full object-fill pr-2' />
                </div>}
                {actualVideo!==null && <div className='w-1/2 h-full'>
                <video src={actualVideo==null?undefined:actualVideo} controls className='w-full h-full object-fill' />
                </div>}
              </div>
              }
            
              <div className='flex justify-evenly items-center'>
                <div className='px-6 py-1 relative rounded-xl bg-teal-100 w-fit flex justify-center items-center'>
                  <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image"
                  className='w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer'/>
                  <FaImage className='text-xl mr-2'/>
                  <p className='text-sm font-semibold text-gray-800'>Photo</p>
                </div>
                <div className='px-6 py-1 relative rounded-xl bg-teal-100 w-fit flex justify-center items-center'>
                  <input
                    type="file"
                    accept="video/*" 
                    onChange={handleVideoChange}
                    id="video"
                    className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                  />
                  <PiVideoFill className='text-xl mr-2'/>
                  <p className='text-sm font-semibold text-gray-800'>Video</p>
                </div>
                <div className='px-6 py-1 rounded-xl bg-teal-100 w-fit flex cursor-pointer justify-center items-center' onClick={postdata}>
                  <IoSend className='text-xl mr-2'/>
                  <p className='text-sm font-semibold text-gray-800'>Post</p>
                </div>
              </div>
            </div>
            {/* posts */}
            {posts.length!==0 && <Posts posts={friendsPosts}/>}
            {posts.length!==0 && <Posts posts={suggestedPosts} suggest={1}/>}
            
        </div>
        {/* right part */}
        <div className='w-1/4 hidden md:block fixed right-0 h-[90vh] p-4 overflow-y-scroll'>
            {randomStatus==="loaded" && 
            <div className='bg-teal-100 px-2 py-4 rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
              <div className='font-bold text-base text-slate-800  text-start'>Pepole You May Know</div>
              <div className='flex flex-col h-full overflow-y-scroll'>
                {randomUser.map((elem:any)=>{
                  return(<div className='flex justify-between items-center mt-5 py-2 bg-teal-50 px-3 rounded-xl '>
                  <div className='flex items-center'>
                    <div className='w-[35px] h-[35px] rounded-full bg-black mr-4'>
                    {elem.userImage!==null && <img src={elem.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
                    </div>
                    <Link to={`/myProfile/${elem.id}`} className='font-bold text-sm text-left'>{elem.username}</Link>
                  </div>
                  <div className='font-bold text-sm text-teal-900 hover:bg-teal-900 hover:text-teal-50 border-2 rounded-2xl border-teal-900 px-2 py-1 cursor-pointer' onClick={()=>{follow(elem.id)}}>Follow</div>
              </div>)
                })}
              </div>
            </div>}
            
        </div>
      </section>
    </div>
    </>
  )
}

