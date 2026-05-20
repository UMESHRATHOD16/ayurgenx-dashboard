import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAnswer, setResult } from "../../store/slices/assessmentSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    id: 1,
    area: "Sleep Quality",
    question: "How would you rate your sleep quality?",
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
  },
  {
    id: 2,
    area: "Stress Level",
    question: "How often do you feel stressed or overwhelmed?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 3,
    area: "Digestion",
    question: "How is your digestive health on a daily basis?",
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
  },
  {
    id: 4,
    area: "Energy Levels",
    question: "How are your energy levels throughout the day?",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"],
  },
  {
    id: 5,
    area: "Daily Activity",
    question: "How much physical activity do you get daily?",
    options: ["None", "Minimal", "Moderate", "Active", "Very Active"],
  },
  {
    id: 6,
    area: "Water Intake",
    question: "How much water do you drink per day?",
    options: ["Less than 1L", "1-2L", "2-3L", "3-4L", "More than 4L"],
  },
  {
    id: 7,
    area: "Food Routine",
    question: "How consistent is your daily food routine?",
    options: ["No routine", "Irregular", "Sometimes", "Mostly consistent", "Very consistent"],
  },
  {
    id: 8,
    area: "Mental Clarity",
    question: "How would you rate your focus and mental clarity?",
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
  },
  {
    id: 9,
    area: "Emotional Balance",
    question: "How balanced do you feel emotionally day to day?",
    options: ["Very Unstable", "Unstable", "Neutral", "Stable", "Very Stable"],
  },
  {
    id: 10,
    area: "Overall Wellness",
    question: "How would you rate your overall sense of wellbeing?",
    options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
  },
];

// Dummy logic to calculate result
const calculateResult = (answers) => {
  const scores = Object.values(answers).map((a) => a.score);
  const total = scores.reduce((acc, s) => acc + s, 0);
  const max = scores.length * 4;
  const wellness = Math.round((total / max) * 100);

  return {
    wellnessScore: wellness,
    vata: Math.round(30 + Math.random() * 20),
    pitta: Math.round(30 + Math.random() * 20),
    kapha: Math.round(20 + Math.random() * 20),
    stressLevel: answers[2]?.score <= 1 ? "High" : answers[2]?.score <= 3 ? "Moderate" : "Low",
    sleepScore: Math.round((answers[1]?.score / 4) * 100),
    activityLevel: answers[5]?.label,
    suggestions: [
      "Start your mornings with warm water and a 10-minute walk.",
      "Practice deep breathing or meditation for 5 minutes daily.",
      "Include seasonal fruits and vegetables in every meal.",
    ],
  };
};

const Assessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const question = questions[current];
  const progress = ((current) / questions.length) * 100;
  const isAnswered = answers[question.id] !== undefined;
  const isLast = current === questions.length - 1;

  const handleSelect = (option, index) => {
    setAnswers({
      ...answers,
      [question.id]: { label: option, score: index },
    });
    dispatch(setAnswer({ questionId: question.id, answer: { label: option, score: index } }));
  };

  const handleNext = () => {
    if (!isAnswered) return;
    setDirection(1);
    setCurrent((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrent((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const result = calculateResult(answers);
    dispatch(setResult(result));
    setSubmitted(true);
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "#556B4F" }}>
            Wellness Assessment
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CAF88" }}>
            Answer honestly for accurate results
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "#9CAF88" }}>
            <span>Question {current + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#DCCFB8" }}>
            <motion.div
              className="h-1.5 rounded-full"
              style={{ backgroundColor: "#556B4F" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className="bg-white border rounded-2xl p-8 shadow-sm"
          style={{ borderColor: "#DCCFB8" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3 }}
            >
              {/* Area Tag */}
              <span
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: "#F5F1E8", color: "#9CAF88" }}
              >
                {question.area}
              </span>

              {/* Question */}
              <h2
                className="text-lg font-semibold mt-4 mb-6 leading-snug"
                style={{ color: "#556B4F" }}
              >
                {question.question}
              </h2>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[question.id]?.label === option;
                  return (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(option, index)}
                      className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: isSelected ? "#556B4F" : "#F5F1E8",
                        borderColor: isSelected ? "#556B4F" : "#DCCFB8",
                        color: isSelected ? "#F5F1E8" : "#556B4F",
                      }}
                    >
                      <span
                        className="inline-block w-6 h-6 rounded-full text-xs text-center leading-6 mr-3 font-semibold"
                        style={{
                          backgroundColor: isSelected ? "#F5F1E8" : "#DCCFB8",
                          color: "#556B4F",
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {current > 0 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBack}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all"
                style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
              >
                ← Back
              </motion.button>
            )}

            {!isLast ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isAnswered ? "#556B4F" : "#DCCFB8",
                  color: isAnswered ? "#F5F1E8" : "#9CAF88",
                  cursor: isAnswered ? "pointer" : "not-allowed",
                }}
              >
                Next →
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!isAnswered}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isAnswered ? "#556B4F" : "#DCCFB8",
                  color: isAnswered ? "#F5F1E8" : "#9CAF88",
                  cursor: isAnswered ? "pointer" : "not-allowed",
                }}
              >
                Submit Assessment
              </motion.button>
            )}
          </div>
        </div>

        {/* Submitted */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-3 rounded-lg text-sm text-center"
            style={{ backgroundColor: "#A8B79E30", border: "1px solid #A8B79E", color: "#556B4F" }}
          >
            Assessment complete! Loading your results...
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Assessment;