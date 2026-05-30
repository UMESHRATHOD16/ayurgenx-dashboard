import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import vataImg from "../../assets/doshas/vata.jpg";
import pittaImg from "../../assets/doshas/pitta.jpg";
import kaphaImg from "../../assets/doshas/kapha.jpg";

const dummyResult = {
  wellnessScore: 72,
  vata: 38,
  pitta: 35,
  kapha: 27,
  stressLevel: "Moderate",
  sleepScore: 68,
  activityLevel: "Moderate",
  suggestions: [
    "Start your mornings with warm water and a 10 minute walk.",
    "Practice deep breathing or meditation for 5 minutes daily.",
    "Include seasonal fruits and vegetables in every meal.",
  ],
};

const ScoreRing = ({ score }) => {
  const radius = 54;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" className="-rotate-90">
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="#DCCFB8"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="#556B4F"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color: "#556B4F" }}>
          {score}
        </span>
        <span className="text-xs" style={{ color: "#9CAF88" }}>
          out of 100
        </span>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, max = 100 }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between text-sm">
      <span style={{ color: "#556B4F" }} className="font-medium">
        {label}
      </span>
      <span style={{ color: "#9CAF88" }}>{value}{max === 100 ? "%" : ""}</span>
    </div>
    <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#DCCFB8" }}>
      <motion.div
        className="h-2 rounded-full"
        style={{ backgroundColor: "#556B4F" }}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { result } = useSelector((state) => state.assessment);

  const data = result || dummyResult;

  const doshas = [
    {
      label: "Vata",
      value: data.vata,
      desc: "Movement and flow",
      image: vataImg,
    },
    {
      label: "Pitta",
      value: data.pitta,
      desc: "Transformation and heat",
      image: pittaImg,
    },
    {
      label: "Kapha",
      value: data.kapha,
      desc: "Structure and stability",
      image: kaphaImg,
    },
  ];

  const stressColor = {
    Low: "#9CAF88",
    Moderate: "#DCCFB8",
    High: "#c97b6a",
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 overflow-hidden shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, #556B4F 0%, #7A8F72 100%)",
          }}
        >
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>

          <p className="text-sm mt-2 text-white/80">
            Track your wellness journey, monitor your dosha balance,
            and discover personalized recommendations.
          </p>

          <div className="flex gap-3 mt-5">
            <div className="bg-white/20 text-white px-4 py-2 rounded-full text-xs font-medium">
              🌿 Wellness Score {data.wellnessScore}
            </div>

            <div className="bg-white/20 text-white px-4 py-2 rounded-full text-xs font-medium">
              🧘 Stress {data.stressLevel}
            </div>
          </div>
        </motion.div>

        {/* Wellness Score + stress level Card */}
        
        <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
          style={{ borderColor: "#DCCFB8" }}
        >
          <ScoreRing score={data.wellnessScore} />

          <div className="flex-1 text-center sm:text-left">
            <h2
              className="text-lg font-semibold mb-1"
              style={{ color: "#556B4F" }}
            >
              Overall Wellness Score
            </h2>

            <p
              className="text-sm mb-4"
              style={{ color: "#9CAF88" }}
            >
              Based on your assessment responses
            </p>

            <div
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "#A8B79E30",
                color: "#556B4F",
              }}
            >
              Good Progress
            </div>

            <div className="flex flex-col gap-3">
              <ProgressBar
                label="Sleep Score"
                value={data.sleepScore}
              />

              <ProgressBar
                label="Activity Level"
                value={
                  data.activityLevel === "Very Active"
                    ? 100
                    : data.activityLevel === "Active"
                    ? 80
                    : data.activityLevel === "Moderate"
                    ? 60
                    : data.activityLevel === "Minimal"
                    ? 30
                    : 10
                }
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-center"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2
            className="text-base font-semibold"
            style={{ color: "#556B4F" }}
          >
            Stress Level
          </h2>

          <p
            className="text-sm mt-1 mb-4"
            style={{ color: "#9CAF88" }}
          >
            Based on your daily patterns
          </p>

          <div
            className="text-center py-4 rounded-xl"
            style={{
              backgroundColor:
                stressColor[data.stressLevel] + "20",
            }}
          >
            <p
              className="text-2xl font-bold"
              style={{
                color: stressColor[data.stressLevel],
              }}
            >
              {data.stressLevel}
            </p>
          </div>
        </motion.div>

      </div>

        {/* Dosha Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-base font-semibold mb-3" style={{ color: "#556B4F" }}>
            Prakriti Balance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {doshas.map((dosha, i) => (
            <motion.div
              key={dosha.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative overflow-hidden rounded-2xl h-40 shadow-sm hover:shadow-xl cursor-pointer"
            >
              <img
                src={dosha.image}
                alt={dosha.label}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",
                }}
              />

              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                <p className="text-2xl font-bold text-white">
                  {dosha.value}%
                </p>

                <p className="text-sm font-semibold text-white">
                  {dosha.label}
                </p>

                <p className="text-xs text-gray-200">
                  {dosha.desc}
                </p>
              </div>
            </motion.div>
          ))}
          </div>
        </motion.div>

        {/* Lifestyle Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: "#556B4F" }}>
            Lifestyle Suggestions
          </h2>
          <div className="flex flex-col gap-3">
            {data.suggestions.map((tip, i) => (
              <motion.div
                key={i}
                whileHover={{
                  x: 8,
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: "#F5F1E8" }}
              >
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
                >
                  ✓
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "#556B4F" }}>
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
          transition={{ duration: 0.4, delay: 0.5 }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() => navigate("/assessment")}
            className="py-4 rounded-2xl text-sm font-semibold shadow-sm hover:shadow-xl transition-all"
            style={{
              border: "1px solid #556B4F",
              color: "#556B4F",
              backgroundColor: "white",
            }}
          >
            Retake Assessment →
          </motion.button>

          <motion.button
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() => navigate("/store")}
            className="py-4 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-2xl transition-all"
            style={{
              backgroundColor: "#556B4F",
              color: "#F5F1E8",
            }}
          >
            Explore Wellness Store →
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;