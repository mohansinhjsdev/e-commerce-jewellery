import React from "react";
import Layout from "../../components/Layout/Layout"
import { Link } from "react-router-dom";
import { useCart } from "../../context/Cart";

const OrderSuccess = () => {
  const [cart] = useCart();

  // total calculate
  const totalPrice = cart?.reduce((acc, item) => {
    const price = parseFloat(item.finalPrice.replace(/[^0-9.]/g, ""));
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <Layout title="Order Successful">
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your order has been placed successfully. You will receive an email confirmation shortly.
        </p>

        {/* Order Summary */}
        <div className="bg-white shadow rounded-lg p-4 w-full max-w-md mb-6">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          <ul className="space-y-2">
            {cart?.map((item, i) => (
              <li key={i} className="flex justify-between text-gray-700">
                <span>{item.name}</span>
                <span className="font-medium text-yellow-600">
                  {item.finalPrice}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-3 mt-3 text-lg font-semibold">
            <span>Total:</span>
            <span className="text-green-600">
              {totalPrice.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
        </div>

        <Link
          to="/dashboard/user/orders"
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Go to My Orders
        </Link>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
