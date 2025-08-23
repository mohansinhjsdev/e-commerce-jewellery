import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/AdminMenu";
import { toast } from "react-toastify";
import api from "../../api/AxiosInstance";
import CategoryForm from "../../components/Form/CategoryForm";
import { useAuth } from "../../context/Auth";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);

  const[name,setName] = useState("")

  const [auth] = useAuth()

  //handleForm

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const {data} = await api.post('/api/category/create-category',{name},
        {
          headers:{
            Authorization:`Bearer ${auth?.token}`
          }
        }
      )
      console.log("data submit",data)
      if(data?.success){
        toast.success(`${data.name} is created`)
        getAllCategory()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong in input form")
    }
  }

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await api.get("/api/category/get-category");
      console.log(data.category);
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
                          <button className="text-blue-600 hover:underline font-medium mr-4">
                            Edit
                          </button>
                          <button className="text-red-600 hover:underline font-medium">
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
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
