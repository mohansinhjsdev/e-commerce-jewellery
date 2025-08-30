import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "../../components/AdminMenu";
import api from "../../api/AxiosInstance";
import { toast } from "react-toastify";

const UpdateProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [shipping, setShipping] = useState(false);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false)

  // Fetch Product Details
  const getProductDetails = async () => {
    try {
      const { data } = await api.get(`/api/product/get-single/${id}`);
      console.log("data get from get", data);
      if (data.success) {
        const product = data.product;
        setName(product.name);
        setCategory(product.category?.category || "");
        setWeight(product.weight);
        setMakingCharge(product.makingCharge);
        setDescription(product.description);
        setInStock(product.inStock);
        setShipping(product.shipping);
        setPreview(Array.isArray(product.image) ? product.image : [product.image]); // show existing image
      }
    } catch (error) {
      toast.error("Error loading product details");
      console.error(error);
    }
  };

  // Fetch all categories for dropdown
  const getAllCategories = async () => {
    try {
      const { data } = await api.get("/api/category/get-category");
      if (data.success) {
        setCategories(data.category); // this will always be an array
      }
    } catch (error) {
      toast.error("Error loading categories");
      console.error(error);
    }
  };

  useEffect(() => {
    getProductDetails();
    getAllCategories();
  }, [id]);

  // Handle Image Change (Preview)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // Submit Updated Product
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("weight", weight);
    formData.append("makingCharge", makingCharge);
    formData.append("description", description);
    formData.append("inStock", inStock);

    images.forEach((file) => {
      formData.append("images", file); // field name "images"
    });

    try {
      setLoading(true)
      const { data } = await api.put(
        `/api/product/update-product/${id}`,
        formData
      );

      console.log("update product ", data);
      if (data.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard/admin/product");
      } else {
        toast.error(data.message || "Updated failed");
      }
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  return (
    <Layout title="Update Product">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3 bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Update Product</h1>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
              />
              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="number"
                placeholder="Making Charge"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value)}
                className="border p-2 w-full"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
              />

              {/* Instock */}
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                  />{" "}
                  In Stock
                </label>
              </div>

              {/* Shipping */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shipping}
                  onChange={(e) => setShipping(e.target.checked)}
                />
                <label>Shipping Available</label>
              </div>

              {/* Image */}
              <div>
                <label className="block mb-2">Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
                {preview.length > 0 &&
                  preview.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt="Preview"
                      className="w-32 h-32 object-cover border"
                    />
                  ))}
                
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProducts;
