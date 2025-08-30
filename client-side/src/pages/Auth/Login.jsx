import React,{useState} from 'react'
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { useNavigate,useLocation } from "react-router-dom";
import api from "../../api/AxiosInstance";
import { useAuth } from '../../context/Auth';

const Login = () => {

    const [auth,setAuth] = useAuth()
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const location = useLocation()
   

//form function
const handleSubmit = async (e)=>{
    e.preventDefault();
   try {
    const res = await api.post("/api/auth/login",{email,password})
    console.log(res)
    if(res.data.success){
        toast.success(res.data.message)
        setAuth({
            ...auth,
            user:res.data.user,
            token:res.data.token
        })

        localStorage.setItem('auth',JSON.stringify(res.data))
        navigate(location.state ||'/')
        
        // setTimeout(()=>{
            
        // },2000)
    } else{
        toast.error(res.data.message)
    }
   } catch (error) {
    console.log(error)
    if(error.response && error.response.data && error.response.data.message){
      toast.error(error.response.data.message);
    } else{
      toast.error("Something Went Wrong")
    }
   }
}
  return (
    <>
    <Layout title="Register-Jewellary App">
    <div className="flex items-center justify-center min-h-[75vh] bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          LOGIN FORM
        </h2>

        <form onSubmit={handleSubmit}
        className="max-w-sm mx-auto">

          <div className="mb-5">
            <input
              type="email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeHolder="Enter Your Email"
              required
            />
          </div>
 
          
          
          <div className="mb-5">
            <input
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Your Password"
              required
            />
          </div>
         <div className='mb-3'>
         <button
      type="button"
      onClick={() => navigate('/forgot-password')}
      className="text-yellow-700 hover:text-yellow-900 text-sm underline transition duration-200 cursor-pointer"
    >
      Forgot?
    </button>
         </div>
          
          <button
            type="submit"
            className="w-full text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 cursor-pointer transition duration-300"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  </Layout>
  </>
  )
}

export default Login
