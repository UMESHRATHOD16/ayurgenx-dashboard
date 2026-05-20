import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const lifestyleOptions = ["Student", "Working Professional", "Founder", "Homemaker"];
const wellnessGoals = ["Stress", "Sleep", "Digestion", "Weight", "Detox", "Energy"];

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isProfileComplete = user?.age && user?.gender && user?.lifestyle && user?.wellnessGoal;

  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    lifestyle: user?.lifestyle || "",
    wellnessGoal: user?.wellnessGoal || "",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => {
      setSaved(false);
      if (!isProfileComplete) navigate("/assessment");
    }, 2500);
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div
        className="max-w-xl mx-auto bg-white border rounded-2xl p-8 shadow-sm"
        style={{ borderColor: "#DCCFB8" }}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "#556B4F" }}>
            {isEditing ? (isProfileComplete ? "Edit Profile" : "Setup Profile") : "My Profile"}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CAF88" }}>
            {isEditing ? "Update your wellness details" : "Your personal wellness summary"}
          </p>
        </div>

        {/* Success */}
        {saved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#A8B79E30", border: "1px solid #A8B79E", color: "#556B4F" }}
          >
              Profile saved successfully!
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* ── PROFILE VIEW ── */}
          {!isEditing && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar Banner */}
              <div
                className="rounded-2xl p-6 mb-6 flex items-center gap-5"
                style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 cursor-pointer"
                  style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: "#F5F1E8" }}>
                    {user?.name}
                  </h2>
                  <p className="text-sm opacity-80" style={{ color: "#F5F1E8" }}>
                    {user?.email}
                  </p>
                  <span
                    className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
                  >
                    {user?.lifestyle || "Lifestyle not set"}
                  </span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: "#9CAF88" }}>Age</p>
                  <p className="text-lg font-bold" style={{ color: "#556B4F" }}>
                    {user?.age || "—"}
                    <span className="text-sm font-normal ml-1" style={{ color: "#9CAF88" }}>
                      {user?.age ? "yrs" : ""}
                    </span>
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: "#9CAF88" }}>Gender</p>
                  <p className="text-lg font-bold" style={{ color: "#556B4F" }}>
                    {user?.gender || "—"}
                  </p>
                </div>

                {/* Wellness Goal - full width */}
                <div
                  className="col-span-2 p-4 rounded-xl border flex items-center gap-4"
                  style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
                >

                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: "#9CAF88" }}>
                      Wellness Goal
                    </p>
                    <p className="text-base font-semibold" style={{ color: "#556B4F" }}>
                      {user?.wellnessGoal || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer"
                  style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/assessment")}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                >
                  Assessment →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── EDIT FORM ── */}
          {isEditing && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rathod Umesh"
                    className="px-4 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8", color: "#556B4F" }}
                  />
                </div>

                {/* Age */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" style={{ color: "#556B4F" }}>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="21"
                    className="px-4 py-2.5 rounded-lg border text-sm outline-none"
                    style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8", color: "#556B4F" }}
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "#556B4F" }}>Gender</label>
                  <div className="flex gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleSelect("gender", g)}
                        className="flex-1 py-2 rounded-lg border text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: formData.gender === g ? "#556B4F" : "#F5F1E8",
                          borderColor: formData.gender === g ? "#556B4F" : "#DCCFB8",
                          color: formData.gender === g ? "#F5F1E8" : "#556B4F",
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                    Lifestyle Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {lifestyleOptions.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => handleSelect("lifestyle", l)}
                        className="py-2 rounded-lg border text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: formData.lifestyle === l ? "#556B4F" : "#F5F1E8",
                          borderColor: formData.lifestyle === l ? "#556B4F" : "#DCCFB8",
                          color: formData.lifestyle === l ? "#F5F1E8" : "#556B4F",
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wellness Goal */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                    Wellness Goal
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {wellnessGoals.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleSelect("wellnessGoal", goal)}
                        className="py-2 rounded-lg border text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: formData.wellnessGoal === goal ? "#556B4F" : "#F5F1E8",
                          borderColor: formData.wellnessGoal === goal ? "#556B4F" : "#DCCFB8",
                          color: formData.wellnessGoal === goal ? "#F5F1E8" : "#556B4F",
                        }}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-1">
                  {isProfileComplete && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all"
                      style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
                    >
                      Cancel
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                  >
                    Save Profile
                  </motion.button>
                </div>

              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;