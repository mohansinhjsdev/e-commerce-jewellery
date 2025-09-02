import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title="All Categories">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">All Categories</h1>
        
        {categories.length === 0 ? (
          <p className="text-center text-gray-600">No categories available</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {console.log("Categories:", categories)}
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c._id}`}
                className="block bg-white shadow hover:shadow-lg transition rounded-lg p-4 text-center border hover:border-blue-500"
              >
                <h2 className="text-lg font-semibold text-gray-800 capitalize">{c.name}</h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
