import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Body Section */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
