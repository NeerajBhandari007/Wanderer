import React from 'react'
import { HashLoader } from 'react-spinners'

export default function LoaderOverlay() {
  return (
    <>
      <div className='fixed top-0 left-0 w-full h-full z-50'>
        <div className='bg-teal-900  w-full flex justify-center items-center h-screen relative bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10'>

      <HashLoader color="#2d675b" size={100} />
      </div>
      </div>
      </>
   
  )
}