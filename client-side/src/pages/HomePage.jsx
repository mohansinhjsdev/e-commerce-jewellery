import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api/AxiosInstance";
import Slider from "react-slick";
import { Checkbox, Spin, Radio } from "antd";
import { Prices } from "../components/Prices";
import Pagination from "../pagination/Pagination";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import { toast } from "react-toastify";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cart,setCart] = useCart()

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPage = Math.ceil(products.length / productsPerPage);

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await api.get("/api/category/all-categories");
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Fetch all products initially
  const getAllProducts = async () => {
    try {
      const { data } = await api.get("/api/product/all-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checked.length === 0 && radio.length === 0) {
      getAllProducts();
    }
  }, [checked, radio]);

  // Filter products when checked or radio changes
  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) {
      filterProducts();
    }
  }, [checked, radio]);

  const handleFilter = (isChecked, id) => {
    let all = [...checked];
    if (isChecked) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const filterProducts = async () => {
    try {
      const { data } = await api.post("/api/product/product-filter", {
        checked,
        radio,
      });
      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Layout title="All Products - Best Offer">
      <div className="container mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="bg-white shadow-lg rounded-xl p-5 md:sticky md:top-20 h-fit self-start">
              <h5 className="text-xl font-bold mb-4 border-b pb-2">Filter By Category</h5>
              <div className="flex flex-col gap-3 mb-6">
                {categories?.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                    checked={checked.includes(c._id)}
                  >
                    <span className="text-gray-700 font-medium">{c.name}</span>
                  </Checkbox>
                ))}
              </div>

              {/* <h5 className="text-xl font-bold mb-4 border-b pb-2">Filter By Price</h5>
              <Radio.Group
                className="flex flex-col gap-3"
                onChange={(e) => setRadio(e.target.value)}
                value={radio}
              >
                {Prices?.map((p,index) => (
                  <Radio key={index} value={p.array}>
                    <span className="text-gray-700 font-medium">{p.name}</span>
                  </Radio>
                ))}
              </Radio.Group> */}

              {(checked.length > 0 || radio.length > 0) && (
                <button
                  onClick={() => {
                    setChecked([]);
                    setRadio([]);
                    getAllProducts();
                  }}
                  className="mt-6 w-full bg-gray-300 rounded-lg py-2 text-gray-800 font-semibold hover:bg-gray-400 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Product Section */}
            <div className="md:col-span-3">
              <h2 className="text-center text-3xl font-extrabold mb-8">All Products</h2>

              {products.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">No Products Available</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 mt-6">
                  {currentProducts.map((p) => (
                    <div
                      key={p._id}
                      className="border rounded-lg shadow-md overflow-hidden flex flex-col"
                    >
                      {/* Slider */}
                      <div className="w-full h-48">
                        <Slider {...sliderSettings}>
                          {(Array.isArray(p.image) && p.image.length > 0
                            ? p.image
                            : ["/default-product.jpg"]
                          ).map((img, index) => (
                            <img
                              key={`${p._id} ${index}`}
                              src={img}
                              alt={`${p.name}-${index}`}
                              className="w-full h-48 object-cover"
                            />
                          ))}
                        </Slider>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{p.name}</h3>
                          <p className="text-yellow-600 font-bold text-md mt-1">{p.finalPrice}</p>
                          <p className="text-gray-500 text-sm mt-2 truncate">{p.description.substring(0, 30)}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/product-details/${p._id}`)}
                            className="flex-1 bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
                          >
                            Read more
                          </button>
                          <button
                          onClick={()=>{
                            setCart([...cart,p])
                            localStorage.setItem('cart',JSON.stringify([...cart,p]))
                            toast.success('Item added to Cart')
                          }}
                          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
