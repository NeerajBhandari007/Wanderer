import { useEffect, useState } from 'react';
import { getTimeDifference } from '../../../mainStore/common'
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { createCommentAsync, deletePostAsync, handleClose, handleLikeClose, selectAllPost, selectClose, selectDelete, selectLikeClose, updateDel } from '../feedSlice';
import { likePostAsync, selectLikedPost, selectUserInfo, unlikePostAsync } from '../../user/userSlice';
import Comment from './Comment';
import Likes from './Likes';
import { FaRegHeart,FaRegBookmark,FaHeart } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { RxCross2 } from 'react-icons/rx';

export default function Posts(props:any) {
    const close=useAppSelector(selectClose)
    const closeLike=useAppSelector(selectLikeClose)
    const LikedPost=useAppSelector(selectLikedPost);
    const user=useAppSelector(selectUserInfo);
    const del=useAppSelector(selectDelete);
    
    const dispatch=useAppDispatch()
    var posts=props.posts;
    // console.log(posts)
    // var userPosts:any=[]
    const [userPosts, setUserPosts] = useState<any[]>([]);
    
    // console.log("hi")
    // console.log(props.posts)
    useEffect(() => {
      if (props.user === 1) {
        setUserPosts(props.userPosts);
      }
    }, [props.user, props.userPosts]);
    // console.log("hlo")
    // console.log(userPosts)
    const [likedMap, setLikedMap] = useState<{[key: number]: boolean}>({});
    const [noMap, setNoMap] = useState<{[key: number]: number}>({});
    const [sure, setSure] = useState(false);
   
    function handlePostClose(id:any){
        // console.log(id)
        dispatch(handleClose(id));
      }
      function handleLike(id:any){
        // console.log(id)
        dispatch(handleLikeClose(id));
      }
      function createComment(id:number){
        const textareaElement = document.getElementById(`PostComment${id}`) as HTMLTextAreaElement;
        const data = textareaElement.value.trim();
        if(data===""){
          alert("please write something to comment")
        }else{
          var comm={
            obj:{content:data},
            postId:id
          }
          // console.log(comm)
          dispatch(createCommentAsync(comm));
          textareaElement.value = "";
        }
      }

    useEffect(() => {
      const newLikedMap: {[key: number]: boolean} = {};
      if(LikedPost.length>0){LikedPost.forEach((post: any) => {
        newLikedMap[post.postId] = true;
      });
      setLikedMap(newLikedMap);
    }
    }, []);
   
    useEffect(() => {
      // console.log(posts)
      if (posts && posts.length > 0) {
        // console.log("hi")
        var newnoMap: {[key: number]: number} = {};
        posts.forEach((post: any) => {
          newnoMap[post.id] = post.postLikes.length;
        });
        setNoMap(newnoMap);
        // console.log(newnoMap)
      }
      

    }, [])
    
    
    function handleLikeClick(id:number){
        // console.log(likedMap)
      const updatedLikedMap = { ...likedMap };
      updatedLikedMap[id] = true;
      setLikedMap(updatedLikedMap);
      const updatedNoMap = { ...noMap };
      // console.log(updatedNoMap[id])
      // if (updatedNoMap[id]>=0) {
        updatedNoMap[id] =updatedNoMap[id]+ 1;
      // } else {
        // updatedNoMap[id] = 1;
      // }
      setNoMap(updatedNoMap);
      dispatch(likePostAsync(id))
    }
    function handleUnLikeClick(id:number){
      const updatedLikedMap = { ...likedMap };
      delete updatedLikedMap[id];
      setLikedMap(updatedLikedMap);
      const updatedNoMap = { ...noMap };
      if (updatedNoMap[id]>0) {
        updatedNoMap[id] =updatedNoMap[id]- 1;
      } else {
        updatedNoMap[id] = 0;
      }
      setNoMap(updatedNoMap);
      dispatch(unlikePostAsync(id))
    }
    function handleDel(id:any){
      setUserPosts(userPosts.filter((post:any) => post.id !== id))
      dispatch(deletePostAsync(id))
    }
    function handleCross(){
      setSure(true)
      dispatch(updateDel())
    }
  return (
    <>
    {(props.user===1?userPosts:posts) &&
              (props.user===1?userPosts:posts).map((elem:any)=>{
                return(<div className=" flex flex-col justify-center items-center mb-5">
                <div className='w-full relative min:h-[350px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl pt-2 pb-4'>
                  {props.suggest===1 && <p className='text-xs font-bold text-teal-800 text-left pb-2 border-b px-2 mb-2 border-teal-800'>Suggested</p>}
                  {props.curr && props.user && props.user===1 && <div className='text-2xl absolute right-3 font-bold top-3 cursor-pointer' onClick={handleCross}>
                    <RxCross2/>
                  </div>}
                  {del && sure && <div className='fixed top-0 left-0 w-full h-full z-50'>
                    <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'> 
                        <div className='bg-gradient-to-bl flex flex-col from-gray-400 to-teal-300 h-2/6 w-3/4 md:w-1/2 relative'>
                          <div className='text-xl text-gray-800 flex justify-center items-center font-bold  border-2 border-teal-950 h-3/4'>
                          Are You Sure
                          </div>
                          <div className='flex h-1/4 w-full'>
                            <span className='w-1/2 flex justify-center items-center h-full border-2 border-teal-950 text-base font-bold text-gray-800 cursor-pointer hover:bg-teal-950 hover:text-teal-50' onClick={()=>{handleDel(elem.id)}}>Yes</span>
                            <span className='w-1/2 flex justify-center items-center h-full border-2 border-teal-950 text-base font-bold text-gray-800 cursor-pointer hover:bg-teal-950 hover:text-teal-50' onClick={()=>{setSure(false)}}>Cancel</span>
                          </div>
                          
                        </div>
                    </div>
                  </div>}
                  <div className='px-4'>
                    <div className='flex items-center mb-4'>
                    <div className='w-[40px] h-[40px] rounded-full bg-teal-950 border-2 border-teal-950 mr-4'>
                    {elem.author.userImage!==null && <img src={elem.author.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
                    </div>
                    <div className='flex flex-col justify-center items-start'>
                      <Link to={`/myProfile/${elem.authorId}`} className='text-sm font-bold'>{elem.author.username}</Link>
                      <p className='text-xs font-bold text-teal-800'>Posted . {getTimeDifference(elem.createdAt)} ago</p>
                    </div>
                  </div>
                  <p className='text-left text-sm font-medium text-gray-900 mb-4'>
                    {elem.content}
                  </p>
                  {/* image */}{
                    (elem.imageUrl!==null || elem.videoUrl!==null) &&
                  <div className='w-full flex justify-center items-center bg-teal-200 h-[200px] bg-gradient-to-bl from-gray-300 to-teal-300 rounded-2xl mb-4'>
                    {elem.imageUrl!==null && 
                    <div className='w-1/2 h-full'>
                    <img src={elem.imageUrl} alt="Selected" className=' w-full h-full object-fill pr-2' />
                    </div>}
                    {elem.videoUrl!==null && 
                    <div className='w-1/2 h-full'>
                    <video src={elem.videoUrl} className='w-full h-full object-fill' />
                    </div>}
                  </div>}
                  <div className='flex justify-start items-center text-xl mb-4'>
                     {!likedMap[elem.id] ?<FaRegHeart className='mr-1 cursor-pointer' onClick={()=>{handleLikeClick(elem.id)}}/>:<FaHeart className='mr-1 cursor-pointer fill-red-600' onClick={()=>{handleUnLikeClick(elem.id)}}/>}
                     <span className='mr-3 font-semibold text-sm cursor-pointer' onClick={()=>{handleLike(elem.id)}}>{noMap[elem.id]} Likes</span>
                    {closeLike===elem.id && <Likes content={elem.id}/>}
                    <AiOutlineMessage className='mr-4 cursor-pointer' onClick={()=>{handlePostClose(elem.id)}} />
                    <FaRegBookmark className='mr-4'/>
                  </div>
                  
                  <div className='flex justify-evenly md:justify-start items-center bg-gradient-to-tl from-gray-200 to-teal-300 p-4 rounded-2xl'>
                    <div className='w-1/12'>
                      <div className='w-[33px] h-[33px] rounded-full boder-2 border-teal-950 bg-teal-950 mr-4'>
                      {user && user.userImage!==null && <img src={user.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
                      </div> 
                    </div>
                    {close ===elem.id && <Comment key={elem.id} post={elem}/>}
                    <div className='flex w-4/5 md:w-11/12 items-center justify-between'>
                      <textarea id={`PostComment${elem.id}`} className='rounded-2xl text-sm p-2 mr-2 bg-teal-50 h-[38px]' placeholder='Write your comment'  cols={60}  ></textarea>
                      <IoSend className='text-4xl mr-2 cursor-pointer' onClick={()=>{createComment(elem.id)}}/>
                    </div>
                  </div>
                  </div>
                </div>
              </div>)
              })
            }
    </>
  )
}
