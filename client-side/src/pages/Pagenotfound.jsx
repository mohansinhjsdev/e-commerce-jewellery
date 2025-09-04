import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const PageNotFound = () => {
  return (
    <Layout title="404 - Page Not Found">
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <h1 className="text-6xl font-bold text-blue-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition"
        >
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
};

export default PageNotFound;
