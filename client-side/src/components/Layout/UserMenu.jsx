import React from 'react'
import { NavLink } from 'react-router-dom'

const UserMenu = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">Dashboard</h4>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 ${
              isActive ? "bg-blue-500 text-gray-800 font-semibold" : ""
            }`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 ${
              isActive ? "bg-blue-500 text-gray-800 font-semibold" : ""
            }`
          }
        >
          Orders
        </NavLink>
        
      </nav>
    </div>
  )
}

export default UserMenu
