import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/AdminMenu";
import { toast } from "react-toastify";
import api from "../../api/AxiosInstance";

const CreateProducts = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [description, setDescription] = useState("");
  const [shipping, setShipping] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const getCategories = async () => {
    try {
      const { data } = await api.get("/api/category/get-category");
      console.log("data".data)
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !weight || !makingCharge) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("weight", weight);
      formData.append("makingCharge", makingCharge);
      formData.append("description", description);
      formData.append("shipping", shipping);
      formData.append("inStock", inStock);

      // Append images
      images.forEach((img) => {
        formData.append("images", img);
      });

      const { data } = await api.post("/api/product/create-product", formData);

      if (data?.success) {
        toast.success("Product created successfully");
        // Reset form
        setName("");
        setCategory("");
        setWeight("");
        setMakingCharge("");
        setDescription("");
        setShipping(false);
        setInStock(true);
        setImages([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Create Product"}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Create Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                required
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

              {/* Weight */}
              <input
                type="number"
                placeholder="Weight (in grams)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              {/* Making Charge */}
              <input
                type="number"
                placeholder="Making Charge"
                value={makingCharge}
                onChange={(e) => setMakingCharge(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />

              {/* Description */}
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
                rows="3"
              />

              {/* Shipping */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shipping}
                  onChange={(e) => setShipping(e.target.checked)}
                />
                <label>Shipping Available</label>
              </div>

              {/* In Stock */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                <label>In Stock</label>
              </div>

              {/* Image Upload */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              {/* Preview Images */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProducts;
