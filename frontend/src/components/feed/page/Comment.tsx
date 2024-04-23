import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { FaRegHeart,FaRegBookmark } from "react-icons/fa";
import UserComment from './UserComment';
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { createCommentToCommentAsync, handleArea, handleClose, selectArea, selectAreaComment, selectClose } from '../feedSlice';
import {getTimeDifference} from "../../../mainStore/common"
export default function Comment(props:any) {
  // console.log(props.post);
  const area=useAppSelector(selectArea)
  const dispatch=useAppDispatch();
  function closeHandle(){
    dispatch(handleClose(-1));
    dispatch(handleArea("Add a comment....."))
  }
  const elem =useAppSelector(selectAreaComment)
  function postComment(){
    if(area==="Add a comment....."){
      alert("please selct someone to reply")
    }else{
      const textareaElement = document.getElementById('commentToComment') as HTMLTextAreaElement;
      const data = textareaElement.value.trim();
      if(data===""){
        alert("please write something to comment")
      }else{
        // console.log(elem)
        const obj={
          obj:{content:data},
          postId:elem.postId,
          parentId:elem.id
        }
        // console.log(obj)
        dispatch(createCommentToCommentAsync(obj))
        textareaElement.value="";
      }
      
      
    }
  }
  return (
    <>
        
        <div className='fixed top-0 left-0 w-full h-full z-50'>
          <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
    <div className='text-4xl absolute right-5 top-5 cursor-pointer' onClick={closeHandle}>
      <RxCross2/>
    </div>
    <div className='bg-gradient-to-bl from-gray-400 to-teal-300 h-3/4 md:h-5/6 w-11/12 md:w-1/2 py-4 relative'>
      {/* header */}
      <div className='px-4 border-b border-teal-900 flex items-center pb-4'>
         <div className='w-[35px] h-[35px] rounded-full bg-black mr-5'></div>
         <div className='flex flex-col justify-center items-start'>
              <p className='text-sm font-bold'>{props.post.author.username}</p>
              <p className='text-xs font-bold text-teal-800'>Posted . {getTimeDifference(props.post.createdAt)} ago</p>
          </div>
      </div>
      {/* comments */}
      
        <div className="max-h-[75%] overflow-y-scroll">
          {props.post.comments.map((elem:any)=>{
          return (<div className='px-4 border-b border-teal-900 flex flex-col items-start min-h-20 w-full'>
                <UserComment comment={elem}/>
          </div>)
        })}
        </div>
        
  
      
      {/* footer */}
      <div className='border-t border-teal-900 flex justify-center items-center h-[15%] absolute bottom-0 w-full'>
          <div className='flex justify-start items-center text-xl mx-4  font-extrabold cursor-pointer'>
                  <FaRegHeart className='mr-4 text-teal-900'/>
                  <AiOutlineMessage className='mr-4 text-teal-900' />
                  <FaRegBookmark className='text-teal-900'/>
                </div>
          <div className='flex w-full items-center justify-evenly'>
              <input className='rounded-2xl text-sm p-2 px-4 outline-none bg-teal-50 h-8 w-9/12' id='commentToComment' placeholder={area}></input>
              <IoSend onClick={postComment} className='text-3xl mr-2 cursor-pointer '/>
          </div>
      </div>
    </div>
  </div>
        </div>
         
    </>

  )
}

