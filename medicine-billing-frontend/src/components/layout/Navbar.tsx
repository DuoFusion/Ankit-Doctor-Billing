import { useAuth } from "../../hooks/useAuth";
import { useMe } from "../../hooks/useMe";

const Navbar = () => {
  const { logout } = useAuth();
  const { data: me } = useMe();

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* Left */}
      <h1 className="text-xl font-bold text-cyan-600">
        💊 Medicine Billing System
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        {me && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {me.name}
            </p>
            <p className="text-xs text-gray-500">
              {me.role}
            </p>
          </div>
        )}

        <button
          onClick={() => logout()}
          className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
