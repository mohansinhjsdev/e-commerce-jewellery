import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import api from "../api/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  const getProductByCat = async () => {
    try {
      const { data } = await api.get(`/api/product/product-category/${params.id}`);
      setProducts(data?.products || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductByCat();
  }, [params.id]);

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
    <Layout title={`${category?.name || "Category"} Products`}>
      <div className="w-full mt-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-4">{category?.name || "Category"} Products</h1>
        <h2 className="text-center text-gray-500 mb-8">{products?.length} result(s) found</h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No Products Available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p._id} className="border rounded-lg shadow-md overflow-hidden flex flex-col">
                {/* Slider */}
                <div className="w-full h-48">
                  <Slider {...sliderSettings}>
                    {(Array.isArray(p.image) && p.image.length > 0 ? p.image : ["/default-product.jpg"]).map((img, index) => (
                      <img
                        key={`${p._id}-${index}`}
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
                    <button className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
