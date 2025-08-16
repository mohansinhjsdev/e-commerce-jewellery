import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white py-3">
        <h1 className="text-lg font-semibold text-center">
          All Right Reserved &copy; CompanyName
        </h1>
        <div className="flex justify-center gap-6 mt-3">
          <Link 
          className="hover:text-yellow-400 transition-colors duration-200"
          to="/about">About</Link>
          <Link 
          className="hover:text-yellow-400 transition-colors duration-200"
          to="/contact">Contact</Link>
          <Link 
          className="hover:text-yellow-400 transition-colors duration-200"
          to="/policy">Privacy Policy</Link>
          </div>
      </footer>
    </>
  );
};

export default Footer;
