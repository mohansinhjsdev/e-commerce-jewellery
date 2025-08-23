import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/AxiosInstance";

const Register = () => {
    const navigate = useNavigate()

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [number,setNumber] = useState("")
    const [address,setAddress] = useState("")
    const [answer,setAnswer] = useState("")

//form function
const handleSubmit = async (e)=>{
    e.preventDefault();
   try {
    const res = await api.post("/api/auth/register",{name,email,password,number,address,answer})
    console.log(res)
    if(res.data.success){
        toast.success(res.data.message)
        navigate('/login')
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
            Register Page
          </h2>

          <form onSubmit={handleSubmit}
          className="max-w-sm mx-auto">
            <div className="mb-5">

              <input
                type="name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeHolder="Enter Your Name"
                required
              />
            </div>
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
            <div className="mb-5">
              <input
                type="number"
                value={number}
                onChange={(e)=> setNumber(e.target.value)}
                id="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeHolder="Enter Your Phone Number"
                required
              />
              </div>
              <div className="mb-5">
              <input
                type="address"
                value={address}
                onChange={(e)=> setAddress(e.target.value)}
                id="address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeHolder="Enter Your Address"
                required
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                value={answer}
                onChange={(e)=> setAnswer(e.target.value)}
                id="answer"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeHolder="What is Your Best Friend Name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 cursor-pointer transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
    </>
  );
};

export default Register;
