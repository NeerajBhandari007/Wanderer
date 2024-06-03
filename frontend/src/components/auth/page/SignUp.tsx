import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { createUserAsync, selectError, selectLoggedInUser, selectStatus } from "../authSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import logo from './Logo.png'; 
import LoaderOverlay from "../../loader/Loader";
export default function SignUp() {
     const [second, setSecond] = useState(false)
     const error=useAppSelector(selectError)
     
     const status=useAppSelector(selectStatus)
     const [image, setImage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
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
          setImage(data.url)
          // console.log(data.url)
        }).catch((err)=>console.log(err))
        
      };
    }
    const dispatch=useAppDispatch();
    const user=useAppSelector(selectLoggedInUser)
  return (
    <>
    {user && <Navigate to="/" replace={true}></Navigate>}
    {status==='loading' && <LoaderOverlay></LoaderOverlay>}
    <div className="flex min-h-screen bg-center bg-back bg-cover w-full justify-center flex-1 px-6 py-12 md:px-1 md:py-4 lg:px-4 lg:py-4 bg-gray-100">
      <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 justify-between px-2 bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100">
          <div className="flex  justify-center mt-12 md:mt-2 md:justify-between items-center md:mx-4 lg:mx-2">
          <img src={logo} alt="logo" className='object-contain h-[30px] w-[120px] hidden md:flex'/>
            <p className="text-center hidden md:flex items-center text-sm font-semibold text-gray-500">
              Already a member ?{" "}
              <Link
                to="/signIn"
                className="ml-4 font-semibold leading-6  border-2 rounded-xl px-2 py-1  border-teal-900 text-black hover:border-black hover:text-white hover:bg-gradient-to-tr hover:from-gray-800 hover:to-teal-900"
              >
                signIn
              </Link>
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <div className="my-3 w-full ">
            <img src={logo} alt="logo" className='object-contain h-[30px] w-full flex mb-8 md:hidden pr-6'/>
            
              {!second && <h2 className="text-center text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r to-gray-600 from-teal-950 inline-block text-transparent bg-clip-text">
                Get Started
              </h2>}
              {second && <h2 className="text-center text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r to-gray-600 from-teal-950 inline-block text-transparent bg-clip-text">
                Set Up Your Profile
              </h2>}
              <p className="text-center text- text-sm font-semibold leading-9 tracking-tight text-gray-900">
                Create your account now
              </p>
            </div>
            <form
              noValidate
              className="flex flex-col justify-evenly min-h-[340px]"
              onSubmit={handleSubmit((data) => {
                const interestsString = data.interests;
                const interestsArray = interestsString.split(','); // Split the string by comma
                const interestsObject = { interests: interestsArray };
                // console.log(interestsObject);
                // console.log(data);
                dispatch(
                  createUserAsync({
                    username:data.username,
                    email:data.email,
                    password:data.password,
                    role:"user",
                    interests:interestsArray,
                    userImage:image
                  })
                );
              })}
            >
              {second && <div className='flex items-center'>
                        <div className='bg-teal-50 w-[80px] h-[80px] rounded-full mr-6 border-2 border-teal-950'>
                        {image!==null &&<img src={image} id="pimage" alt="Selected" className=' w-full rounded-full h-full object-fill' />}
                        </div>
                        <div className='px-5 py-2 border-2  border-teal-950 h-fit  relative bg-teal-50 w-fit flex justify-center items-center cursor-pointer'>
                          <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          id="image"
                          className='w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer'/>
                          <FaImage className='text-xl mr-2'/>
                          <p className='text-sm font-semibold text-gray-800'>Photo</p>
                        </div>
                      </div>}
              {second &&<div>
                <label
                  htmlFor="username"
                  className="block float-left text-sm font-medium leading-6 text-gray-900"
                >
                  UserName
                </label>
                <div>
                  <input
                    id="username"
                    {...register("username", {
                      required: "UserName is Required"
                    })}
                    type="name"
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                  {errors.username && (
                    <p className="font-semibold text-xs text-red-500">
                      {errors.username.message as React.ReactNode}
                    </p>
                  )}
                </div>
              </div>}
              {!second &&<div>
                <label
                  htmlFor="email"
                  className="block float-left text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div>
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is Required",
                      pattern: {
                        value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                        message: "Enter Correct Email",
                      },
                    })}
                    type="email"
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                  {errors.email && errors.email.message && (
                    <p className="font-semibold text-xs text-red-500">
                      {errors.email.message as React.ReactNode}
                    </p>
                  )}
                </div>
              </div>}

              {!second && <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div>
                  <input
                    id="password"
                    {...register("password", {
                      required: "Password is Required",
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gi,
                        message: `- at least 8 characters \n
- must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number \n
- Can contain special characters`,
                      },
                    })}
                    type="password"
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                </div>
                {errors.password && (
                  <p className="font-semibold text-xs text-red-500">
                    {errors.password.message as React.ReactNode}
                  </p>
                )}
              </div>}
              {second &&<div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="Interests"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Interests
                  </label>
                  <div className="text-sm"></div>
                </div>
                <div>
                  <input
                    id="interests"
                    {...register("interests", {
                      required: "Interests is Required",
                    })}
                    type="text"
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                  {errors.interests && (
                    <p className="font-semibold text-xs text-red-500">
                      {errors.interests.message as React.ReactNode}
                    </p>
                  )}
                </div>
              </div>}
              {!second &&<div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <div className="text-sm"></div>
                </div>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Confirm Password is Required",
                      validate: (value, formValues) =>
                        value === formValues.password ||
                        "Password not matching",
                    })}
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-800 sm:text-sm sm:leading-6"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message as React.ReactNode}
                    </p>
                  )}
                </div>
              </div>}
              <div>
                {!second && <button
                  // type="submit"
                  onClick={()=>{setSecond(true)}}
                  className="flex w-full mt-2 justify-center rounded-md bg-gradient-to-r from-teal-950 to-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Create (1/2)
                </button>}
                {second &&
                <div className="flex items-center w-full">
                 <FaArrowLeftLong onClick={()=>{setSecond(false)}} className="w-1/4 mt-2 bg-gradient-to-r from-teal-950 to-gray-500 px-3 py-1.5 text-4xl rounded-md mr-4 font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-teal-900"/>
                <button
                  type="submit"
                  className="flex w-3/4 mt-2 justify-center rounded-md bg-gradient-to-r from-teal-950 to-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-tr hover:from-gray-500 hover:to-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Create (2/2)
                </button>
                
                </div>}
                {error && <span className="text-sm text-red-500 mt-0">
                {error || error.message}
                </span>}
                
                
              </div>
            </form>
            {/* mobile */}
            
            <p className="mt-10 md:hidden text-center text-sm text-gray-500">
              Already a member ?{" "}
              <Link
                to="/signIn"
                className="font-semibold leading-6 text-black hover:text-teal-900"
              >
                SignIn
              </Link>
            </p>
          </div>
          <p className="flex justify-center content-center w-full font-semibold text-gray-400 text-2xl">
            <p className='h-fit'>...</p>
            
          </p>
        </div>
      </div></>
    
  )
}
