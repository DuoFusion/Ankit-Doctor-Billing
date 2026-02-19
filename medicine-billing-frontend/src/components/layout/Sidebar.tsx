import { NavLink } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useMe } from "../../hooks/useMe";


const Sidebar = () => {
  const { data, isLoading } = useMe();

  if (isLoading || !data) return null;

  const role = data.role; // ADMIN | USER

  const links = [
    { name: "Dashboard", path: ROUTES.DASHBOARD, roles: ["ADMIN", "USER"] },
    { name: "Medicines", path: ROUTES.PRODUCTS, roles: ["ADMIN", "USER"] },
    { name: "Companies", path: ROUTES.COMPANIES, roles: ["ADMIN", "USER"] },

    // ADMIN only
    { name: "Users", path: ROUTES.USERS, roles: ["ADMIN"] },

    { name: "Billing", path: ROUTES.BILLING, roles: ["ADMIN", "USER"] },

    // USER + ADMIN
    { name: "Profile", path: ROUTES.PROFILE, roles: ["USER", "ADMIN"] },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
 
      {/* Logo */}
      <div className="text-xl font-bold text-cyan-600 mb-10">
        💊 Medicine Billing
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {links
          .filter(link => link.roles.includes(role))
          .map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                flex items-center px-4 py-2 rounded-md text-sm font-medium transition
                ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600 border-l-4 border-cyan-500"
                    : "text-slate-700 hover:bg-slate-100"
                }
              `
              }
            >
              {link.name}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
