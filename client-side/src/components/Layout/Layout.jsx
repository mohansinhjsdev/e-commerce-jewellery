import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from 'react-toastify';

const Layout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="fixed top-0 left-0 right-0 z-50"/>
      <main className="flex-grow min-h-[85vh] pt-[65px] sm:pt-[65px">
        <ToastContainer position="top-center" autoClose={1500}/>
        {children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
