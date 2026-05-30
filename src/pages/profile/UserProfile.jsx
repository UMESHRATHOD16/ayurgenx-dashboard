import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { FiUsers } from "react-icons/fi";
import { FiBriefcase } from "react-icons/fi";
import { FiTarget } from "react-icons/fi";
import { FiCheckSquare } from "react-icons/fi";
import { FiCheckCircle } from "react-icons/fi";

const lifestyleOptions = [
  { label: "Student", desc: "Currently enrolled in college or university" },
  { label: "Working Professional", desc: "Full time or part time employed" },
  { label: "Founder", desc: "Running or building your own venture" },
  { label: "Homemaker", desc: "Managing home and family full time" },
];

const wellnessGoals = [
  { label: "Stress", icon: "🧘" },
  { label: "Sleep", icon: "😴" },
  { label: "Digestion", icon: "🌿" },
  { label: "Weight", icon: "⚖️" },
  { label: "Detox", icon: "✨" },
  { label: "Energy", icon: "⚡" },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isProfileComplete =
    user?.age && user?.gender && user?.lifestyle && user?.wellnessGoal;

  const [isEditing, setIsEditing] = useState(!isProfileComplete);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    lifestyle: user?.lifestyle || "",
    wellnessGoal: user?.wellnessGoal || "",
  });

  const totalSteps = 5;

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      dispatch(updateProfile(formData));
      setSaving(false);
      setStep(6);
    }, 900);
  };

  const handleEditSave = () => {
    setSaving(true);
    setTimeout(() => {
      dispatch(updateProfile(formData));
      setSaving(false);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }, 900);
  };

  // if profile exists show static view
  if (!isEditing) {
    return (
      <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
        <div
          className="max-w-3xl mx-auto bg-white border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          style={{ borderColor: "#DCCFB8" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Success */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 px-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: "#A8B79E30",
                    border: "1px solid #A8B79E",
                    color: "#556B4F",
                  }}
                >
                  Profile updated successfully
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-6 mb-6 flex items-center gap-5"
              style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold"
                  style={{ color: "#F5F1E8" }}
                >
                  {user?.name}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm opacity-80"
                  style={{ color: "#F5F1E8" }}
                >
                  {user?.email}
                </motion.p>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
                >
                  {user?.lifestyle || "Lifestyle not set"}
                </motion.span>
              </div>
            </motion.div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Profile", value: "100%" },
                  { label: "Goal", value: user?.wellnessGoal || "—" },
                  { label: "Lifestyle", value: user?.lifestyle || "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-xl text-center"
                    style={{
                      backgroundColor: "#F5F1E8",
                      border: "1px solid #DCCFB8",
                    }}
                  >
                    <p
                      className="text-xs mb-1"
                      style={{ color: "#9CAF88" }}
                    >
                      {item.label}
                    </p>

                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#556B4F" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Age", value: user?.age, suffix: user?.age ? " yrs" : "" },
                { label: "Gender", value: user?.gender },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 32px rgba(85,107,79,0.13)",
                    backgroundColor: "#EEF2EA",
                  }}
                  className="p-4 rounded-xl border cursor-default"
                  style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
                >
                  <p className="text-xs font-medium mb-1" style={{ color: "#9CAF88" }}>
                    {item.label}
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#556B4F" }}>
                    {item.value || "—"}
                    <span className="text-sm font-normal" style={{ color: "#9CAF88" }}>
                      {item.suffix}
                    </span>
                  </p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 32px rgba(85,107,79,0.13)",
                  backgroundColor: "#EEF2EA",
                }}
                className="col-span-2 p-4 rounded-xl border flex items-center gap-4 cursor-default"
                style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
              >
                <span className="text-3xl">
                  {wellnessGoals.find((g) => g.label === user?.wellnessGoal)?.icon || "🌿"}
                </span>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "#9CAF88" }}>
                    Wellness Goal
                  </p>
                  <p className="text-base font-semibold" style={{ color: "#556B4F" }}>
                    {user?.wellnessGoal || "—"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02,  y: -3, }}
                onClick={() => {
                  setStep(1);
                  setIsEditing(true);
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer"
                style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
              >
                Edit Profile →
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02,  y: -3, }}
                onClick={() => navigate("/assessment")}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
                style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
              >
                Assessment Report →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Onboarding flow
  return (
    <div className="min-h-screen px-4 py-10 flex flex-col" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1">

        {/* Progress bar — only show during steps 1-5 */}
        {step >= 1 && step <= 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex justify-between text-xs mb-2" style={{ color: "#9CAF88" }}>
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% complete</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#DCCFB8" }}>
              <motion.div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: "#556B4F" }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Steps */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={direction}>

            {/* Step 0 — Welcome */}
            {step === 0 && (
              <motion.div
                key="welcome"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold"
                  style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)", color: "#F5F1E8" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold mb-3"
                  style={{ color: "#556B4F" }}
                >
                  Welcome, {user?.name?.split(" ")[0]}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm mb-10 leading-relaxed max-w-sm mx-auto"
                  style={{ color: "#9CAF88" }}
                >
                  Let us personalise your wellness journey. It only takes a minute to set up your profile.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={goNext}
                  className="px-10 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                >
                  Let us Get Started
                </motion.button>
              </motion.div>
            )}

            {/* Step 1 — Name and Age */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-5xl mb-4"
                >
                  <div className="mb-4">
                  <FiUser
                    size={42}
                    style={{ color: "#556B4F" }}
                  />
                </div> Basic Details
                </motion.div>
                <p className="text-sm mb-8" style={{ color: "#9CAF88" }}>
                  Tell us a little about yourself
                </p>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Rathod Umesh"
                      className="px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
                      style={{ backgroundColor: "white", borderColor: "#DCCFB8", color: "#556B4F" }}
                      onFocus={(e) => (e.target.style.borderColor = "#556B4F")}
                      onBlur={(e) => (e.target.style.borderColor = "#DCCFB8")}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                      Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => {
                      const value = e.target.value;

                      if (value === "" || (Number(value) >= 1 && Number(value) <= 120)) {
                        setFormData({
                          ...formData,
                          age: value,
                        });
                        }
                      }}
                      placeholder="21"
                      className="px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200"
                      style={{ backgroundColor: "white", borderColor: "#DCCFB8", color: "#556B4F" }}
                      onFocus={(e) => (e.target.style.borderColor = "#556B4F")}
                      onBlur={(e) => (e.target.style.borderColor = "#DCCFB8")}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={goBack}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: "#DCCFB8", color: "#9CAF88", backgroundColor: "white" }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={goNext}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                  >
                    Continue
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Gender */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}

                className="text-5xl mb-4"
              >
                <div className="mb-4">
                <FiUsers
                  size={42}
                  style={{ color: "#556B4F" }}
                />
              </div> Gender
              </motion.div>
                <p className="text-sm mb-8" style={{ color: "#9CAF88" }}>
                  This helps us personalise your wellness plan
                </p>

                <div className="flex flex-col gap-3">
                  {["Male", "Female", "Other"].map((g) => (
                    <motion.button
                      key={g}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{
                        y: -5,
                        scale: 1.02,
                      }}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className="w-full py-4 rounded-xl border text-sm font-semibold transition-all duration-20 cursor-pointer"
                      style={{
                        backgroundColor: formData.gender === g ? "#556B4F" : "white",
                        borderColor: formData.gender === g ? "#556B4F" : "#DCCFB8",
                        color: formData.gender === g ? "#F5F1E8" : "#556B4F",
                        boxShadow: formData.gender === g
                          ? "0 8px 24px rgba(85,107,79,0.2)"
                          : "none",
                      }}
                    >
                      {g}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={goBack}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: "#DCCFB8", color: "#9CAF88", backgroundColor: "white" }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{
                        y: -5,
                        scale: 1.02,
                      }}
                    onClick={goNext}
                    disabled={!formData.gender}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                    style={{
                      backgroundColor: formData.gender ? "#556B4F" : "#DCCFB8",
                      color: formData.gender ? "#F5F1E8" : "#9CAF88",
                    }}
                  >
                    Continue
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Lifestyle */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-5xl mb-4"
                >
                  <div className="mb-4">
                  <FiBriefcase
                    size={42}
                    style={{ color: "#556B4F" }}
                  />
                </div> Your Lifestyle
                </motion.div>
                <p className="text-sm mb-8" style={{ color: "#9CAF88" }}>
                  Which best describes your current life situation
                </p>

                <div className="flex flex-col gap-3">
                  {lifestyleOptions.map((l) => (
                    <motion.button
                      key={l.label}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{
                        y: -5,
                        scale: 1.02,
                      }}
                      onClick={() => setFormData({ ...formData, lifestyle: l.label })}
                      className="w-full p-4 rounded-xl border text-left transition-all duration-20 cursor-pointer"
                      style={{
                        backgroundColor: formData.lifestyle === l.label ? "#556B4F" : "white",
                        borderColor: formData.lifestyle === l.label ? "#556B4F" : "#DCCFB8",
                        boxShadow: formData.lifestyle === l.label
                          ? "0 8px 24px rgba(85,107,79,0.2)"
                          : "none",
                      }}
                    >
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: formData.lifestyle === l.label ? "#F5F1E8" : "#556B4F" }}
                      >
                        {l.label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: formData.lifestyle === l.label ? "#A8B79E" : "#9CAF88" }}
                      >
                        {l.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={goBack}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: "#DCCFB8", color: "#9CAF88", backgroundColor: "white" }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={goNext}
                    disabled={!formData.lifestyle}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: formData.lifestyle ? "#556B4F" : "#DCCFB8",
                      color: formData.lifestyle ? "#F5F1E8" : "#9CAF88",
                    }}
                  >
                    Continue
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 4 — Wellness Goal */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-5xl mb-4"
                >
                  <div className="mb-4">
                  <FiTarget
                    size={42}
                    style={{ color: "#556B4F" }}
                  />
                </div> Wellness Goal
                </motion.div>
                <p className="text-sm mb-8" style={{ color: "#9CAF88" }}>
                  What do you most want to improve right now
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {wellnessGoals.map((goal) => (
                    <motion.button
                      key={goal.label}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{
                          y: -5,
                          scale: 1.02,
                        }}
                      onClick={() => setFormData({ ...formData, wellnessGoal: goal.label })}
                      className="p-5 rounded-xl border text-center transition-all duration-20 cursor-pointer"
                      style={{
                        backgroundColor: formData.wellnessGoal === goal.label ? "#556B4F" : "white",
                        borderColor: formData.wellnessGoal === goal.label ? "#556B4F" : "#DCCFB8",
                        boxShadow: formData.wellnessGoal === goal.label
                          ? "0 8px 24px rgba(85,107,79,0.2)"
                          : "none",
                      }}
                    >
                      <p className="text-2xl mb-2">{goal.icon}</p>
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: formData.wellnessGoal === goal.label ? "#F5F1E8" : "#556B4F",
                        }}
                      >
                        {goal.label}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={goBack}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: "#DCCFB8", color: "#9CAF88", backgroundColor: "white" }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={goNext}
                    disabled={!formData.wellnessGoal}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: formData.wellnessGoal ? "#556B4F" : "#DCCFB8",
                      color: formData.wellnessGoal ? "#F5F1E8" : "#9CAF88",
                    }}
                  >
                    Continue
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 5 — Review */}
            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35 }}
              >
               <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-2xl font-bold mb-1"
                >
                  <div className="mb-4">
                  <FiCheckSquare
                    size={42}
                    style={{ color: "#556B4F" }}
                  />
                </div> Looks Good ?
                </motion.div>
                <p className="text-sm mb-6" style={{ color: "#9CAF88" }}>
                  Review your details before we personalise your experience
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { label: "Name", value: formData.name },
                    { label: "Age", value: formData.age ? `${formData.age} years` : "" },
                    { label: "Gender", value: formData.gender },
                    { label: "Lifestyle", value: formData.lifestyle },
                    { label: "Wellness Goal", value: formData.wellnessGoal },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center justify-between p-4 rounded-xl border"
                      style={{ backgroundColor: "white", borderColor: "#DCCFB8" }}
                    >
                      <span className="text-xs font-medium" style={{ color: "#9CAF88" }}>
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: "#556B4F" }}>
                        {item.value || "Not set"}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={goBack}
                    whileHover={{
                          y: -5,
                          scale: 1.02,
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer"
                    style={{ borderColor: "#DCCFB8", color: "#9CAF88", backgroundColor: "white" }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{
                          y: -5,
                          scale: 1.02,
                    }}
                    onClick={isProfileComplete ? handleEditSave : handleSave}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all cusror-pointer"
                    style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 6 — Done */}
            {step === 6 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)" }}
                >
                  <span className="text-2xl font-bold" style={{ color: "#F5F1E8" }}>
                    ✓
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                  style={{ color: "#556B4F" }}
                >
                  Profile Complete
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm mb-10 leading-relaxed"
                  style={{ color: "#9CAF88" }}
                >
                  Your wellness journey begins now. Take your first assessment to get your personalised report.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate("/assessment")}
                  className="px-10 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                >
                  Take Your Assessment
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;