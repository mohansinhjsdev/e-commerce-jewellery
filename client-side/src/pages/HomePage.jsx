import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api/AxiosInstance";
import Slider from "react-slick";
import { Checkbox, Spin, Radio } from "antd";
import { Prices } from "../components/Prices";
import Pagination from "../pagination/Pagination";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage,setCurrentPage] =useState(1)
  const productsPerPage = 3;

  const indexOfLasProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLasProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLasProduct);
  const totalPage = Math.ceil(products.length/productsPerPage)


  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await api.get("/api/category/all-categories");
      if (data?.success) {
        const uniqueCategories = Array.from(
          new Map(data.categories.map((c) => [c.name, c])).values()
        );
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
 
  }, []);

  // Fetch all products
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

  // Run on page load & when filters reset
  useEffect(() => {
    if (checked.length === 0 && radio.length === 0) {
      getAllProducts();
    }
  }, [checked, radio]);

  // Run filter when category or price changes
  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) {
      filterProducts();
    }
  }, [checked, radio]);

  // Handle category filter
  const handleFilter = (isChecked, id) => {
    let all = [...checked];
    if (isChecked) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

 

  // Filter products API call
  const filterProducts = async () => {
    try {
      const { data } = await api.post("/api/product/product-filter", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Slider settings
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
    <Layout title={"All Products - Best Offer"}>
      <div className="container mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="bg-white shadow-lg rounded-xl p-5">
              <h5 className="text-xl font-bold mb-4 border-b pb-2">
                Filter By Category
              </h5>
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

              <h5 className="text-xl font-bold mb-4 border-b pb-2">
                Filter By Price
              </h5>
              <Radio.Group
                className="flex flex-col gap-3"
                onChange={(e) => setRadio(e.target.value)}
                value={radio}
              >
                {Prices?.map((p) => (
                  <Radio key={p._id} value={p.array}>
                    <span className="text-gray-700 font-medium">{p.name}</span>
                  </Radio>
                ))}
              </Radio.Group>

              {/* Clear Filters Button */}
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
              <h2 className="text-center text-3xl font-extrabold mb-8">
                All Products
              </h2>

              {products.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">
                  No Products Available
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((p) => (
                    <div
                      key={p._id}
                      className="border rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 overflow-hidden flex flex-col bg-white"
                    >
                      {/* Image Slider */}
                      <Slider {...sliderSettings}>
                        {(Array.isArray(p.image) && p.image.length > 0
                          ? p.image
                          : ["/default-product.jpg"]
                        ).map((img, index) => (
                          <img
                            key={`${p._id}-${index}`} // ✅ Fixed key
                            src={img}
                            alt={`${p.name}-${index}`}
                            className="w-full h-48 object-cover"
                          />
                        ))}
                      </Slider>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                        <p className="text-gray-700 font-semibold text-md mb-1">
                          ₹{p.finalPrice}
                        </p>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {p.description.substring(0, 30)}...
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-auto">
                          <button
                            className="flex-1 rounded-lg bg-slate-800 py-2 text-center text-white font-semibold hover:bg-slate-700 transition-all"
                            type="button"
                          >
                            Read more
                          </button>
                          <button
                            className="flex-1 rounded-lg bg-green-600 py-2 text-center text-white font-semibold hover:bg-green-500 transition-all"
                            type="button"
                          >
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
             totalPages = {totalPage}
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
