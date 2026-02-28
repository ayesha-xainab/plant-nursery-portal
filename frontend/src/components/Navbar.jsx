import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-green-50 shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img src="/plant.svg" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="text-green-700 font-bold text-lg">Home</span>
      </Link>

      <div className="flex items-center space-x-4">
        {token && role === "customer" && (
          <>
            <Link to="/plants" className="text-green-700 hover:text-green-900">Plants</Link>
            <Link to="/cart" className="text-green-700 hover:text-green-900">Cart</Link>
            <Link to="/rentals" className="text-green-700 hover:text-green-900">My Rentals</Link>
          </>
        )}

        {token && role === "admin" && (
          <>
            <Link to="/admin" className="text-green-700 hover:text-green-900">Admin Dashboard</Link>
            <Link to="/admin/sales" className="text-green-700 hover:text-green-900">Sales</Link>
          </>
        )}

        {!token && (
          <>
            <Link to="/plants" className="text-green-700 hover:text-green-900">Plants</Link>
            <Link to="/help" className="text-green-700 hover:text-green-900">Help</Link>
            <Link to="/login" className="text-green-700 hover:text-green-900">Login</Link>
            <Link to="/register" className="text-green-700 hover:text-green-900">Register</Link>
          </>
        )}

        {token && (
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
