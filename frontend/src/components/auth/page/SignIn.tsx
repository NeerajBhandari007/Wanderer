import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useAppSelector,useAppDispatch } from '../../../mainStore/common'
import { handleError, loginUserAsync, selectError, selectLoggedInUser, selectStatus } from "../authSlice";
import logo from './Logo.png'; 
import LoaderOverlay from "../../loader/Loader";
import { useEffect } from "react";
export default function SignUp() {

  const status=useAppSelector(selectStatus)
  const error=useAppSelector(selectError);
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    const dispatch=useAppDispatch();
    const user=useAppSelector(selectLoggedInUser)
    useEffect(() => {
      dispatch(handleError())
    }, [])
    
  return (
    <>
    {user && <Navigate to="/" replace={true}></Navigate>}
    {status==='loading' && <LoaderOverlay></LoaderOverlay>}
    
    <div className="flex min-h-screen bg-center bg-back bg-cover w-full justify-center flex-1 px-6 py-12 md:px-1 md:py-4 lg:px-4 lg:py-4  bg-gray-100">
      
      <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 justify-between px-2 bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100">
          <div className="flex  justify-center md:mt-2 md:justify-between items-center md:mx-4 lg:mx-2">
          <img src={logo} alt="logo" className='object-contain h-[30px] w-[120px] hidden md:flex'/>
            <p className="text-center hidden md:flex items-center text-xs font-semibold text-gray-500">
            Not a member ?{" "}
              <Link
                 to="/signUp"
                className="ml-4 font-semibold leading-6  border-2 rounded-xl px-2 py-1  border-green-900 text-black hover:border-black hover:text-white hover:bg-gradient-to-tr hover:from-gray-800 hover:to-green-900"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
            <div className="my-3 mb-12 w-full ">
            <img src={logo} alt="logo" className='object-contain h-[30px] w-full flex mb-12 md:hidden pr-6'/>
            
              <h2 className="text-center text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r from-gray-800 to-green-900 inline-block text-transparent bg-clip-text">
              Welcome Back
              </h2>
              <p className="text-center text- text-sm font-semibold leading-9 tracking-tight text-gray-900">
              Enter Your Account Details
              </p>
            </div>
            <form
              noValidate
              className="space-y-4 md:h-72"
              onSubmit={handleSubmit((data) => {
                // console.log(data);
                dispatch(
                  loginUserAsync({
                    email: data.email,
                    password: data.password
                  })
                );
              })}
            >
            
              <div>
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
                    className="block w-full mb-6 rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message as React.ReactNode}
                    </p>
                  )}
                </div>
              </div>

              <div>
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
                    className="block w-full mb-8 rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message as React.ReactNode}
                  </p>
                )}
              </div>
              {error && <span className="text-sm text-red-500 mt-0">
              {error || error.message}
              </span>}
              
              <div>
                <button
                  type="submit"
                  className="flex w-full mt-2 mb-6 justify-center rounded-md bg-gradient-to-r from-gray-800 to-green-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gradient-to-tr hover:from-gray-800 hover:to-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Sign in
                </button>
              </div>
              {/* laptop */}
              <div className="text-xs flex justify-center mt-12">
                <a
                  href="/"
                  className="font-semibold text-black hover:text-cyan-900"
                >
                  Forgot Email id?
                </a>
                <p className="font-bold mx-3 text-black">.</p>
                <p
                //   to="/forgot-password"
                  className="font-semibold  text-black hover:text-cyan-900"
                >
                  Forgot password?
                </p>
              </div>
            </form>
            {/* mobile */}

            <p className="mt-10 md:hidden text-center text-sm text-gray-500">
            Not a member?{" "}
              <Link
                to="/signUp"
                className="font-semibold leading-6 text-black hover:text-green-900"
              >
                Create an account
              </Link>
            </p>
          </div>
          <p className="flex justify-center content-center w-full font-semibold text-gray-400 text-2xl">
            <p className='h-fit'>...</p>
            
          </p>
        </div>
      </div>
    </>
    // bg-gradient-to-r from-gray-800 to-green-900
    
  )
}
