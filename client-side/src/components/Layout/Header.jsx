import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import { useAuth } from "../../context/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });

    localStorage.removeItem("auth");
    toast.success("Logout Successfully", { position: "top-center" });
    setTimeout(() => {
      navigate("/login"); // Or use navigate("/login")
    }, 1500);
  };

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center text-lg font-semibold gap-2"
          >
            <FaBagShopping className="text-yellow-600 text-xl" />
            <span>Ecommerce</span>
          </Link>

          {/* Center: Search (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full max-w-md p-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Right: Menu + Cart */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
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
              <li>
                <NavLink
                  to="/category"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-600"
                      : "hover:text-yellow-600 transition duration-300"
                  }
                >
                  Category
                </NavLink>
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

              {/* // auth user if user login or logout */}
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
                <>
                  <li className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="navbar hover:text-yellow-600 flex items-center gap-1 cursor-pointer"
                    >
                      {auth?.user?.name || "Account"} ▼
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg z-50">
                        <NavLink
                          to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </NavLink>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                </>
              )}
            </ul>

            {/* Cart */}
            <NavLink to="/cart" className="relative text-lg">
              🛒
              <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full px-1">
                0
              </span>
            </NavLink>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
          </div>
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
                <NavLink to="/category" onClick={() => setIsMenuOpen(false)}>
                  Category
                </NavLink>
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
                    <NavLink
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}
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
