import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import { useAuth } from "../../context/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/Cart";

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const categories = useCategory();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const navigate = useNavigate();
  const [cart] = useCart();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully", { position: "top-center" });
    navigate("/login"); 
  };

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center text-lg font-semibold gap-2">
            <FaBagShopping className="text-yellow-600 text-xl" />
            <span>Bhikha Bhai Jwery</span>
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center mx-4">
            <SearchInput />
          </div>

          {/* Right side (Cart + Hamburger) */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Cart Icon */}
            <NavLink
              to="/cart-page"
              className="relative text-lg text-gray-800"
            >
              🛒
              <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full px-1">
                {cart?.length}
              </span>
            </NavLink>

            {/* Hamburger for Mobile */}
            <button
              className="md:hidden p-2 text-gray-700 text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Search (Mobile inside Menu) */}
        {isMenuOpen && (
          <div className="md:hidden px-4 py-2">
            <SearchInput />
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-600"
                    : "hover:text-yellow-600 transition duration-300"
                }
              >
                Home
              </NavLink>
            </li>

            {/* Categories Dropdown */}
            <li className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="hover:text-yellow-600 flex items-center gap-1 cursor-pointer"
              >
                CATEGORIES ▼
              </button>
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <NavLink
                    to="/categories"
                    className="block px-4 py-2 font-semibold text-yellow-600 hover:bg-gray-100"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    All Categories
                  </NavLink>
                  {categories.map((c) => (
                    <NavLink
                      key={c._id}
                      to={`/category/${c._id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {c.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-600"
                    : "hover:text-yellow-600 transition duration-300"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-600"
                    : "hover:text-yellow-600 transition duration-300"
                }
              >
                Contact
              </NavLink>
            </li>

            {/* Auth Links */}
            {!auth.user ? (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-600"
                        : "hover:text-yellow-600 transition duration-300"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive
                        ? "text-yellow-600"
                        : "hover:text-yellow-600 transition duration-300"
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="navbar hover:text-yellow-600 flex items-center gap-1 cursor-pointer"
                >
                  {auth?.user?.name || "Account"} ▼
                </button>
                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg z-50">
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsAccountOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-50 shadow-md">
            <ul className="flex flex-col items-center gap-4 py-4 text-sm font-medium">
              <li>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                  className="flex justify-between items-center w-full font-semibold hover:text-yellow-600"
                >
                  Categories
                  <span>{isMobileCategoryOpen ? "▲" : "▼"}</span>
                </button>
                {isMobileCategoryOpen && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {categories.map((c) => (
                      <li key={c._id}>
                        <NavLink
                           to={`/category/${c._id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block hover:text-yellow-600"
                        >
                          {c.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </NavLink>
              </li>
              {!auth.user ? (
                <>
                  <li>
                    <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
