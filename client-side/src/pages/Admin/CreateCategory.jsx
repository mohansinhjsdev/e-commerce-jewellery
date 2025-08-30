import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/AdminMenu";
import { toast } from "react-toastify";
import api from "../../api/AxiosInstance";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from 'antd'

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const[name,setName] = useState("")
  const [visible,setVisible] = useState(false)
  const [selected,setSelected] = useState(null)
  const [updatedName,setUpdatedName] = useState("")

  //handleForm
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const {data} = await api.post('/api/category/create-category',{name})
      console.log("data submit",data)
      if(data?.success){
        toast.success(`${data?.category?.name || 'Category'} is created`)
        setName('')
        getAllCategory()
      }else{
        toast.error(data?.message || "Something Went Wrong")
      }
      

    } catch (error) {
      console.log(error)
         // Axios error handling
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || "Something went wrong");
    } else {
      toast.error("Something went wrong in input form");
    }
    }
    
  }

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await api.get("/api/category/get-category");
      console.log("Catgory",data.category);
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went wrong in getting category");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);
  //update categor
  const handleUpdate = async(e)=>{
    e.preventDefault()
    try {
      const {data} = await api.put(`/api/category/update-category/${selected._id}`,{name:updatedName})


      if(data.success){
        toast.success(`${updatedName} is updated`)
        setSelected(null)
        setUpdatedName("")
        setVisible(false)
        getAllCategory()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong")
    }
  }

  // delete catgory
  const handleDelete = async(id)=>{
    try {
      const {data} = await api.delete(`/api/category/delete-category/${id}`)


      if(data.success){
        toast.success(`Catgory is deleted`)
        setUpdatedName("")
        getAllCategory()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("somethin went wrong")
    }
  }
  return (
    <Layout title={"Category - Create Category"}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          {/* Main Content */}
          <div className="md:col-span-3 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-400">
              Manage Category
            </h2>
            <p className="mb-6 text-gray-500">
              Add, edit, or remove product categories below.
            </p>
            {/* // category form */}
            <div className="p-3">
            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
            </div>
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              {categories.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">
                  No categories available.
                </p>
              ) : (
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-700 text-white uppercase text-xs">
                    <tr>
                      <th scope="col" className="px-6 py-3 rounded-tl-lg">
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center rounded-tr-lg"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr
                        key={c._id}
                        className="bg-white border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">{c.name}</td>
                        <td className="px-6 py-4 text-center">
                          <button 
                          onClick={()=>{setVisible(true); setUpdatedName(c.name) ;setSelected(c)}}
                          className="text-blue-600 hover:underline font-medium mr-4
                          cursor-pointer transition duration-200">
                            Edit
                          </button>
                          <button 
                          onClick={()=>{handleDelete(c._id)}}
                          className="text-red-600 hover:underline font-medium cursor-pointer transition duration-200">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <Modal 
          onCancel={()=>setVisible(false)} 
          footer={null} 
          visible={visible}>
            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
