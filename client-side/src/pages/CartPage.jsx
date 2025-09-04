import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { Modal } from "antd";

const CartPage = () => {
  const [cart, setCart] = useCart();
  console.log("cart", cart);
  const [auth] = useAuth();
  const navigate = useNavigate();

  //modal stats
  const [visible,setVisible]=useState(false)
  const [phone,setPhone] = useState("")

  const removeItem = (id) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === id);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //handle Payment Success
  const handlePayment=()=>{
    if(!phone || phone.length < 10){
      toast.error("Please Enter a valid phone Number")
      return ;
    }
    setVisible(false)
    toast.success("Payment Success")
    navigate('/orders-success')
  }

  return (
    <Layout title={"Cart Page"}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold mb-6">
            {`Hello ${auth?.token && auth?.user?.name}`}
          </h1>
          <h4 className="text-center text-xl">
            {cart?.length
              ? `You Have ${cart.length} items in your cart. ${
                  auth?.token ? "" : "Please Login to Checkout"
                }`
              : "Your Cart Is Empty"}
          </h4>
        </div>

        {/* //Row */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            {cart?.length === 0 ? (
              <p className="text-gray-500">No items in your cart</p>
            ) : (
              <div className="space-y-4">
                {cart?.map((p, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={
                          p.image && p.image.length > 0
                            ? p.image[0]
                            : "/default-product.jpg"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <span>{p.name}</span>
                    <span className="font-bold text-yellow-600">
                      {p.finalPrice}
                    </span>

                    <button
                      onClick={() => removeItem(p._id)}
                      className="text-red-500 hover:text-red-700 text-2xl transition-transform transform hover:scale-110"
                      title="Remove Item"
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* //Payment */}
          <div className="md:w-1/4 bg-white p-4 rounded shadow">
            <h1 className="text-xl font-semibold mb-4">Checkout | Payment</h1>

            {/* //total items */}
            <div className="flex justify-between mb-4 text-gray-700">
              <span className="font-medium">Total Items:</span>
              <span className="font-semibold">{cart?.length}</span>
            </div>

            {/* total Price */}

            <div className="flex justify-between mb-6 text-gray-700">
              <span className="font-medium">Total Price:</span>
              <span className="font-bold text-yellow-600 text-lg">
                {cart?.length > 0
                  ? cart
                      .reduce((acc, item) => {
                        const price = parseFloat(
                          item.finalPrice.replace(/[^0-9.]/g, "")
                        );
                        return acc + (isNaN(price) ? 0 : price);
                      }, 0)
                      .toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })
                  : "Not Available"}
              </span>
            </div>

            {/* address Section */}
            <div className="border-t border-gray-200 pt-4">
              {auth?.user?.address ? (
                <>
                  <div>
                    <h4 className="text-gray-700 font-semibold mb-1">
                      Current Address
                    </h4>
                    <p className="text-gray-600 mb-3">{auth?.user?.address}</p>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="w-full py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  {auth?.token ? (
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="w-full py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
                    >
                      Add Address
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart-page",
                        })
                      }
                      className="w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                    >
                      Please Login to Checkout
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Payment Button */}
            
            <div className="mt-2">
            <button
              disabled={
                cart.length === 0 || !auth?.token || !auth?.user?.address
              }
              onClick={() => setVisible(true)}
              className={`w-full py-3 font-semibold rounded-lg transition ${
                cart.length === 0 || !auth?.token || !auth?.user?.address
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              Confirm Payment
            </button>
            </div>
          </div>
        </div>
      </div>  
      {/* Payment Model */}
      <Modal
      title="Enter Your Phone Number"
      visible={visible}
      onCancel={()=>setVisible(false)}
      onOk={handlePayment}
      okText="Pay Now"
      >
        <input 
        placeholder="Enter Your Number"
        value={phone}
        maxLength={10}
        onChange={(e)=>setPhone(e.target.value)}
         />
      </Modal>
    </Layout>
  );
};

export default CartPage;
