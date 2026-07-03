import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { user } = useAuthStateContext();

  const hasPermission = (perm) => {
    return user?.permission?.includes(perm);
  };

  return (
    <aside className={`bg-blue-800 text-white min-h-screen transition-all duration-300 ${isOpen ? "w-20 lg:w-64" : "w-0 overflow-hidden"}`}>
      <div className="p-4 border-b border-blue-700 whitespace-nowrap">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
      </div>
      <nav className="p-4 space-y-2 whitespace-nowrap">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
            }`
          }
        >
          <span>🏠</span>
          <span className="menu-text hidden lg:inline">Dashboard</span>
        </NavLink>

        {hasPermission("mahasiswa.read") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="menu-text hidden lg:inline">Mahasiswa</span>
          </NavLink>
        )}

        {hasPermission("dosen.read") && (
          <NavLink
            to="/admin/dosen"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="menu-text hidden lg:inline">Dosen</span>
          </NavLink>
        )}

        {hasPermission("matakuliah.read") && (
          <NavLink
            to="/admin/matakuliah"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>📚</span>
            <span className="menu-text hidden lg:inline">Mata Kuliah</span>
          </NavLink>
        )}

        {hasPermission("kelas.read") && (
          <NavLink
            to="/admin/kelas"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏫</span>
            <span className="menu-text hidden lg:inline">Kelas</span>
          </NavLink>
        )}

        {hasPermission("rencana-studi.read") && (
          <NavLink
            to="/admin/rencana-studi"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>📝</span>
            <span className="menu-text hidden lg:inline">Rencana Studi</span>
          </NavLink>
        )}

        {hasPermission("users.manage") && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>👤</span>
            <span className="menu-text hidden lg:inline">User Management</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
