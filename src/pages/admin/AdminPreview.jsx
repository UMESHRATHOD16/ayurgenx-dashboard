import { motion } from "framer-motion";
import { adminStats, recentOrders } from "../../data/adminData";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Pending: { bg: "#FEF3C7", text: "#D97706" },
  Confirmed: { bg: "#DBEAFE", text: "#2563EB" },
  Shipped: { bg: "#E0E7FF", text: "#4F46E5" },
  Delivered: { bg: "#A8B79E30", text: "#556B4F" },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

const StatCard = ({ label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white border rounded-2xl p-6"
    style={{ borderColor: "#DCCFB8" }}
  >
    <p className="text-sm font-medium mb-2" style={{ color: "#9CAF88" }}>
      {label}
    </p>
    <p className="text-3xl font-bold" style={{ color: "#556B4F" }}>
      {value.toLocaleString()}
    </p>
  </motion.div>
);

const AdminPreview = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold" style={{ color: "#556B4F" }}>
            Admin Preview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CAF88" }}>
            Overview of platform activity and recent orders
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Users"
            value={adminStats.totalUsers}
            delay={0.1}
          />
          <StatCard
            label="Assessment Submissions"
            value={adminStats.assessmentSubmissions}
            delay={0.2}
          />
          <StatCard
            label="Total Orders"
            value={adminStats.totalOrders}
            delay={0.3}
          />
        </div>

        {/* Order Status Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white border rounded-2xl p-6"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: "#556B4F" }}>
            Order Status Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(statusColors).map(([status, colors]) => {
              const count = recentOrders.filter((o) => o.status === status).length;
              return (
                <div
                  key={status}
                  className="flex flex-col items-center justify-center p-3 rounded-xl gap-1"
                  style={{ backgroundColor: colors.bg }}
                >
                  <span className="text-xl font-bold" style={{ color: colors.text }}>
                    {count}
                  </span>
                  <span className="text-xs font-medium text-center" style={{ color: colors.text }}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white border rounded-2xl overflow-hidden"
          style={{ borderColor: "#DCCFB8" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#DCCFB8" }}>
            <h2 className="text-base font-semibold" style={{ color: "#556B4F" }}>
              Recent Orders
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#F5F1E8" }}>
                  {["Order ID", "Customer", "Product", "Amount", "Status"].map((col) => (
                    <th
                      key={col}
                      className="text-left px-6 py-3 text-xs font-semibold"
                      style={{ color: "#9CAF88" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                    className="border-t"
                    style={{ borderColor: "#DCCFB8" }}
                  >
                    <td className="px-6 py-4 text-xs font-medium" style={{ color: "#556B4F" }}>
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#556B4F" }}>
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#9CAF88" }}>
                      {order.product}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#556B4F" }}>
                      Rs {order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: statusColors[order.status]?.bg,
                          color: statusColors[order.status]?.text,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden flex flex-col divide-y" style={{ borderColor: "#DCCFB8" }}>
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "#556B4F" }}>
                    {order.id}
                  </span>
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: statusColors[order.status]?.bg,
                      color: statusColors[order.status]?.text,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: "#556B4F" }}>
                  {order.customer}
                </p>
                <p className="text-xs" style={{ color: "#9CAF88" }}>
                  {order.product}
                </p>
                <p className="text-sm font-semibold" style={{ color: "#556B4F" }}>
                  Rs {order.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-end"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
          >
            Back to Dashboard
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminPreview;