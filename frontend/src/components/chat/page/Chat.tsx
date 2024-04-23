import React, { useState } from 'react'
import MesssagePage from './MesssagePage'
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { clearChat, clearOldMessage, handleFriend, selectUserFriends, selectedFriend } from '../../user/userSlice'
import { RxCross2 } from 'react-icons/rx';
import { IoMdHome } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';

export default function Chat() {
  const friends=useAppSelector(selectUserFriends);
  const selectFriend=useAppSelector(selectedFriend);
  const [selected, setSelected] = useState(-1)
  const [showOld, setShowOld] = useState<any>(false)
  const [phone, setPhone] = useState<any>(false)
  const dispatch=useAppDispatch()
  // console.log(friends)
  function handleSelect(elem:any){
    setSelected(elem.id)
    dispatch(handleFriend(elem))
    dispatch(clearChat())
    dispatch(clearOldMessage())
    setShowOld(false)
    // console.log(elem)
  }
  
  return (
    <div className='flex w-full h-screen'>
      <div className='hidden md:flex flex-col pt-[70px] w-1/4 h-full bg-teal-900 relative'>
        <Link to="/">
          <h1 className='text-xl font-bold cursor-pointer text-gray-200 h-[70px] flex items-center justify-center border-b-2 border-b-gray-200  absolute top-0 w-full'>Wander-Chat</h1>
        </Link>
        {friends&& friends.map((elem:any)=>{
          return(<div className='flex items-center justify-start px-4 h-[60px] border-b border-gray-200 cursor-pointer'onClick={()=>{handleSelect(elem)}}>
          <div className='h-[33px] w-[33px] rounded-full bg-teal-950 border-2 border-teal-950 mr-4'>
          {elem.userImage!==null && <img src={elem.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
          </div>
          <h4 className='text-gray-200 text-base font-semibold' >{elem.username}</h4>
        </div>)
        })}
      </div>
      {phone && <div className='fixed top-0 left-0 w-full h-full z-50'>
        <div className='bg-teal-900  w-full flex justify-start items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>
            <div className='text-4xl absolute right-5 top-5 cursor-pointer' onClick={()=>{setPhone(false)}}>
                <RxCross2/>
            </div>
            <div className='flex flex-col pt-[70px] w-1/2 h-full bg-teal-900 relative'>
        <h1 className='text-xl font-bold text-gray-200 h-[70px] flex items-center justify-center border-b-2 border-b-gray-200  absolute top-0 w-full'>Wander-Chat</h1>
        {friends&& friends.map((elem:any)=>{
          return(<div className='flex items-center justify-start px-4 h-[60px] border-b border-gray-200 cursor-pointer'onClick={()=>{handleSelect(elem)}}>
          <div className='h-[33px] w-[33px] rounded-full bg-teal-950 border-2 border-teal-950 mr-4'>
          {elem.userImage!==null && <img src={elem.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
          </div>
          <h4 className='text-gray-200 text-base font-semibold' >{elem.username}</h4>
        </div>)
        })}
            </div>
        </div>
      </div> }
      
      <div className='flex w-full md:w-3/4 flex-col  h-full bg-gradient-to-t from-gray-50 to-teal-200 relative'>
        {!phone &&<div className='flex absolute left-2 top-5 justify-between w-full  md:relative '>
          <GiHamburgerMenu className='text-teal-950 font-extrabold text-3xl cursor-pointer md:hidden' onClick={()=>{setPhone(true)}}/>
          <Link to="/">
            <IoMdHome className='text-teal-950 font-extrabold text-3xl mr-2 cursor-pointer md:absolute right-2'/>
          </Link>
        </div>}
        {selectFriend && selected===selectFriend.id ? <MesssagePage showOld={showOld} setShowOld={setShowOld}/>:(<div className='h-full w-full flex justify-center items-center'>
        <div className='text-gray-700 font-bold text-3xl'>Please Select Someone to Chat</div>
        </div>)}
        
      </div>
    </div>
  )
}
