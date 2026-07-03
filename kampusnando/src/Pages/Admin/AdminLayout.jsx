import { useState } from "react";
import Sidebar from "@/Pages/Admin/Components/Sidebar";
import Header from "@/Pages/Admin/Components/Header";
import Footer from "@/Pages/Admin/Components/Footer";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1 min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
