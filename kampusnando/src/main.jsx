import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";

import Login from "@/Pages/Auth/Login/Login";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen";
import DosenDetail from "@/Pages/Admin/DosenDetail/DosenDetail";
import UserManagement from "@/Pages/Admin/User/UserManagement";
import PageNotFound from "@/Pages/Error/PageNotFound";
import Unauthorized from "@/Pages/Error/Unauthorized";
import { AuthProvider } from "@/Utils/Contexts/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        element: (
          <ProtectedRoute requiredPermission="mahasiswa.read">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Mahasiswa />,
          },
          {
            path: ":nim",
            element: <MahasiswaDetail />,
          },
        ],
      },
      {
        path: "dosen",
        element: (
          <ProtectedRoute requiredPermission="dosen.read">
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dosen />,
          },
          {
            path: ":id",
            element: <DosenDetail />,
          },
        ],
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredPermission="users.manage">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
