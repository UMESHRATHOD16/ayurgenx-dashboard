import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Pages
import UserProfile from "./pages/profile/UserProfile";
import Assessment from "./pages/assessment/Assessments";
import Dashboard from "./pages/dashboard/Dashboard";

// Store
import ProductList from "./pages/store/ProductList";
import ProductDetail from "./pages/store/ProductDetail";
import Cart from "./pages/store/Cart";
import OrderSummary from "./pages/store/OrderSummary";

// Admin
import AdminPreview from "./pages/admin/AdminPreview";

// Layout
import Navbar from "./components/layout/Navbar";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />

        {/* Store Routes */}
        <Route path="/store" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/store/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/order-summary" element={<ProtectedRoute><OrderSummary /></ProtectedRoute>} />

        {/* Admin Route */}
        <Route path="/admin" element={<ProtectedRoute><AdminPreview /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;