import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setResult } from "../../store/slices/assessmentSlice";

const RevealSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const CountUp = ({ target, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  if (isInView && !started.current && target > 0) {
    started.current = true;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
  }

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const quickQuestions = [
  {
    id: 1,
    question: "How is your energy level through the day?",
    options: ["Always tired", "Ups and downs", "Mostly good", "Always high"],
  },
  {
    id: 2,
    question: "How well do you sleep at night?",
    options: ["Very poorly", "Interrupted", "Fairly well", "Very well"],
  },
  {
    id: 3,
    question: "How often do you feel stressed?",
    options: ["Always", "Often", "Sometimes", "Rarely"],
  },
];

const calculateQuickResult = (answers) => {
  const scores = Object.values(answers).map((a) => a.score);
  const total = scores.reduce((acc, s) => acc + s, 0);
  const max = scores.length * 3;
  const wellness = Math.round((total / max) * 100);
  return {
    wellnessScore: wellness,
    vata: 35,
    pitta: 38,
    kapha: 27,
    stressLevel: answers[3]?.score <= 1 ? "High" : answers[3]?.score <= 2 ? "Moderate" : "Low",
    sleepScore: Math.round(((answers[2]?.score || 1) / 3) * 100),
    activityLevel: "Moderate",
    suggestions: [
      "Start your mornings with warm water and a 10 minute walk.",
      "Practice deep breathing or meditation for 5 minutes daily.",
      "Include seasonal fruits and vegetables in every meal.",
    ],
  };
};

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  const handleQuizAnswer = (questionId, option, index) => {
    const updated = { ...quizAnswers, [questionId]: { label: option, score: index } };
    setQuizAnswers(updated);
    dispatch(setAnswer({ questionId, answer: { label: option, score: index } }));

    if (quizStep < quickQuestions.length - 1) {
      setTimeout(() => setQuizStep((s) => s + 1), 400);
    } else {
      setTimeout(() => {
        const result = calculateQuickResult(updated);
        dispatch(setResult(result));
        setQuizDone(true);
      }, 400);
    }
  };

  const openAssessment = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizDone(false);
    setShowAssessment(true);
  };

  const features = [
    {
      title: "AI Powered Analysis",
      desc: "Advanced algorithms analyse your lifestyle patterns and provide personalised Ayurvedic insights.",
    },
    {
      title: "Prakriti Assessment",
      desc: "Discover your unique Vata, Pitta and Kapha balance through our intelligent wellness screening.",
    },
    {
      title: "Curated Products",
      desc: "Premium Ayurvedic products selected specifically for your body type and wellness goals.",
    },
    {
      title: "Holistic Tracking",
      desc: "Monitor your sleep, stress, digestion and energy levels in one unified wellness dashboard.",
    },
  ];

  const stats = [
    { label: "Users Helped", value: 12000, suffix: "+" },
    { label: "Assessments Done", value: 9800, suffix: "+" },
    { label: "Products Available", value: 50, suffix: "+" },
    { label: "Wellness Goals Met", value: 94, suffix: "%" },
  ];

  const steps = [
    {
      step: "01",
      title: "Take Assessment",
      desc: "Answer a few quick questions about your lifestyle and wellness patterns.",
    },
    {
      step: "02",
      title: "Get Your Report",
      desc: "Receive your personalised Prakriti analysis and wellness score instantly.",
    },
    {
      step: "03",
      title: "Follow Your Plan",
      desc: "Get curated product recommendations and lifestyle suggestions for your body type.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F1E8" }}>

      {/* Landing Navbar — hidden when logged in */}
      {!isAuthenticated && (
        <nav
          className="sticky top-0 z-50 border-b"
          style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#556B4F" }}
              >
                <span className="text-xs font-bold" style={{ color: "#F5F1E8" }}>A</span>
              </div>
              <span className="font-semibold text-lg" style={{ color: "#556B4F" }}>
                AyurGenX
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "transparent" }}
              >
                Login
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </nav>
      )}

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <span
            className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase"
            style={{
              backgroundColor: "#A8B79E30",
              color: "#556B4F",
              border: "1px solid #A8B79E",
            }}
          >
            AI Powered Precision Ayurveda
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto"
            style={{ color: "#556B4F" }}
          >
            Ancient Wisdom.{" "}
            <span style={{ color: "#9CAF88" }}>Modern Intelligence.</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#9CAF88" }}
          >
            Discover your unique Prakriti, track your wellness journey and get
            personalised Ayurvedic guidance powered by AI.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={openAssessment}
            className="px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
          >
            Check Your Wellness Score
          </motion.button>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: "#556B4F" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <RevealSection key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="text-3xl font-bold mb-1" style={{ color: "#F5F1E8" }}>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm" style={{ color: "#A8B79E" }}>
                  {stat.label}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <RevealSection>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "#556B4F" }}>
              Everything you need for wellness
            </h2>
            <p className="text-sm" style={{ color: "#9CAF88" }}>
              Science backed Ayurveda personalised for your unique body type
            </p>
          </div>
        </RevealSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <RevealSection key={f.title} delay={i * 0.1}>
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: "0 16px 40px rgba(85, 107, 79, 0.18)",
                  backgroundColor: "#EEF2EA",
                }}
                transition={{ duration: 0.25 }}
                className="bg-white border rounded-2xl p-6 h-full cursor-default"
                style={{ borderColor: "#DCCFB8" }}
              >
                <div
                  className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                  style={{ backgroundColor: "#F5F1E8" }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#556B4F" }}
                  />
                </div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#556B4F" }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#9CAF88" }}>
                  {f.desc}
                </p>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ backgroundColor: "#DCCFB830" }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <RevealSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold mb-3" style={{ color: "#556B4F" }}>
                How AyurGenX works
              </h2>
              <p className="text-sm" style={{ color: "#9CAF88" }}>
                Three simple steps to your personalised wellness plan
              </p>
            </div>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <RevealSection key={s.step} delay={i * 0.15}>
                <motion.div
                  whileHover={{
                    y: -6,
                    boxShadow: "0 16px 40px rgba(85, 107, 79, 0.18)",
                    backgroundColor: "#EEF2EA",
                  }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border rounded-2xl p-8 text-center cursor-default"
                  style={{ borderColor: "#DCCFB8" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#556B4F" }}
                  >
                    <span className="text-sm font-bold" style={{ color: "#F5F1E8" }}>
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "#556B4F" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CAF88" }}>
                    {s.desc}
                  </p>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <RevealSection>
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)" }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "#F5F1E8" }}
            >
              Discover your Wellness Score
            </h2>
            <p
              className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
              style={{ color: "#F5F1E8", opacity: 0.85 }}
            >
              Take a 3 question quick assessment and get your personalised
              wellness snapshot in under a minute
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={openAssessment}
              className="px-8 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
            >
              Take Quick Assessment
            </motion.button>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "#DCCFB8" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#556B4F" }}
            >
              <span className="text-xs font-bold" style={{ color: "#F5F1E8" }}>A</span>
            </div>
            <span className="text-sm font-semibold" style={{ color: "#556B4F" }}>
              AyurGenX
            </span>
          </div>
          <p className="text-xs text-center" style={{ color: "#9CAF88" }}>
            Incubated at IIT Roorkee. Developed under IIT Madras Innovation Ecosystem.
          </p>
          <p className="text-xs" style={{ color: "#9CAF88" }}>
            2025 AyurGenX. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Assessment Modal */}
      <AnimatePresence>
        {showAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              backgroundColor: "rgba(85, 107, 79, 0.4)",
              backdropFilter: "blur(6px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAssessment(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.93 }}
              transition={{ duration: 0.4, type: "spring", damping: 22 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 relative shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setShowAssessment(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all hover:opacity-70"
                style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
              >
                x
              </button>

              <AnimatePresence mode="wait">
                {!quizDone ? (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <p
                      className="text-xs font-semibold uppercase tracking-wide mb-4"
                      style={{ color: "#9CAF88" }}
                    >
                      Quick Wellness Check
                    </p>

                    {/* Progress dots */}
                    <div className="flex gap-2 mb-6">
                      {quickQuestions.map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full transition-all duration-500"
                          style={{
                            backgroundColor: i <= quizStep ? "#556B4F" : "#DCCFB8",
                          }}
                        />
                      ))}
                    </div>

                    <p
                      className="text-xs font-medium mb-2"
                      style={{ color: "#9CAF88" }}
                    >
                      Question {quizStep + 1} of {quickQuestions.length}
                    </p>

                    <motion.h3
                      key={quizStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-base font-semibold mb-6 leading-snug"
                      style={{ color: "#556B4F" }}
                    >
                      {quickQuestions[quizStep].question}
                    </motion.h3>

                    <motion.div
                      key={`options-${quizStep}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex flex-col gap-3"
                    >
                      {quickQuestions[quizStep].options.map((option, index) => (
                        <motion.button
                          key={option}
                          whileTap={{ scale: 0.98 }}
                          whileHover={{
                            x: 6,
                            backgroundColor: "#EEF2EA",
                            borderColor: "#556B4F",
                          }}
                          onClick={() =>
                            handleQuizAnswer(
                              quickQuestions[quizStep].id,
                              option,
                              index
                            )
                          }
                          className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors duration-150"
                          style={{
                            backgroundColor: "#F5F1E8",
                            borderColor: "#DCCFB8",
                            color: "#556B4F",
                          }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.15, type: "spring" }}
                      className="w-24 h-24 rounded-full flex flex-col items-center justify-center mx-auto mb-6"
                      style={{
                        background: "linear-gradient(135deg, #556B4F, #9CAF88)",
                      }}
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "#F5F1E8" }}
                      >
                        {calculateQuickResult(quizAnswers).wellnessScore}
                      </p>
                      <p
                        className="text-xs opacity-80"
                        style={{ color: "#F5F1E8" }}
                      >
                        score
                      </p>
                    </motion.div>

                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: "#556B4F" }}
                    >
                      Your Wellness Score is Ready
                    </h3>
                    <p
                      className="text-sm mb-8 leading-relaxed"
                      style={{ color: "#9CAF88" }}
                    >
                      Sign up for your complete Prakriti report, dosha analysis
                      and personalised product recommendations
                    </p>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setShowAssessment(false);
                          navigate("/signup");
                        }}
                        className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                        style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                      >
                        Get Full Report
                      </motion.button>
                      <button
                        onClick={() => setShowAssessment(false)}
                        className="w-full py-2.5 rounded-xl text-sm font-medium border transition-all"
                        style={{
                          borderColor: "#DCCFB8",
                          color: "#9CAF88",
                          backgroundColor: "transparent",
                        }}
                      >
                        Maybe Later
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Landing;