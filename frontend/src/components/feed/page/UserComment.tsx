import React, { useEffect, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import {getTimeDifference} from "../../../mainStore/common"
import { useAppDispatch } from '../../../mainStore/common'
import { handleArea, handleAreaComment } from '../feedSlice';
export default function UserComment(props:any) {
  // console.log(props.comment);
  const [reply, setReply] = useState(false)
  const dispatch=useAppDispatch();
  function handleReply(data:any){
    dispatch(handleArea(`Commenting to ${data.author.username} . . . .`))
    dispatch(handleAreaComment(data));
    // console.log(data)
  }
  useEffect(() => {
    // setReply(false)
  }, [])
  
  return (
    
        <div className='flex flex-col items-start pb-2 pt-4 w-full'>
            
            <div className='flex justify-start w-full'>
                <div className='w-[30px] h-[30px] rounded-full ml-1 bg-black mr-4'></div>
                
                <div className='flex flex-col relative w-full'>
                <FaRegHeart className=' top-0 right-1 font-extrabold text-xl text-teal-900 absolute'/>
                  <p className='text-sm font-bold text-left w-4/5'>{props.comment.author.username} <span className=' font-semibold'>{props.comment.content}</span></p>
                  <p className='text-xs font-bold text-teal-800 text-left'><span className='mr-2'>{getTimeDifference(props.comment.createdAt)} ago </span><span className='mr-2'>2 likes</span><span onClick={()=>{handleReply(props.comment)}} className='cursor-pointer'>Reply</span></p>
                  
                  {props.comment.childComments.length!==0 &&
                  <>
                    <div className='text-xs font-bold text-gray-900 mt-2 text-left cursor-pointer'onClick={()=>{setReply(!reply)}}>{reply?<span>----hide replies</span>:<span>----show replies</span>}</div>
                    {reply && props.comment.childComments.map((childComment: any) => (
                      <UserComment key={childComment.id} comment={childComment} />
                  ))}
                </> }
                </div>
                
                
            </div>
            

        </div>
    
  )
}
