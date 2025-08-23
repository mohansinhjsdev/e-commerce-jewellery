import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/AdminMenu'


const CreateProducts = () => {
  return (
    <Layout title={'Products - Create Products'}>
       <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='md:col-span-1'>
                <AdminMenu/>
            </div>
            {/* Main Content */}
            <div className='md:col-span-3 bg-gray-50 rounded-lg p-6'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-400'>Create Products</h2>
                <p className=''>This is the Products section. You can Add Products Here.</p>
            </div>
        </div>
       </div>
    </Layout>
  )
}

export default CreateProducts
