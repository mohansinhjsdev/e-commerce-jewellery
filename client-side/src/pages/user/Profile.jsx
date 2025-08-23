import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'

const Profile = () => {
  return (
    <Layout title={'User Profile - User Profile'}>
    <div className='container mx-auto px-4 py-6'>
     <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
         <div className='md:col-span-1'>
             <UserMenu/>
         </div>
         {/* Main Content */}
         <div className='md:col-span-3 bg-gray-50 rounded-lg p-6'>
             <h2 className='text-2xl font-semibold mb-4 text-gray-400'>Profile</h2>
         </div>
     </div>
    </div>
 </Layout>
  )
}

export default Profile
