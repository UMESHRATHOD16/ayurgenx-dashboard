import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = items.reduce(
    (acc, item) => acc + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10 digit number";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Enter a valid 6 digit pincode";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return navigate("/store");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setPlaced(true);
    dispatch(clearCart());
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "Rathod Umesh", type: "text" },
    { name: "phone", label: "Phone Number", placeholder: "10 digit mobile number", type: "text" },
    { name: "address", label: "Delivery Address", placeholder: "House no, Street, Area", type: "text" },
    { name: "city", label: "City", placeholder: "Jalandhar", type: "text" },
    { name: "pincode", label: "Pincode", placeholder: "6 digit pincode", type: "text" },
  ];

  // Order placed success screen
  if (placed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F1E8" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white border rounded-2xl p-10 text-center"
          style={{ borderColor: "#DCCFB8" }}
        >
          {/* Success Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#556B4F" }}
          >
            <span className="text-2xl font-bold" style={{ color: "#F5F1E8" }}>
              ✔
            </span>
          </motion.div>

          <h2 className="text-xl font-semibold mb-2" style={{ color: "#556B4F" }}>
            Order Placed Successfully
          </h2>
          <p className="text-sm mb-1" style={{ color: "#9CAF88" }}>
            Thank you {user?.name?.split(" ")[0] || "there"}
          </p>
          <p className="text-sm mb-8" style={{ color: "#9CAF88" }}>
            Your order has been confirmed and will be delivered soon
          </p>

          {/* Dummy Order ID */}
          <div
            className="px-4 py-3 rounded-xl mb-8 text-sm font-medium"
            style={{ backgroundColor: "#F5F1E8", color: "#556B4F" }}
          >
            Order ID: AYG{Math.floor(100000 + Math.random() * 900000)}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/store")}
              className="w-full py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all cursor-pointer hover:translate-1"
              style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
            >
              Continue Shopping
            </button> 
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer hover:translate-1"
              style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "#556B4F" }}>
            Order Summary
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CAF88" }}>
            Review your order and enter delivery details
          </p>
        </div>

        {/* Items */}
        <div
          className="bg-white border rounded-2xl p-6 flex flex-col gap-4"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "#556B4F" }}>
            Items Ordered
          </h2>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1"
              style={{ borderColor: "#DCCFB8" }}
            >
              <div className="flex items-center gap-3">
              <motion.img
                whileHover={{ scale: 1.08 }}
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#556B4F" }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: "#9CAF88" }}>
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold shrink-0" style={{ color: "#556B4F" }}>
                Rs {item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div
          className="bg-white border rounded-2xl p-6 flex flex-col gap-3"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2 className="text-base font-semibold mb-1" style={{ color: "#556B4F" }}>
            Price Breakdown
          </h2>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#9CAF88" }}>Subtotal</span>
            <span style={{ color: "#556B4F" }}>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#9CAF88" }}>Discount</span>
            <span style={{ color: "#556B4F" }}>- Rs {discount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#9CAF88" }}>Delivery</span>
            <span style={{ color: "#556B4F" }}>
              {delivery === 0 ? "Free" : `Rs ${delivery}`}
            </span>
          </div>
          <div
            className="flex justify-between text-base font-bold pt-3 border-t"
            style={{ borderColor: "#DCCFB8" }}
          >
            <span style={{ color: "#556B4F" }}>Total Payable</span>
            <span style={{ color: "#556B4F" }}>Rs {total}</span>
          </div>
        </div>

        {/* Delivery Form */}
        <div
          className="bg-white border rounded-2xl p-6 flex flex-col gap-5"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "#556B4F" }}>
            Delivery Details
          </h2>
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: "#556B4F" }}>
                {field.label}
              </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-300 hover:shadow-md focus:shadow-lg"
              style={{
                backgroundColor: "#F5F1E8",
                borderColor: errors[field.name] ? "#f87171" : "#DCCFB8",
                color: "#556B4F",
                cursor: "text",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#556B4F";
                e.target.style.transform = "translateY(-2px)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors[field.name]
                  ? "#f87171"
                  : "#DCCFB8";
                e.target.style.transform = "translateY(0)";
              }}
            />
              {errors[field.name] && (
                <span className="text-xs" style={{ color: "#f87171" }}>
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Payment Method — dummy */}
        <div
          className="bg-white border rounded-2xl p-6"
          style={{ borderColor: "#DCCFB8" }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: "#556B4F" }}>
            Payment Method
          </h2>
          <div
            className="flex items-center gap-3 p-4 rounded-xl border"
            style={{ borderColor: "#556B4F", backgroundColor: "#F5F1E8" }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#556B4F" }}
            />
            <span className="text-sm font-medium" style={{ color: "#556B4F" }}>
              Cash on Delivery
            </span>
          </div>
        </div>

        {/* Place Order */}
        <motion.button
          whileHover={{
            y: -3,
            scale: 1.01,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={handlePlaceOrder}
          className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-95 transition-all shadow-md hover:shadow-xl cursor-pointer"
          style={{
            backgroundColor: "#556B4F",
            color: "#F5F1E8",
          }}
        >
          Place Order →
        </motion.button>

      </div>
    </div>
  );
};

export default OrderSummary;