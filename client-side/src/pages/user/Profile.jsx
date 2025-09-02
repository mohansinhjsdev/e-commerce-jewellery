import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/Auth'
import api from '../../api/AxiosInstance'
import { toast } from 'react-toastify'

const Profile = () => {
  const [auth,setAuth] = useAuth()

  const [name,setName] = useState("")
      const [email,setEmail] = useState("")
      const [password,setPassword] = useState("")
      const [number,setNumber] = useState("")
      const [address,setAddress] = useState("")

      //get user Data
      useEffect(()=>{
        const {email,name,number,address,password} = auth.user
        setName(name)
        setEmail(email)
        setAddress(address)
        setNumber(number)
        setPassword(password)
      },[auth?.user])

      //form function
const handleSubmit = async (e)=>{
  e.preventDefault();
 try {
  const {data} = await api.put("/api/auth/profile",{name,email,password,number,address})
  console.log(data)
  if(data?.error){
    toast.error(data?.error)
  }else{
    setAuth({...auth,user:data?.updatedUser})
    let ls = localStorage.getItem('auth')
    ls = JSON.parse(ls)
    ls.user = data.updatedUser
    localStorage.setItem('auth',JSON.stringify(ls))
    toast.success("Profile updated Successfully")
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
    <Layout title={'User Profile - User Profile'}>
    <div className='container mx-auto px-4 py-6'>
     <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
         <div className='md:col-span-1'>
             <UserMenu/>
         </div>
         {/* Main Content */}
         <div className='md:col-span-3 bg-gray-50 rounded-lg p-6'>
         <div className="flex items-center justify-center min-h-[75vh] bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            USER PROFILE
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
              
                disabled
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
                
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 cursor-pointer transition duration-300"
            >
              Update
            </button>
          </form>
        </div>
      </div>
         </div>
     </div>
    </div>
 </Layout>
  )
}

export default Profile
