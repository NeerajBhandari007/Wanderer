import React, { useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";
import {useAppDispatch,useAppSelector } from '../../../mainStore/common'
import { fetchPostLikeByIdAsync, handleLikeClose, selectPostLikeUser } from '../feedSlice';
import { Link } from 'react-router-dom';

export default function Likes(props:any) {
    const dispatch=useAppDispatch();
    const content=useAppSelector(selectPostLikeUser)
    console.log(content)
    // console.log(props.content)
    function closeHandle(){
        dispatch(handleLikeClose(-1));
    }
    useEffect(() => {
      dispatch(fetchPostLikeByIdAsync(props.content))
    }, [])
    
  return (
    <>
      <div className='fixed top-0 left-0 w-full h-full z-50'>
        <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
            <div className='text-4xl absolute right-5 top-5 cursor-pointer' onClick={closeHandle}>
                <RxCross2/>
            </div>
            
            <div className='bg-gradient-to-bl flex flex-col from-gray-400 to-teal-300 h-3/4 w-3/4 md:w-1/4 py-2 relative'>
              <div className='text-base font-bold h-[28px] px-6 pb-2 border-teal-900 border-b-2'>
                Likes
              </div>
              {content&&<div className='flex-grow overflow-y-scroll '>
                {content.map((elem:any)=>{
                  return(<div className='border-teal-900 border-b px-4 py-3 flex items-center'>
                  <div className='h-[25px] w-[25px] bg-teal rounded-full mr-3'>
                  {elem.user.userImage!==null && <img src={elem.user.userImage} className='object-cover w-full h-full rounded-full' alt='profile'/>}
                  </div>
                  <Link to={`/myProfile/${elem.user.id}`}>
                    <div className='text-sm font-semibold text-gray-900'>{elem.user.username}</div>
                  </Link>
                  
                </div>)
                })}
                
              </div>}
            </div>
        </div>
      </div> 
    </>
  )
}
