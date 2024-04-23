import React from 'react'
import { AiOutlineMessage } from 'react-icons/ai'
import { FaRegHeart, FaRegUser } from 'react-icons/fa6'
import { GiHamburgerMenu } from 'react-icons/gi'
import { GoHome } from 'react-icons/go'
import { IoSearchSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { selectUserInfo } from '../user/userSlice'
import { useAppSelector } from '../../mainStore/common'
import logo from './img/Logo.png'; 

export default function Navbar() {
  const user=useAppSelector(selectUserInfo);
  return (
    <header>
        <nav className='flex z-30 justify-between bg-teal-200 fixed shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] w-full h-16 md:h-20 p-1 md:p-4' >
            <div className='w-1/5 h-12   hidden md:flex justify-start items-center'>
              <Link to="/">
              <img src={logo} alt="logo" className='object-cover h-[20px]'/>
              </Link>
                

                {/* <input className='rounded-2xl p-1 px-2 h-[30px] text-sm w-5/6 bg-teal-50' type="search" placeholder='#Explore' name="searchBar"/> */}
            </div>
            <div className='md:rounded-2xl bg-teal-50 w-full h-full md:w-2/5 md:h-12 flex justify-evenly items-center text-2xl  text-teal-800'>
            <Link to="/">
            <GoHome />
            </Link>
            <Link to="/search/">
            <IoSearchSharp/>
            </Link>
            
            <Link to="/chat/">
              <AiOutlineMessage />
            </Link>
            
            
            
            <FaRegHeart/>
            {user && <Link to={`/myProfile/${user.id}`} className='md:hidden'>
            <FaRegUser/>
            </Link>}
            
            </div>
              <div className='rounded-2xl bg-teal-50 hidden md:flex justify-evenly items-center  w-1/5 h-12 '>
                <div className='w-[30px] h-[33px] rounded-md bg-teal-900 flex justify-center items-center border-2 border-teal-950'>
                  {user && user.userImage!==null && <img src={user.userImage} className='object-cover h-full w-full' alt='profile'/>}
                </div>
                {user ?
                <Link to={`/myProfile/${user.id}`}><div className='font-bold text-sm cursor-pointer'>{user.username}</div></Link>:<p className='font-bold text-sm'>UserName</p>}
                <div className='text-xl'>
                    <GiHamburgerMenu/>
                </div>
            </div>
        </nav>
      </header>
  )
}
