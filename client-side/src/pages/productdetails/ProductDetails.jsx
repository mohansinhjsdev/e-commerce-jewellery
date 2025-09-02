import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import api from "../../api/AxiosInstance";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetails = () => {
  const { id } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  

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

  const getProductDetails = async () => {
    try {
      const { data } = await api.get(`/api/product/get-single/${id}`);
      console.log("details", data);
      setProduct(data.product); 
      
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);


  if (loading) {
    return (
      <Layout title="Product Details">
        <div className="flex justify-center items-center h-80 text-lg font-semibold">
          Loading product details...
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product Details">
        <div className="text-center text-red-500 mt-10">Product not found!</div>
      </Layout>
    );
  }

  return (
    <Layout title={product.name}>
      <div className="max-w-5xl mx-auto p-4">
        {/* Product Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider */}
          <div className="relative">
            <Slider {...sliderSettings}>
              {(Array.isArray(product.image) && product.image.length > 0
                ? product.image
                : ["/default-product.jpg"]
              ).map((img, index) => (
                <img
                  key={`${product._id}-${index}`}
                  src={img}
                  alt={`${product.name}-${index}`}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              ))}
            </Slider>
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-sm text-gray-500 mt-1">
                  Category: {product.category.name}
                </p>
              )}
              <p className="text-yellow-600 font-extrabold text-3xl mt-4">
                {" "}
                {product.finalPrice !== undefined 
      ? product.finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }) 
      : "N/A"}
              </p>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg text-lg font-semibold transition">
                Add to Cart
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 border border-gray-300 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
