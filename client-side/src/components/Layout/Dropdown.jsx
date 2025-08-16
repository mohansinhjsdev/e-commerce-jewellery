import { useState } from "react";
import { NavLink } from "react-router-dom";

const Dropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Nav Link */}
      <button className="flex items-center gap-1 text-gray-800 hover:text-yellow-500">
        {title} <span className="text-sm">▼</span>
      </button>

      {/* Dropdown Items */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
          <ul className="py-2">
            {items.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.link}
                  className="block px-4 py-2 text-gray-700 hover:bg-yellow-100"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
