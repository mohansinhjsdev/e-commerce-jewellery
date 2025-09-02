import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/Search'
import Slider from "react-slick";   
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import api from '../api/AxiosInstance';
import { Spin } from 'antd';

const Search = () => {
    const [values] = useSearch()
    const [productPrice, setProductPrice] = useState([])
    const [loading, setLoading] = useState(true)

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

    // Fetch gold price and merge finalPrice
    const fetchGoldPrice = async () => {
        try {
            const { data } = await api.get('/api/product/all-products')
            console.log("data fetch for gold price",data.products.map((f)=>f.finalPrice))

            const updatedProducts = values.results.map(p => {
                const apiProduct = data.products.find(item => item._id === p._id)
                return {
                    ...p,
                    finalPrice: apiProduct ? apiProduct.finalPrice : undefined
                }
            })

            setProductPrice(updatedProducts)
        } catch (error) {
            console.error("Error fetching gold Price", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (values.results.length > 0) {
            fetchGoldPrice()
        } else {
            setLoading(false)
        }
    }, [values.results])

    return (
        <Layout title={"Search Results"}>
            {loading ? (
                <div className='flex justify-center items-center h-80'>
                    <Spin size="large" tip="Searching...."/>
                </div>
            ) : (
                <>
                    <div className='text-center mt-4'>
                        <h1 className='text-2xl font-bold'>Search Results</h1>
                        <h6 className='text-gray-600 mt-2'>
                            {productPrice.length < 1 ? "NO Products Found" : `Found ${productPrice.length}`}
                        </h6>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 mt-6">
                        {productPrice.map((p) => (
                            <div key={p._id} className="border rounded-lg shadow-md overflow-hidden flex flex-col">
                                {/* Slider */}
                                <div className="w-full h-48">
                                    <Slider {...sliderSettings}>
                                        {(Array.isArray(p.image) && p.image.length > 0 ? p.image : ["/default-product.jpg"])
                                            .map((img, index) => (
                                                <img
                                                    key={`${p._id}-${index}`}
                                                    src={img}
                                                    alt={`${p.name}-${index}`}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ))
                                        }
                                    </Slider>
                                </div>

                                {/* Product Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{p.name}</h3>
                                        <p className="text-yellow-600 font-bold text-md mt-1">
                                            {p.finalPrice !== undefined ? p.finalPrice : "N/A"}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-2 truncate">{p.description.substring(0,30)}</p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
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
                </>
            )}
        </Layout>
    )
}

export default Search
