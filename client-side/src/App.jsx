import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "../src/components/Layout/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoutes from "./pages/Admin/AdminRoutes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Users from "../src/pages/Admin/Users";
import CreateProducts from "./pages/Admin/CreateProducts";
import CreateCategory from "./pages/Admin/CreateCategory";
import Profile from "./pages/user/Profile";
import Order from "./pages/user/Order";
import Product from "./pages/Admin/Product";
import UpdateProducts from "./pages/Admin/UpdateProducts";




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile/>}/>
          <Route path="user/orders" element={<Order/>}/>
        </Route>
        <Route path="/dashboard" element={<AdminRoutes />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-product" element={<CreateProducts/>}/>
          <Route path="admin/create-category" element={<CreateCategory/>}/>
          <Route path="admin/users" element={<Users/>}/>
          <Route path="admin/product" element={<Product/>}/>
          <Route path="admin/products/:id" element={<UpdateProducts/>}/>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
