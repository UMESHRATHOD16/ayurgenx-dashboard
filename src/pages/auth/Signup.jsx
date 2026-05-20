import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { motion } from "framer-motion";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    // Dummy signup — dispatch to Redux
    dispatch(login({
      name: formData.name,
      email: formData.email,
    }));

    setSuccess(true);
    setTimeout(() => navigate("/profile"), 1000);
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Rathod Umesh" },
    { name: "email", label: "Email", type: "text", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "" },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "" },
  ];

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
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#556B4F" }}>
            <span className="text-sm font-bold" style={{ color: "#F5F1E8" }}>A</span>
          </div>
          <span className="font-semibold text-xl tracking-wide"
            style={{ color: "#556B4F" }}>
            AyurGenX
          </span>
        </div>

        <h1 className="text-2xl font-semibold mb-1" style={{ color: "#556B4F" }}>
          Create account
        </h1>
        <p className="text-sm mb-6" style={{ color: "#9CAF88" }}>
          Begin your wellness journey today
        </p>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#A8B79E30", border: "1px solid #A8B79E", color: "#556B4F" }}
          >
              Account created! Setting up your profile...
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200"
                style={{
                  backgroundColor: "#F5F1E8",
                  borderColor: errors[field.name] ? "#f87171" : "#DCCFB8",
                  color: "#556B4F",
                }}
              />
              {errors[field.name] && (
                <span className="text-red-400 text-xs">{errors[field.name]}</span>
              )}
            </div>
          ))}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 mt-1 hover:opacity-90"
            style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
          >
            Create Account
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "#9CAF88" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium hover:underline"
            style={{ color: "#556B4F" }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;