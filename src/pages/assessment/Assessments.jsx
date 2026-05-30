import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setResult } from "../../store/slices/assessmentSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const questionGroups = [
  {
    id: 1,
    title: "Welcome",
    subtitle: "Let us get to know you",
    icon: "✦",
    questions: [],
  },
  {
    id: 2,
    title: "Sleep & Rest",
    subtitle: "Your rest patterns",
    icon: "◐",
    questions: [
      {
        id: 1,
        area: "Sleep",
        areaIcon: "◐",
        question: "How would you describe your sleep at night?",
        insight: "Sleep quality directly reflects your Vata and Pitta balance in Ayurveda.",
        options: [
          { label: "Restless and broken", desc: "Wake up multiple times at night", icon: "〰" },
          { label: "Light and disturbed", desc: "Easily woken by small sounds", icon: "◌" },
          { label: "Fairly okay", desc: "Sleep through mostly fine", icon: "◑" },
          { label: "Deep and refreshing", desc: "Wake up feeling fully restored", icon: "●" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Mind & Stress",
    subtitle: "Your mental wellbeing",
    icon: "◎",
    questions: [
      {
        id: 2,
        area: "Stress",
        areaIcon: "◎",
        question: "How often do you feel mentally overwhelmed?",
        insight: "Mental stress is one of the primary causes of Vata imbalance in the body.",
        options: [
          { label: "Almost every day", desc: "Constant feeling of pressure", icon: "▲" },
          { label: "Several times a week", desc: "Frequent bouts of anxiety", icon: "△" },
          { label: "Occasionally", desc: "Manageable levels of stress", icon: "▽" },
          { label: "Rarely or never", desc: "Generally calm and composed", icon: "▼" },
        ],
      },
      {
        id: 8,
        area: "Focus",
        areaIcon: "◈",
        question: "How would you rate your mental clarity and focus?",
        insight: "Mental clarity is linked to your Kapha balance and digestive health.",
        options: [
          { label: "Very foggy", desc: "Hard to concentrate on tasks", icon: "○" },
          { label: "Often distracted", desc: "Mind wanders frequently", icon: "◎" },
          { label: "Fairly focused", desc: "Can concentrate when needed", icon: "◉" },
          { label: "Sharp and clear", desc: "Strong focus and memory", icon: "●" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Energy & Lifestyle",
    subtitle: "Daily habits and energy",
    icon: "◈",
    questions: [
      {
        id: 4,
        area: "Energy",
        areaIcon: "◈",
        question: "How are your energy levels through the day?",
        insight: "Energy levels reveal your Ojas — the vital essence of all body tissues.",
        options: [
          { label: "Drained by afternoon", desc: "Energy crashes after lunch", icon: "▽" },
          { label: "Ups and downs", desc: "Inconsistent throughout day", icon: "〰" },
          { label: "Mostly steady", desc: "Fairly consistent energy", icon: "◑" },
          { label: "Consistently high", desc: "Energised all day long", icon: "▲" },
        ],
      },
      {
        id: 5,
        area: "Activity",
        areaIcon: "▷",
        question: "How physically active are you on a daily basis?",
        insight: "Physical activity balances all three doshas and strengthens Agni.",
        options: [
          { label: "Mostly sedentary", desc: "Little to no movement daily", icon: "○" },
          { label: "Light movement", desc: "Short walks or stretching", icon: "◌" },
          { label: "Moderate activity", desc: "Regular exercise routine", icon: "◑" },
          { label: "Very active", desc: "Intense daily physical activity", icon: "●" },
        ],
      },
      {
        id: 9,
        area: "Emotions",
        areaIcon: "◇",
        question: "How emotionally balanced do you feel day to day?",
        insight: "Emotional balance reflects the harmony between your mind and Prakriti.",
        options: [
          { label: "Very unstable", desc: "Frequent mood swings", icon: "▲" },
          { label: "Frequently anxious", desc: "Often worried or unsettled", icon: "△" },
          { label: "Generally stable", desc: "Mostly even tempered", icon: "▽" },
          { label: "Calm and grounded", desc: "Emotionally centred always", icon: "▼" },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Goals & Intentions",
    subtitle: "Your wellness goals",
    icon: "◇",
    questions: [
      {
        id: 3,
        area: "Digestion",
        areaIcon: "◉",
        question: "How does your stomach feel after meals?",
        insight: "Your body gives the best feedback. There are no wrong answers here.",
        options: [
          { label: "Heavy and bloated", desc: "Feel uncomfortably full or bloated", icon: "○" },
          { label: "Inconsistent", desc: "Sometimes good, sometimes not", icon: "◌" },
          { label: "Usually fine", desc: "Most meals sit well with me", icon: "◑" },
          { label: "Light and comfortable", desc: "Feel light and energetic after meals", icon: "●" },
        ],
      },
      {
        id: 6,
        area: "Hydration",
        areaIcon: "◌",
        question: "How much water do you drink per day?",
        insight: "Proper hydration is essential for flushing Ama toxins from the body.",
        options: [
          { label: "Less than 1 litre", desc: "Rarely drink enough water", icon: "○" },
          { label: "1 to 2 litres", desc: "Drink water occasionally", icon: "◌" },
          { label: "2 to 3 litres", desc: "Fairly well hydrated daily", icon: "◑" },
          { label: "More than 3 litres", desc: "Very conscious about hydration", icon: "●" },
        ],
      },
      {
        id: 7,
        area: "Food",
        areaIcon: "◆",
        question: "How consistent is your daily eating routine?",
        insight: "Regular meal timings strengthen Agni and improve overall metabolism.",
        options: [
          { label: "No routine at all", desc: "Eat whenever and whatever", icon: "○" },
          { label: "Irregular timings", desc: "Timings vary widely daily", icon: "◌" },
          { label: "Somewhat consistent", desc: "Try to eat at fixed times", icon: "◑" },
          { label: "Very consistent", desc: "Fixed meals at fixed times", icon: "●" },
        ],
      },
      {
        id: 10,
        area: "Overall",
        areaIcon: "✦",
        question: "How would you describe your overall sense of wellbeing?",
        insight: "Your overall feeling is the most honest reflection of your Prakriti state.",
        options: [
          { label: "Poor", desc: "Frequently unwell or low", icon: "○" },
          { label: "Below average", desc: "Often not at my best", icon: "◌" },
          { label: "Good", desc: "Generally feeling well", icon: "◑" },
          { label: "Excellent", desc: "Thriving and full of life", icon: "●" },
        ],
      },
    ],
  },
];

const allQuestions = questionGroups.flatMap((g) => g.questions);

const calculateResult = (answers) => {
  const scores = Object.values(answers).map((a) => a.score);
  const total = scores.reduce((acc, s) => acc + s, 0);
  const max = scores.length * 3;
  const wellness = Math.round((total / max) * 100);
  return {
    wellnessScore: wellness,
    vata: Math.min(100, Math.round(25 + Math.random() * 25)),
    pitta: Math.min(100, Math.round(25 + Math.random() * 25)),
    kapha: Math.min(100, Math.round(20 + Math.random() * 20)),
    stressLevel: answers[2]?.score <= 1 ? "High" : answers[2]?.score <= 2 ? "Moderate" : "Low",
    sleepScore: Math.round(((answers[1]?.score || 1) / 3) * 100),
    activityLevel:
      answers[5]?.score === 3 ? "Very Active" :
      answers[5]?.score === 2 ? "Active" :
      answers[5]?.score === 1 ? "Moderate" : "Minimal",
    suggestions: [
      "Start your mornings with warm water and a 10 minute walk.",
      "Practice deep breathing or meditation for 5 minutes daily.",
      "Include seasonal fruits and vegetables in every meal.",
    ],
  };
};

const stressColor = {
  Low: "#9CAF88",
  Moderate: "#D4A843",
  High: "#c97b6a",
};

const Assessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { result } = useSelector((state) => state.assessment);

  const [screen, setScreen] = useState("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState(null);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = Math.round((currentQuestionIndex / totalQuestions) * 100);

  const getActiveGroupId = () => {
    for (const group of questionGroups) {
      if (group.questions.some((q) => q.id === currentQuestion?.id)) {
        return group.id;
      }
    }
    return 1;
  };

  const handleSelect = (option, index) => {
    if (selected !== null) return;
    setSelected(index);
    const updated = {
      ...answers,
      [currentQuestion.id]: { label: option.label, score: index },
    };
    setAnswers(updated);
    dispatch(setAnswer({ questionId: currentQuestion.id, answer: { label: option.label, score: index } }));

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setDirection(1);
        setCurrentQuestionIndex((c) => c + 1);
        setSelected(null);
      } else {
        const result = calculateResult(updated);
        dispatch(setResult(result));
        setScreen("calculating");
        setTimeout(() => setScreen("result"), 2500);
      }
    }, 380);
  };

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      setScreen("intro");
      return;
    }
    setDirection(-1);
    setCurrentQuestionIndex((c) => c - 1);
    setSelected(null);
  };

  const handleNext = () => {
    if (selected === null && !answers[currentQuestion?.id]) return;
    if (currentQuestionIndex < totalQuestions - 1) {
      setDirection(1);
      setCurrentQuestionIndex((c) => c + 1);
      setSelected(null);
    } else {
      const result = calculateResult(answers);
      dispatch(setResult(result));
      setScreen("calculating");
      setTimeout(() => setScreen("result"), 2500);
    }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F1E8" }}>
      <AnimatePresence mode="wait">

        {/* Intro Screen */}
        {screen === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl"
              style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)" }}
            >
              <span style={{ color: "#F5F1E8" }}>✦</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
              style={{ color: "#556B4F" }}
            >
              Know Your Wellness DNA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed mb-3 max-w-sm"
              style={{ color: "#6B7F65" }}
            >
              10 questions across 5 wellness areas. Personalised Prakriti analysis and honest insights about your body and mind.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs mb-10 font-medium"
              style={{ color: "#A8B79E" }}
            >
              Takes about 2 minutes
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(85,107,79,0.3)" }}
              onClick={() => {
                setScreen("questions");
                setCurrentQuestionIndex(0);
                setAnswers({});
                setSelected(null);
              }}
              className="px-10 py-3.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
            >
              {result ? "Retake Assessment" : "Begin Assessment"}
            </motion.button>
          </motion.div>
        )}

        {/* Questions Screen */}
        {screen === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex"
          >
            {/* Left Sidebar */}
            <div
              className="hidden lg:flex flex-col w-80 shrink-0 p-8 border-r"
              style={{ backgroundColor: "white", borderColor: "#DCCFB8" }}
            >
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-1" style={{ color: "#556B4F" }}>
                  Your Wellness Assessment
                </h2>
                <p className="text-xs" style={{ color: "#6B7F65" }}>
                  Discover your unique mind-body balance
                </p>
              </div>

              {/* Progress */}
              <div
                className="p-4 rounded-xl border mb-6"
                style={{ backgroundColor: "#F5F1E8", borderColor: "#DCCFB8" }}
              >
                <div className="flex justify-between text-xs mb-2" style={{ color: "#6B7F65" }}>
                  <span>Overall Progress</span>
                  <span>{progress}% Complete</span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-2" style={{ backgroundColor: "#DCCFB8" }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: "#556B4F" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs" style={{ color: "#6B7F65" }}>
                  Step {currentQuestionIndex + 1} of {totalQuestions}
                </p>
              </div>

              {/* Steps */}
              <div className="flex flex-col gap-2 flex-1">
                {questionGroups.map((group, i) => {
                  const isCompleted = group.questions.length > 0 &&
                    group.questions.every((q) => answers[q.id] !== undefined);
                  const isActive = getActiveGroupId() === group.id;
                  const isWelcome = group.id === 1;

                  return (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: isActive ? "#556B4F10" : "transparent",
                        borderLeft: isActive ? "2px solid #556B4F" : "2px solid transparent",
                      }}
                    >
                      {/* Step indicator */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                        style={{
                          backgroundColor: isCompleted || isWelcome ? "#556B4F" : isActive ? "#9CAF88" : "#DCCFB8",
                          color: isCompleted || isWelcome || isActive ? "#F5F1E8" : "#9CAF88",
                        }}
                      >
                        {isCompleted || isWelcome ? "✓" : group.id - 1}
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: isActive ? "#556B4F" : "#9CAF88" }}
                        >
                          {group.title}
                        </p>
                        <p className="text-xs" style={{ color: "#A8B79E" }}>
                          {group.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Why this matters */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 rounded-xl"
                style={{ backgroundColor: "#F5F1E8", border: "1px solid #DCCFB8" }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: "#556B4F" }}>
                  ✦ Why this matters?
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7F65" }}>
                  This assessment helps us understand your unique constitution and create personalised recommendations just for you.
                </p>
              </motion.div>
            </div>

            {/* Right Main Area */}
            <div className="flex-1 flex flex-col px-6 lg:px-12 py-8 max-w-3xl mx-auto w-full">

              {/* Top bar */}
              <div className="flex items-center justify-between mb-8">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide cursor-default"
                  style={{
                    backgroundColor: "#A8B79E30",
                    color: "#556B4F",
                    border: "1px solid #A8B79E",
                  }}
                >
                  <span>{currentQuestion.areaIcon}</span>
                  <span>{currentQuestion.area}</span>
                </motion.span>
                <span className="text-xs font-medium" style={{ color: "#6B7F65" }}>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Mobile progress */}
              <div className="lg:hidden mb-6">
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#DCCFB8" }}>
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: "#556B4F" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentQuestionIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    {/* Question text */}
                    <motion.h2
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl sm:text-3xl font-bold mb-3 leading-snug cursor-default"
                      style={{ color: "#556B4F" }}
                    >
                      {currentQuestion.question}
                    </motion.h2>

                    {/* Insight sub text */}
                    <p className="text-sm mb-8 leading-relaxed" style={{ color: "#6B7F65" }}>
                      {currentQuestion.insight}
                    </p>

                    {/* Options 2x2 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={option.label}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.07 }}
                          whileHover={selected === null ? {
                            y: -3,
                            boxShadow: "0 12px 32px rgba(85,107,79,0.15)",
                            backgroundColor: "#EEF2EA",
                            borderColor: "#556B4F",
                          } : {}}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(option, index)}
                          className="relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer
                          "
                          style={{
                            backgroundColor:
                              selected === index ? "#556B4F" :
                              selected !== null ? "#F5F1E8" : "white",
                            borderColor:
                              selected === index ? "#556B4F" : "#DCCFB8",
                            opacity: selected !== null && selected !== index ? 0.45 : 1,
                            boxShadow: selected === index
                              ? "0 8px 28px rgba(85,107,79,0.25)"
                              : "none",
                          }}
                        >
                          {/* Icon circle */}
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-lg"
                            style={{
                              backgroundColor: selected === index ? "#F5F1E840" : "#F5F1E8",
                              color: selected === index ? "#F5F1E8" : "#556B4F",
                            }}
                          >
                            {option.icon}
                          </div>

                          <p
                            className="text-sm font-semibold mb-1"
                            style={{ color: selected === index ? "#F5F1E8" : "#556B4F" }}
                          >
                            {option.label}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: selected === index ? "#A8B79E" : "#9CAF88" }}
                          >
                            {option.desc}
                          </p>

                          {/* Letter badge */}
                          <div
                            className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: selected === index ? "#F5F1E820" : "#F5F1E8",
                              color: selected === index ? "#F5F1E8" : "#556B4F",
                            }}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>

                          {/* Checkmark */}
                          {selected === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", duration: 0.3 }}
                              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
                            >
                              ✓
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Ayurveda insight bar */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ backgroundColor: "#A8B79E20", border: "1px solid #A8B79E40" }}
                    >
                      <span style={{ color: "#556B4F" }}>✦</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "#556B4F" }}>
                          Ayurveda Insight
                        </p>
                        <p className="text-xs" style={{ color: "#6B7F65" }}>
                          Your body gives the best feedback. There are no wrong answers here.
                        </p>
                      </div>
                    </motion.div>

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom navigation */}
              <div className="flex items-center justify-between mt-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ x: -3 }}
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer"
                  style={{ borderColor: "#DCCFB8", color: "black", backgroundColor: "white" }}
                >
                  Back
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 28px rgba(85,107,79,0.3)",
                  }}
                  onClick={handleNext}
                  disabled={selected === null && !answers[currentQuestion?.id]}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    backgroundColor:
                      selected !== null || answers[currentQuestion?.id]
                        ? "#556B4F"
                        : "#DCCFB8",
                    color:
                      selected !== null || answers[currentQuestion?.id]
                        ? "#F5F1E8"
                        : "#9CAF88",
                    cursor:
                      selected !== null || answers[currentQuestion?.id]
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {currentQuestionIndex === totalQuestions - 1
                    ? "Submit Assessment"
                    : "Next Question"}
                </motion.button>
              </div>

            </div>
          </motion.div>
        )}

        {/* Calculating Screen */}
        {screen === "calculating" && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-full border-4 mb-8"
              style={{ borderColor: "#DCCFB8", borderTopColor: "#556B4F" }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold mb-2"
              style={{ color: "#556B4F" }}
            >
              Analysing your wellness profile
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm"
              style={{ color: "#6B7F65" }}
            >
              Calculating your Prakriti balance...
            </motion.p>
          </motion.div>
        )}

        {/* Result Screen */}
        {screen === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen px-4 py-10 max-w-2xl mx-auto w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#556B4F" }}>
                Your Wellness Report
              </h2>
              <p className="text-sm" style={{ color: "#6B7F65" }}>
                Based on your assessment responses
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">

              {/* Score */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(85,107,79,0.15)",
                }}
                className="bg-white border rounded-2xl p-6 flex flex-col items-center cursor-default"
                style={{ borderColor: "#DCCFB8" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                  className="w-24 h-24 rounded-full flex flex-col items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #556B4F, #9CAF88)" }}
                >
                  <span className="text-3xl font-bold" style={{ color: "#F5F1E8" }}>
                    {calculateResult(answers).wellnessScore}
                  </span>
                  <span className="text-xs opacity-80" style={{ color: "#F5F1E8" }}>
                    score
                  </span>
                </motion.div>
                <p className="text-sm font-semibold" style={{ color: "#556B4F" }}>
                  Overall Wellness Score
                </p>
              </motion.div>

              {/* Dosha */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm font-semibold mb-3" style={{ color: "#556B4F" }}>
                  Prakriti Balance
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Vata", value: calculateResult(answers).vata },
                    { label: "Pitta", value: calculateResult(answers).pitta },
                    { label: "Kapha", value: calculateResult(answers).kapha },
                  ].map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      whileHover={{
                        y: -4,
                        boxShadow: "0 12px 32px rgba(85,107,79,0.13)",
                        backgroundColor: "#EEF2EA",
                      }}
                      className="bg-white border rounded-2xl p-4 text-center cursor-default"
                      style={{ borderColor: "#DCCFB8" }}
                    >
                      <p className="text-xl font-bold mb-0.5" style={{ color: "#556B4F" }}>
                        {d.value}%
                      </p>
                      <p className="text-xs font-medium" style={{ color: "#6B7F65" }}>
                        {d.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Stress */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 32px rgba(85,107,79,0.13)",
                }}
                className="bg-white border rounded-2xl p-5 flex items-center justify-between cursor-default"
                style={{ borderColor: "#DCCFB8" }}
              >
                <p className="text-sm font-semibold" style={{ color: "#556B4F" }}>
                  Stress Level
                </p>
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: stressColor[calculateResult(answers).stressLevel] + "20",
                    color: stressColor[calculateResult(answers).stressLevel],
                    border: `1px solid ${stressColor[calculateResult(answers).stressLevel]}`,
                  }}
                >
                  {calculateResult(answers).stressLevel}
                </span>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border rounded-2xl p-6"
                style={{ borderColor: "#DCCFB8" }}
              >
                <p className="text-sm font-semibold mb-4" style={{ color: "#556B4F" }}>
                  Suggestions For You
                </p>
                <div className="flex flex-col gap-3">
                  {calculateResult(answers).suggestions.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 p-3 rounded-xl cursor-default"
                      style={{ backgroundColor: "#F5F1E8" }}
                    >
                      <span
                        className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: "#556B4F" }}>
                        {tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-3 pb-4"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setScreen("intro");
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setSelected(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
                >
                  Retake
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 8px 28px rgba(85,107,79,0.3)" }}
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                >
                  Full Dashboard
                </motion.button>
              </motion.div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default Assessment;