import React, { useEffect, useState } from 'react'
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { fetchFollowUserIdAsync, fetchLoggedInUserAsync, fetchUserInfoByIdAsync, noFollowUserIdAsync, nounFollowUserIdAsync, selectProfileInfo, selectUserInfo, unFollowUserIdAsync, updateUserAsync } from '../userSlice'
import { Link, useParams } from 'react-router-dom';
import Posts from '../../feed/page/Posts';
import { IoSettings } from "react-icons/io5";
import { RxCross2 } from 'react-icons/rx';
import { FaImage } from 'react-icons/fa';
import { IoMdHome } from "react-icons/io";
import { signOutAsync } from '../../auth/authSlice';
import LoaderOverlay from '../../loader/Loader';
export default function UserProfile() {
    const [show, setShow] = useState(true)
    const [opt, setOpt] = useState(false)
    var curr=false;
    const [update, setUpdate] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [name, setName] = useState<string | any>(null);
    const [interest, setInterest] = useState<string | any>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [follow, setFollow] = useState(false);
    const [folloi, setFolloi] = useState(false);
    const Info=useAppSelector(selectProfileInfo)
    const currUser=useAppSelector(selectUserInfo);
    const dispatch=useAppDispatch();
    
    const { id } = useParams();
    // console.log(Info)
    // console.log(currUser)
    // console.log(id)
    function hasFollowerWithId(followers:any, targetId:any) {
      return followers.some((follower:any) => follower.followedId === targetId);
    }

    function showFollow(){
      const element1 = document.getElementById('follow');
      const element2 = document.getElementById('folloi');
      if (element1 && element2) {
        element2.classList.remove('bg-teal-950', 'border-t-4', 'text-gray-100');
        element1.classList.add('bg-teal-950', 'border-t-4', 'text-gray-100');
      }
      dispatch(fetchFollowUserIdAsync)
      setShow(true);
    }
    function openUpdate(){
      setUpdate(!update)
      setOpt(false)
      if(Info){
        setCoverImage(Info.coverImage)
        setProfileImage(Info.userImage)
        setName(Info.username)
        setInterest(Info.interests.join(', '))
      }
    }
    function showFolli(){
      const element1 = document.getElementById('follow');
      const element2 = document.getElementById('folloi');
      if (element1 && element2) {
        element1.classList.remove('bg-teal-950', 'border-t-4', 'text-gray-100');
        element2.classList.add('bg-teal-950', 'border-t-4', 'text-gray-100');
      }
      setShow(false);
    }
    function equal(n1:any,n2:any){
      var parsedId;
      if (n2 !== undefined) {
        parsedId = parseInt(n2, 10);
      }
      // console.log("n1:",typeof n1,"n2:",typeof parsedId)
      // console.log(n1===parsedId)
      return n1===parsedId;
    }
    const handleProfileImage = async(event: React.ChangeEvent<HTMLInputElement>) => {
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
        setProfileImage(data.url)
        // console.log(data.url)
      }).catch((err)=>console.log(err))
      
    };
    }
    const handleCoverChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
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
        setCoverImage(data.url)
        // console.log(data.url)
      }).catch((err)=>console.log(err))
      
    };
    
    }
    function handleSubmit(){
      interface dataFormat{
        username:String,
        interests:String,
        userImage:any,
        coverImage:any
      }
      const data:dataFormat={
        username:name,
        interests: interest.split(','),
        userImage:null,
        coverImage:null
      }
      if(profileImage!=null){
        data.userImage=profileImage
      }
      if(coverImage!=null){
        data.coverImage=coverImage
      }
      // console.log(data);
      dispatch(updateUserAsync(data))
      setUpdate(false)
    }
    function handleLogout(){
      // console.log("logout")
      dispatch(signOutAsync())
    }
    function checkIfUserIsFollowed(followedTo:any, n2:any) {
      // console.log(followedTo)
      // console.log(n2)
      var parsedId;
      if (n2 !== undefined) {
        parsedId = parseInt(n2, 10);
      }
      for (const follow of followedTo) {
        if (follow.followedId === parsedId) {
          return true;
        }
      }
      return false;
    }
    if(currUser && equal(currUser.id,id)){
      curr=true;
    }
    useEffect(() => {
      dispatch(fetchUserInfoByIdAsync(id))
      dispatch(fetchLoggedInUserAsync())
      
      
    }, [id])
    
    
  return (
    
    <div className='bg-gradient-to-l border-4 border-teal-950 relative from-gray-50 to-teal-200 w-full min-h-screen flex justify-start'>
      {Info===null && <LoaderOverlay></LoaderOverlay>}
      <div className='h-full min-h-screen overflow-y-scroll w-full md:w-3/4 '>
        {Info!=null &&
          <div className='h-full'>
        <div className='w-full h-2/5 md:h-1/2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] relative bg-teal-200'>
            <div className='w-full h-[120px] md:h-[150px] bg-center bg-cover bg-coveer'>
              <Link to="/">
              <IoMdHome className='text-gray-200 font-extrabold text-3xl absolute cursor-pointer left-2 top-2'/>
              </Link>
            {Info.coverImage!==null && <img src={Info.coverImage} className='object-cover w-full h-full' alt='profile'/>}
              <IoSettings className='text-gray-200 font-extrabold text-2xl absolute cursor-pointer right-2 top-2'onClick={()=>{setOpt(!opt)}}/>
              {opt&&<div className='w-fit h-fit text-teal-950 text-xs absolute top-3 right-9 bg-gray-200 font-bold cursor-pointer'>
                <p className='border-b border-teal-950 p-2 cursor-pointer' onClick={openUpdate}>Update Profile</p>
                <p className='p-2 block' onClick={handleLogout}>LogOut</p>
              </div>}
            </div>
           {update && <div className='fixed top-0 left-0 w-full h-full z-50'>
              <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
                  <div className='text-4xl absolute right-5 top-5 cursor-pointer' onClick={()=>{setUpdate(!update)}} >
                      <RxCross2/>
                  </div>
                  
                  <div className='bg-gradient-to-bl flex flex-col from-gray-400 to-teal-300 w-3/4  md:w-1/2 py-2 relative'>
                    <div className='text-base font-bold h-[28px] px-6 pb-2 border-teal-900 border-b-2'>
                      Update Profile
                    </div>
                    <div className='p-6'>
                      <div className='flex flex-col md:flex-row items-center w-full mb-4'>
                        <div className='flex items-center  md:w-2/5'>
                          <div className='bg-teal-50 w-[80px] h-[80px] rounded-full flex justify-center items-center mr-6 border-2 border-teal-950'>
                          {profileImage===null?<p className='font-semibold text-gray-700 text-sm'>Profile Image</p>:<img src={profileImage} className='object-cover rounded-full w-full h-full' alt='profile'/>}
                          </div>
                          <div className='px-5 py-2 border-2 border-teal-950 h-fit  relative bg-teal-50 w-fit flex justify-center items-center cursor-pointer'>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImage}
                            id="image"
                            className='w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer'/>
                            <FaImage className='text-xl mr-2'/>
                            <p className='text-sm font-semibold text-gray-800'>Photo</p>
                          </div>
                        </div>
                        <div className='flex items-center pt-2 md:pt-0 md:pl-4 md:w-4/5'>
                          <div className='bg-teal-50 w-1/2 h-[50px] md:h-[80px]  flex justify-center items-center mr-6 border-2 border-teal-950'>
                          {coverImage===null?<p className='font-semibold text-gray-700 text-sm'>Cover Image</p>:<img src={coverImage} className='object-cover w-full h-full' alt='profile'/>}
                          </div>
                          <div className='px-5 py-2 border-2 border-teal-950 h-fit  relative bg-teal-50 w-fit flex justify-center items-center cursor-pointer'>
                            <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            id="image"
                            className='w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer'/>
                            <FaImage className='text-xl mr-2'/>
                            <p className='text-sm font-semibold text-gray-800'>Photo</p>
                          </div>
                        </div>

                      </div>
                      <div className='flex flex-col justify-start items-start h-fit'>
                        <label className='font-semibold text-base text-gray-950' htmlFor="name">Full Name:</label>
                        <input className='w-full outline-none py-1 px-4 border-b-2 mb-4 border-teal-900 bg-transparent' type="text" id="name" name="name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                        <label className='font-semibold text-base text-gray-950' htmlFor="interests">Interests:</label>
                        <input className='w-full outline-none py-1 px-4 border-b-2 mb-4 border-teal-900 bg-transparent' type="text" id="interests" name="interests" value={interest} onChange={(e)=>{setInterest(e.target.value)}}/>
                        <input className='border-2 border-teal-950 w-[180px] px-6 py-2 hover:bg-transparent text-center cursor-pointer rounded-2xl hover:text-teal-950 font-semibold text-base bg-teal-950 text-teal-100' onClick={handleSubmit} value="Submit"></input>  
                      </div>  
                    </div>
                    
                  </div>
              </div>
            </div> }
            <div className='bg-teal-950 w-[120px] h-[120px] md:w-[140px] md:h-[140px] rounded-full absolute top-16 md:top-20 left-10 border-4 border-teal-200'>
            {Info.userImage!==null && <img src={Info.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
            </div>
            <div className='flex justify-start items-end md:items-center'>
              <p className='text-left pr-4 pt-[55px] pl-[50px] md:pt-0 md:px-[200px] font-extrabold text-2xl text-gray-950'>{Info.username}</p>
              {!equal(currUser.id,id) && 
              <div>
               {(!checkIfUserIsFollowed(currUser.followedTo,id)?<div className='bg-teal-950 rounded-2xl text-sm py-[2px] flex h-fit items-center text-gray-100 px-4 mr-1 hover:bg-gray-100 hover:text-teal-950 border-2 border-teal-950 font-bold cursor-pointer' onClick={()=>dispatch(noFollowUserIdAsync(id))}>Follow</div>
              :<div className='hover:bg-teal-950 rounded-2xl text-sm py-[2px] flex h-fit items-center hover:text-gray-100 px-4 mr-1 bg-gray-100 text-teal-950 border-2 border-teal-950 font-bold cursor-pointer'  onClick={()=>dispatch(nounFollowUserIdAsync(id))}>UnFollow</div>
              )}
              </div>}
            </div>
            {follow && <div className='fixed md:hidden top-0 left-0 w-full h-full z-50'>
              <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
                  <div className='text-4xl absolute right-5 top-5 cursor-pointer' onClick={()=>{setFollow(false)}}>
                      <RxCross2/>
                  </div>
                  
                  <div className='bg-gradient-to-bl flex flex-col from-gray-400 to-teal-300 h-3/4 w-3/4 md:w-1/4 py-2 relative'>
                    <div className='text-base font-bold h-[28px] px-6 pb-2 border-teal-900 border-b-2'>
                    Followers
                    </div>
                    {(Info!=null) && Info.followers.map((elem:any)=>{
                      return (<div className='flex justify-between items-center h-[60px] border-b-2 border-teal-950'>
                      <div className='flex items-center justify-start'>
                        <div className='bg-teal-200 border-2 border-teal-950 w-[37px] h-[37px] rounded-full ml-3 mr-2'>
                        {elem.user.userImage!==null && <img src={elem.user.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
                        </div>
                        <Link to={`/myProfile/${elem.user.id}`} className='font-semibold text-gray-900 text-base' onClick={()=>{setFollow(false)}}>{elem.user.username}</Link>
                      </div>
                      
                      {currUser && equal(currUser.id,id) && (!hasFollowerWithId(Info.followedTo,elem.user.id)?<div className='bg-teal-950 rounded-2xl text-sm py-1 flex h-fit items-center text-gray-100 px-4 mr-1 hover:bg-gray-100 hover:text-teal-950 border-2 border-teal-950 font-bold cursor-pointer' onClick={()=>dispatch(fetchFollowUserIdAsync(elem.user.id))}>Follow</div>
                      :<div className='hover:bg-teal-950 rounded-2xl text-sm py-1 flex h-fit items-center hover:text-gray-100 px-4 mr-1 bg-gray-100 text-teal-950 border-2 border-teal-950 font-bold cursor-pointer'  onClick={()=>dispatch(unFollowUserIdAsync(elem.user.id))}>UnFollow</div>
                      )}
                    </div>)
                    })}
                  </div>
              </div>
            </div> }
          {folloi && <div className='fixed md:hidden top-0 left-0 w-full h-full z-50'>
            <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
                <div className='text-4xl absolute right-5 top-5 cursor-pointer' onClick={()=>{setFolloi(false)}}>
                    <RxCross2/>
                </div>
                
                <div className='bg-gradient-to-bl flex flex-col from-gray-400 to-teal-300 h-3/4 w-3/4 md:w-1/4 py-2 relative'>
                  <div className='text-base font-bold h-[28px] px-6 pb-2 border-teal-900 border-b-2'>
                  Following
                  </div>
                    {( Info!=null) && Info.followedTo.map((elem:any)=>{
                    return (<div className='flex justify-between items-center h-[60px] border-b-2 border-teal-950'>
                    <div className='flex items-center justify-start'>
                      <div className='bg-teal-200 border-2 border-teal-950 w-[37px] h-[37px] rounded-full ml-3 mr-2'>
                      {elem.follower.userImage!==null && <img src={elem.follower.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
                      </div>
                      <Link to={`/myProfile/${elem.follower.id}`} className='font-semibold text-gray-900 text-base text-left' onClick={()=>{setFolloi(false)}}>{elem.follower.username}</Link>
                    </div>
                    
                    {currUser && equal(currUser.id,id) && <div className='hover:bg-teal-950 rounded-2xl text-sm py-1 flex h-fit items-center hover:text-gray-100 px-4 mr-1 bg-gray-100 text-teal-950 border-2 border-teal-950 font-bold cursor-pointer'  onClick={()=>dispatch(unFollowUserIdAsync(elem.follower.id))}>UnFollow</div>}
                  </div>)
                  })}
                </div>
            </div>
          </div> }
            <div className='flex w-fit md:w-1/4 ml-[50px] md:mx-[210px] pt-2 justify-between items-center '>
                <div className=' flex flex-col justify-center items-center mr-4'>
                   <p className='font-bold text-base text-gray-950'>Post</p>
                   <p className='font-semibold text-sm text-gray-950'>{Info.posts.length}</p>
                </div>
                <div className=' flex flex-col justify-center items-center mr-4'>
                   <p className='font-bold text-base text-gray-950'>Followers</p>
                   <p className='font-semibold text-sm text-gray-950 hidden md:block'>{Info.followers.length}</p>
                   <p className='font-semibold text-sm text-gray-950 cursor-pointer md:hidden' onClick={()=>{setFollow(true)}}>{Info.followers.length}</p>
                </div>
                <div className=' flex flex-col justify-center items-center mr-4'>
                   <p className='font-bold text-base text-gray-950'>Following</p>
                   <p className='font-semibold text-sm text-gray-950 hidden md:block'>{Info.followedTo.length}</p>
                   <p className='font-semibold text-sm text-gray-950 cursor-pointer md:hidden' onClick={()=>{setFolloi(true)}}>{Info.followedTo.length}</p>
                </div>
            </div>
            <div className='flex md:w-1/4 ml-[50px] md:mx-[210px] pt-2 justify-start flex-wrap items-center pb-6'>
                {Info.interests.map((elem :any)=>{
                  return(<span className=' px-2 rounded-2xl border-2 py-[2px] font-bold text-xs border-teal-950 mr-2 mb-2'>{elem}</span>)
                })
                }
            </div>
        </div>
        <div className="h-3/5 md:h-1/2">
            <div className='font-bold text-xl mb-8 flex justify-center items-center text-gray-950 w-full h-[70px] border-b-4 border-b-teal-950'>
                MyPosts
            </div>
            {Info.posts.length>0 ? (<div className='px-2 lg:px-56'>
              <Posts user={1} userPosts={Info.posts} curr={curr} id={Info.id} />
            </div>):<div className='flex justify-center items-center h-full text-2xl text-gray-700 font-bold'>No Posts</div>}
            
        </div>
        </div>}
      </div>
      <div className='w-1/4 hidden md:block h-screen border-l-4 mr-[4px] border-b-4 fixed right-0 top-0 border-teal-950'>
        <div className='h-[55px] w-full border-b-4 border-teal-950 flex text-base font-bold cursor-pointer'>
          <h3 id='follow' className='w-1/2 border-r-4 bg-teal-950 border-t-4 text-gray-100 border-teal-950 flex items-center justify-center' onClick={showFollow}>Followers</h3>
          <h3 id='folloi' className='w-1/2 flex items-center justify-center border-teal-950' onClick={showFolli}>Following</h3>
        </div>
        {(show&&Info!=null) && Info.followers.map((elem:any)=>{
          return (<div className='flex justify-between items-center h-[60px] border-b-2 border-teal-950'>
          <div className='flex items-center justify-start'>
            <div className='bg-teal-200 border-2 border-teal-950 w-[37px] h-[37px] rounded-full ml-3 mr-2'>
            {elem.user.userImage!==null && <img src={elem.user.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
            </div>
            <Link to={`/myProfile/${elem.user.id}`} className='font-semibold text-gray-900 text-base text-left'>{elem.user.username}</Link>
          </div>
          
          {currUser && equal(currUser.id,id) && (!hasFollowerWithId(Info.followedTo,elem.user.id)?<div className='bg-teal-950 rounded-2xl text-sm py-1 flex h-fit items-center text-gray-100 px-4 mr-1 hover:bg-gray-100 hover:text-teal-950 border-2 border-teal-950 font-bold cursor-pointer' onClick={()=>dispatch(fetchFollowUserIdAsync(elem.user.id))}>Follow</div>
          :<div className='hover:bg-teal-950 rounded-2xl text-sm py-1 flex h-fit items-center hover:text-gray-100 px-4 mr-1 bg-gray-100 text-teal-950 border-2 border-teal-950 font-bold cursor-pointer'  onClick={()=>dispatch(unFollowUserIdAsync(elem.user.id))}>UnFollow</div>
          )}
        </div>)
        })}
        {(!show && Info!=null) && Info.followedTo.map((elem:any)=>{
          return (<div className='flex justify-between items-center h-[60px] border-b-2 border-teal-950'>
          <div className='flex items-center justify-start'>
            <div className='bg-teal-200 border-2 border-teal-950 w-[37px] h-[37px] rounded-full ml-3 mr-2'>
            {elem.follower.userImage!==null && <img src={elem.follower.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
            </div>
            <Link to={`/myProfile/${elem.follower.id}`} className='font-semibold text-gray-900 text-base text-left'>{elem.follower.username}</Link>
          </div>
          
          {currUser && equal(currUser.id,id) && <div className='hover:bg-teal-950 rounded-2xl text-sm py-1 flex h-fit items-center hover:text-gray-100 px-4 mr-1 bg-gray-100 text-teal-950 border-2 border-teal-950 font-bold cursor-pointer'  onClick={()=>dispatch(unFollowUserIdAsync(elem.follower.id))}>UnFollow</div>}
        </div>)
        })}

      </div>
    </div>
  )
}
