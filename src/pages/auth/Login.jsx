import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { motion } from "framer-motion";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Dummy login — dispatch to Redux
    dispatch(login({
      name: formData.email === "admin@ayurgenx.com" ? "Admin" : "Rathod Umesh",
      email: formData.email,
      role: formData.email === "admin@ayurgenx.com" ? "admin" : "user",
    }));

    setSuccess(true);
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white border border-sand rounded-2xl p-8 shadow-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-botanical rounded-full flex items-center justify-center">
            <span className="text-cream text-sm font-bold">A</span>
          </div>
          <span className="text-botanical font-semibold text-xl tracking-wide">
            AyurGenX
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-botanical mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-sage mb-6">
          Sign in to your wellness journey
        </p>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 px-4 py-3 bg-tea/30 border border-tea rounded-lg text-botanical text-sm"
          >
            Login successful! Redirecting...
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-botanical">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200 bg-cream
                ${errors.email
                  ? "border-red-400 focus:border-red-400"
                  : "border-sand focus:border-botanical"
                }`}
            />
            {errors.email && (
              <span className="text-red-400 text-xs">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-botanical">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="*********"
              className={`px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200 bg-cream
                ${errors.password
                  ? "border-red-400 focus:border-red-400"
                  : "border-sand focus:border-botanical"
                }`}
            />
            {errors.password && (
              <span className="text-red-400 text-xs">{errors.password}</span>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-botanical text-cream py-2.5 rounded-lg text-sm font-medium hover:bg-sage transition-colors duration-200 mt-1"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-sm text-sage text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-botanical font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;