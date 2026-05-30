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
      desc: "Get personalized recommendations for your body type.",
    },
  ];

    const featuredProducts = [
    {
      id: 7,
      name: "Brahmi Hair Oil",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop",
      category: "Ayurvedic Oils",
      tag: "Bestseller",
      description:
        "A traditional Brahmi and Bhringraj infused hair oil. Nourishes scalp deeply, reduces hair fall and promotes growth from roots.",
      highlight: "Reduces hair fall by up to 60% in 4 weeks",
      color: "#A8B79E",
    },
    {
      id: 3,
      name: "Tulsi Green Tea",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop",
      category: "Herbal Teas",
      tag: "Bestseller",
      description:
        "A calming blend of organic Tulsi and green tea leaves. Rich in antioxidants and adaptogens that help manage stress and boost immunity daily.",
      highlight: "Trusted by 5000+ customers for daily stress relief",
      color: "#9CAF88",
    },
    {
      id: 9,
      name: "Stress Relief Capsules",
      image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop",
      category: "Sleep and Stress Relief",
      tag: "Popular",
      description:
        "A potent blend of Ashwagandha, Brahmi and Jatamansi. Formulated to reduce stress, improve focus and support adrenal health naturally.",
      highlight: "Clinically inspired formula backed by Ayurvedic science",
      color: "#DCCFB8",
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
              {/* Logo */}
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#556B4F" }}
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-xs font-bold" style={{ color: "#F5F1E8" }}>A</span>
                </motion.div>
                <span className="font-semibold text-lg" style={{ color: "#556B4F" }}>
                  AyurGenX
                </span>
              </motion.div>

              {/* Right side */}
              <div className="flex items-center gap-6">

                {/* Nav links */}
                <div className="hidden sm:flex items-center gap-1">
                  {[
                    { label: "Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                    { label: "Products", action: () => document.getElementById("products").scrollIntoView({ behavior: "smooth" }) },
                    { label: "About Us", action: () => document.getElementById("about").scrollIntoView({ behavior: "smooth" }) },
                  ].map((link) => (
                    <motion.button
                      key={link.label}
                      onClick={link.action}
                      className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all"
                      style={{ color: "#556B4F", cursor: "pointer" }}
                      whileHover={{ backgroundColor: "#A8B79E20" }}
                      whileTap={{ scale: 0.95, backgroundColor: "#A8B79E40" }}
                      transition={{ duration: 0.15 }}
                    >
                      {link.label}
                      <motion.div
                        className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: "#556B4F" }}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Login button */}
                <motion.button
                  onClick={() => navigate("/login")}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium border overflow-hidden"
                  style={{
                    borderColor: "#556B4F",
                    color: "#556B4F",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    backgroundColor: "#556B4F",
                    color: "#F5F1E8",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className="relative z-10 flex items-center gap-1.5"
                  >
                    Login
                  </motion.span>
                </motion.button>

                {/* Get Started button */}
                <motion.button
                  onClick={() => navigate("/signup")}
                  className="relative px-5 py-2 rounded-lg text-sm font-semibold overflow-hidden"
                  style={{
                    backgroundColor: "#556B4F",
                    color: "#F5F1E8",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0 8px 25px rgba(85,107,79,0.35)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                    }}
                    whileHover={{
                      opacity: 1,
                      x: ["-100%", "100%"],
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">Get Started</span>
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
            className="px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 cursor-pointer hover:translate-1"
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

      {/* Featured Products */}
    <section id="products" className="py-20 overflow-hidden" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-16">
            <span
              className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase"
              style={{ backgroundColor: "#A8B79E30", color: "#556B4F", border: "1px solid #A8B79E" }}
            >
              Our Products
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#556B4F" }}>
              Crafted for your wellbeing
            </h2>
            <p className="text-sm" style={{ color: "#9CAF88" }}>
              Premium Ayurvedic formulations rooted in ancient science
            </p>
          </div>
        </RevealSection>

        <div className="flex flex-col gap-6">
          {featuredProducts.map((product, i) => (
            <RevealSection key={product.id} delay={i * 0.1}>
            <motion.div
                whileHover={{
                  boxShadow: "0 28px 70px rgba(85,107,79,0.2)",
                  y: -4,
                }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col rounded-3xl overflow-hidden border ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}
                style={{ borderColor: "#DCCFB8", backgroundColor: "white" }}
              >
                {/* Description — left */}
                <motion.div
                  className="flex-1 p-10 flex flex-col justify-center"
                  whileHover={{ backgroundColor: "#FAFAF7" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                    >
                      {product.tag}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#9CAF88" }}>
                      {product.category}
                    </span>
                  </div>

                  <motion.h3
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl sm:text-3xl font-bold mb-3 leading-tight cursor-default"
                    style={{ color: "#556B4F" }}
                  >
                    {product.name}
                  </motion.h3>

                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: "#9CAF88" }}
                  >
                    {product.description}
                  </p>

                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 p-4 rounded-xl mb-6 cursor-default"
                    style={{ backgroundColor: "#F5F1E8" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: "#556B4F" }}
                    />
                    <p className="text-xs font-semibold leading-relaxed" style={{ color: "#556B4F" }}>
                      {product.highlight}
                    </p>
                  </motion.div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate("/signup")}
                    className="w-fit px-7 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all cursor-pointer"
                    style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                  >
                    Shop Now
                  </motion.button>
                </motion.div>

                  {/* Image — right */}
                  <motion.div
                    className="flex-1 relative min-h-72 flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: product.color + "30" }}
                  >
                    {/* Decorative circle */}
                    <motion.div
                      className="absolute w-56 h-56 rounded-full opacity-20"
                      style={{ backgroundColor: product.color, top: "-30px", right: "-30px" }}
                      whileHover={{ scale: 1.2, opacity: 0.35 }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Actual image */}
                    <motion.div
                      className="relative z-10 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl"
                      whileHover={{
                        y: -10,
                        scale: 1.05,
                        rotate: 2,
                        boxShadow: `0 30px 60px ${product.color}80`,
                      }}
                      transition={{ duration: 0.35, type: "spring", damping: 14 }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </motion.div>

              </motion.div>
            </RevealSection>
          ))}
        </div>

        <RevealSection delay={0.2}>
          <div className="text-center mt-10">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={isAuthenticated?() => navigate("/store"):() => navigate("/signup")}
              className="px-8 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer"
              style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "transparent" }}
            >
              View All Products
            </motion.button>
          </div>
        </RevealSection>
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
              className="px-8 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:translate-1"
              style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
            >
              Take Quick Assessment
            </motion.button>
          </div>
        </RevealSection>
      </section>


      {/* About Section */}
      <section id="about" style={{ backgroundColor: "#556B4F" }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <RevealSection>
              <div>
                <span
                  className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase"
                  style={{ backgroundColor: "#A8B79E30", color: "#A8B79E", border: "1px solid #A8B79E" }}
                >
                  About AyurGenX
                </span>
                <motion.h2
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl sm:text-4xl font-bold mb-6 leading-tight cursor-default"
                  style={{ color: "#F5F1E8" }}
                >
                  Where Ancient Wisdom Meets Modern Science
                </motion.h2>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "#A8B79E" }}
                >
                  AyurGenX was born from a simple belief, that every person deserves
                  personalised healthcare rooted in nature. We combine thousands of years
                  of Ayurvedic wisdom with modern AI driven analytics to deliver precision
                  wellness for every unique body type.
                </p>
                <p
                  className="text-sm leading-relaxed mb-10"
                  style={{ color: "#A8B79E" }}
                >
                  Our platform analyses your Prakriti - your unique biological constitution
                  ,and creates a fully personalised wellness plan covering nutrition,
                  lifestyle, sleep and stress management.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Incubated at IIT Roorkee",
                    "IIT Madras Innovation Ecosystem",
                    "AI Powered",
                    "Science Backed",
                  ].map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05, backgroundColor: "#A8B79E40" }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
                      style={{
                        border: "1px solid #A8B79E",
                        color: "#F5F1E8",
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* Right — stats cards */}
            <RevealSection delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Founded", value: "2023", desc: "Started with a vision" },
                  { label: "IIT Backed", value: "2x", desc: "Roorkee and Madras" },
                  { label: "Products", value: "50+", desc: "Premium formulations" },
                  { label: "Users", value: "12K+", desc: "And growing every day" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{
                      y: -6,
                      backgroundColor: "#A8B79E20",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                    }}
                    className="p-6 rounded-2xl border transition-colors cursor-pointer"
                    style={{ border: "1px solid #A8B79E40" }}
                  >
                    <p className="text-2xl font-bold mb-1" style={{ color: "#F5F1E8" }}>
                      {item.value}
                    </p>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: "#F5F1E8" }}>
                      {item.label}
                    </p>
                    <p className="text-xs" style={{ color: "#A8B79E" }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </RevealSection>

          </div>
        </div>
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
                          isAuthenticated ? navigate("/dashboard") : navigate("/signup");
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