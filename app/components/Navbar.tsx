import { Link } from "react-router";
import { useAuthStore } from "~/lib/store";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Welcome, {user?.name || user?.email}
            </span>
            <Link to="/upload" className="primary-button w-fit text-sm">
              Upload Resume
            </Link>
            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth" className="primary-button w-fit text-sm">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
