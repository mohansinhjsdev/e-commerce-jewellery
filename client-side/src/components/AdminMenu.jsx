import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">Admin Panel</h4>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard/admin/create-category"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 ${
              isActive ? "bg-blue-500 text-gray-800 font-semibold" : ""
            }`
          }
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 ${
              isActive ? "bg-blue-500 text-gray-800 font-semibold" : ""
            }`
          }
        >
          Create Product
        </NavLink>

        <NavLink
          to="/dashboard/admin/product"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-gray-800 hover:bg-blue-100 ${
              isActive ? "bg-blue-500 text-gray-800 font-semibold" : ""
            }`
          }
        >
         All Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/users"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-gray-800 hover:bg-blue-100 ${
              isActive ? "bg-blue-500 text-gray-800 font-semibold" : ""
            }`
          }
        >
          Users
        </NavLink>
       
      </nav>
    </div>
  );
};

export default AdminMenu;
