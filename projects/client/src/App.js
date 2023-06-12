import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Homepage from "./pages/client/Homepage";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import ProductOrder from "./pages/ProductOrder";
import ProductReport from "./pages/ProductReport";
import LoginClient from "./pages/client/auth/Login";
import VerificationAuth from "./pages/client/auth/Verification";
import Profile from "./pages/client/Profile";
import { useDispatch } from "react-redux";
import storage from "./helper/Storage";
import { KeepUser } from "./features/auth/slice/UserSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      dispatch(KeepUser(token));
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/*Auth User Route*/}
        <Route path="/client" element={<LoginClient />} />
        <Route path="/verify/:token" element={<VerificationAuth />} />

        {/*User Route*/}
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Profile />} />

        {/*Admin Route*/}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/dashboard/user-management" element={<UserManagement />} />
        <Route path="admin/dashboard/product-management" element={<ProductManagement />} />
        <Route path="admin/dashboard/order" element={<ProductOrder />} />
        <Route path="admin/dashboard/report" element={<ProductReport />} />
      </Routes>
    </div>
  );
}

export default App;
