import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { path: "/", label: "Dashboard" },
    { path: "/assessment", label: "Assessment" },
    { path: "/store", label: "Store" },
    { path: "/profile", label: "Profile" },
    { path: "/admin", label: "Admin" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-cream border-b border-sand sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-botanical rounded-full flex items-center justify-center">
              <span className="text-cream text-xs font-bold">A</span>
            </div>
            <span className="text-botanical font-semibold text-lg tracking-wide">
              AyurGenX
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-botanical border-b-2 border-botanical pb-0.5"
                    : "text-sage hover:text-botanical"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <span className="text-sm text-botanical font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-botanical text-cream text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <span className="text-sm text-botanical font-medium">
              {user?.name || "User"}
            </span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm bg-botanical text-cream px-4 py-1.5 rounded-full hover:bg-sage transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-botanical text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-sand px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-1 ${
                isActive(link.path)
                  ? "text-botanical font-semibold"
                  : "text-sage"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-sage">
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-left text-red-400 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;