import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/AdminMenu";
import { toast } from "react-toastify";
import api from "../../api/AxiosInstance";
import { Link } from "react-router-dom";
import Slider from "react-slick"

const Product = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await api.get("api/product/get-all");
      console.log("fetching the data", data.products);

      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to load products");
      }
    } catch (error) {
      console.log("Error while fetching the details", error);
      toast.error("Error fetching the Products Details");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const sliderSettings = {
    dots : true,
    infinite:true,
    speed:500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  return (
    <Layout title={"All Product"}>
      <div className="containter mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          {/* Main Conatint */}
          <div className="md:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              All Products List
            </h2>
            {products.length === 0 ? (
              <p className="text-gray-500">No Products Available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6    ">
                {products.map((p) => (
                  <Link 
                  key={p._id}
                  to={`/dashboard/admin/products/${p._id}`}>
                    <div
                      key={p._id}
                      className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                      <Slider {...sliderSettings}>
                      {(Array.isArray(p.image) && p.image.length > 0
                          ? p.image
                          : ["/default-product.jpg"]
                        ).map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`${p.name}-${index}`}
                            className="w-full h-48 object-cover"
                          />
                        ))}
                      </Slider>
                     
                      <div className="p-4">
                        <div className="font-bold text-lg">{p.name}</div>
                        <p className="text-gray-500 text-sm mb-2">
                          ₹{p.finalPrice}
                        </p>
                        <p className="text-gray-600 text-sm truncate">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
