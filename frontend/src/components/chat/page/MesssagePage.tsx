import React, { useEffect, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import {io} from "socket.io-client"
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { fetchOldChatAsync, handleChat, selectChatMessage, selectOldChat, selectedFriend } from '../../user/userSlice';
import { selectLoggedInUser } from '../../auth/authSlice';
import { Link } from 'react-router-dom';

export default function MesssagePage(props:any) {
    const selectFriend=useAppSelector(selectedFriend);
    const user=useAppSelector(selectLoggedInUser);
    const chatMessage=useAppSelector(selectChatMessage)
    const oldMessage=useAppSelector(selectOldChat);
    const dispatch=useAppDispatch();
    function handleOld(){
      dispatch(fetchOldChatAsync(selectFriend.id)) 
      props.setShowOld(!props.showOld)
    }
    function generateRoomName(userId:number, targetUserId:number) {
      const sortedUserIds = [userId, targetUserId].sort();
        return sortedUserIds.join('_');
    }
    const room=generateRoomName(user.id,selectFriend.id)
    const socket= io()
    function handleSend() {
        const textareaElement = document.getElementById("mess") as HTMLTextAreaElement;
        const data = textareaElement.value.trim();
        if (data) {
            socket.emit("chatMessage", {room:room,content:data,senderId:user.id,receiverId:selectFriend.id});
            textareaElement.value = "";
        }
    }
    
    socket.on('receiveMessage', (data:any) => {
        dispatch(handleChat(data))
        // console.log(data)
        // console.log(user)
        // console.log(selectFriend)
    });
    socket.on("connect_error", (err:any) => {
      console.log("client")
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);
    
      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);
    
      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
      console.log("client end")
    });
    
    useEffect(() => {   
        socket.on("connect",()=>{
            console.log("connected")
        })
        
        function joinRoom() {
            socket.emit('joinRoom',room);
        }
        // console.log(room)
        joinRoom()
        
        return () => {
            socket.disconnect()
            console.log('Offline')
        }
    }, [chatMessage])
    
  return (
    <>
    <div className='flex flex-col h-full pb-[60px]'>
    <div className='flex w-full h-[70px] bg-teal-200 justify-start items-center pl-12 md:pl-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20 bg-transparent'>
          <div className='flex w-fit items-center'>
          <div className='h-[33px] w-[33px] rounded-full bg-teal-950 border-2 border-teal-950 mr-4'>
          {selectFriend.userImage!==null && <img src={selectFriend.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
          </div>
          <div className='flex flex-col justify-start items-center'>
            <Link to={`/myProfile/${selectFriend.id}`}>
            <h4 className='text-gray-800 text-base cursor-pointer font-bold'>{selectFriend.username}</h4>
            </Link>
            {/* <p>{online}</p> */}
          </div>
          </div>
          
        </div>
        <div className='py-4 px-2 md:px-12 flex flex-col flex-grow w-full overflow-y-scroll'>
        {props.showOld && oldMessage.map((elem:any)=>{
            return(
            <div className='flex flex-col'>
            {elem.senderId===user.id&&<div id={`${elem.senderId}`} className='flex justify-end items-center h-[30px] my-4'>
              
            <div className='px-4 py-1 bg-teal-700 rounded-2xl'>
              <p className='text-gray-800 text-base font-semibold text-left'>{elem.content}</p>
              </div>
              <div className='h-[32px] w-[32px] rounded-full bg-teal-950 ml-4'>
              {user.userImage!==null && <img src={user.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
              </div>
            </div>}
            {elem.senderId===selectFriend.id&&<div   id={`${elem.receiverId}`}className='flex justify-start items-center h-[30px] my-6'>
            <div className='h-[32px] w-[32px] rounded-full bg-teal-950 mr-4'>
             {selectFriend.userImage!==null && <img src={selectFriend.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
            </div>
              <div className='px-4 py-1 bg-teal-700 rounded-2xl'>
              <p className='text-gray-800 text-base font-semibold text-left'>{elem.content}</p>
              </div>
              
            </div>}</div>)
           })
        }
        {!props.showOld && <p className='w-full pb-4 text-gray-700 text-base font-semibold cursor-pointer' onClick={handleOld}>See Older Messages</p>}

            
        { chatMessage.map((elem:any)=>{
            return(
            <div className='flex flex-col'>
            {elem.senderId===user.id&&<div id={`${elem.senderId}`} className='flex justify-end items-center h-[30px] my-4'>
              
            <div className='px-4 py-1 bg-teal-700 rounded-2xl'>
              <p className='text-gray-800 text-base font-semibold text-left'>{elem.content}</p>
              </div>
              <div className='h-[32px] w-[32px] rounded-full bg-teal-950 ml-4'>
              {user.userImage!==null && <img src={user.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
            
              </div>
            </div>}
            {elem.senderId===selectFriend.id&&<div   id={`${elem.receiverId}`}className='flex justify-start items-center h-[30px] my-6'>
            <div className='h-[32px] w-[32px] rounded-full bg-teal-950 mr-4'>
             {selectFriend.userImage!==null && <img src={selectFriend.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
            </div>
              <div className='px-4 py-1 bg-teal-700 rounded-2xl'>
              <p className='text-gray-800 text-base font-semibold text-left'>{elem.content}</p>
              </div>
              
            </div>}</div>)
           })
        }
       
       
        </div>
    </div>
      
        <div className='flex w-full py-4 items-center justify-center absolute bottom-0 bg-teal-800'>
        <div className='h-[40px] w-[40px] rounded-full bg-teal-950 border-2 border-teal-950 mr-2'>
          {selectFriend.userImage!==null && <img src={selectFriend.userImage} className='object-cover h-full w-full rounded-full' alt='profile'/>}
          </div>
            <textarea id="mess"className='rounded-2xl w-3/4 text-sm p-2 bg-teal-50 h-[38px]' placeholder='Write your message......'  cols={60}  ></textarea>
            <IoSend className='text-4xl ml-2 cursor-pointer' onClick={()=>{handleSend()}}/>
        </div>

    </>
  )
}
