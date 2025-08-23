import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({path = "login"}) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((preValue) => --preValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location,path]);
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
        <h1 className="text-lg font-semibold mt-2">
          Please wait, redirecting you to login in {count} seconds.
        </h1>
      </div>
    </>
  );
};

export default Spinner;
