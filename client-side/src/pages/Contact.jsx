import React from "react";
import Layout from "../components/Layout/Layout";

const Contact = () => {
  return (
    <Layout title="Contact Us - Bhikha Bhai">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
         
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Phone:</span> +91 1234567890
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">Email:</span>{" "}
              info@bhikhabhaijewelry.com
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">Address:</span> Bhikha Bhai Jewelry,
              Rajasthan
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <img
              src="/src/assets/Jwe.jpg" 
              alt="Contact Bhikha Bhai Jewelry"
              className="rounded-lg shadow-md w-full max-w-sm sm:max-w-md"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
