import Button from "@/Pages/Admin/Components/Button";
import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onToggleSidebar }) => {
  const { user, setUser } = useAuthStateContext();
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none cursor-pointer transition-colors duration-200"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">{user?.role === "admin" ? "Panel Admin" : "Panel Mahasiswa"}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="relative">
            <Button
              onClick={toggleProfileMenu}
              className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center focus:outline-none cursor-pointer"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </Button>
            <div
              id="profileMenu"
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden z-10 border border-gray-100"
            >
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  confirmLogout(() => {
                    setUser(null);
                    navigate("/");
                  });
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
