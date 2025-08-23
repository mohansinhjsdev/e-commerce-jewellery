import React from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/AdminMenu';
import { useAuth } from '../../context/Auth';

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                <span className="font-medium text-gray-600">Name</span>
                <span className="text-gray-900">{auth?.user?.name}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-gray-900">{auth?.user?.email}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                <span className="font-medium text-gray-600">Phone</span>
                <span className="text-gray-900">{auth?.user?.number}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
