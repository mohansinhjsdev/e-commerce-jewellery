import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from 'react-toastify';

const Layout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="pt-15.5 min-h-[85vh] flex-grow">
        <ToastContainer position="top-center" autoClose={1500}/>
        {children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
