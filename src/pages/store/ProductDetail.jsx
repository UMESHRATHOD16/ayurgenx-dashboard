import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { products } from "../../data/products";
import { useState } from "react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = products.find((p) => p.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(false);
  const [activeTab, setActiveTab] = useState("benefits");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F1E8" }}>
        <div className="text-center">
          <p className="text-lg font-semibold mb-2" style={{ color: "#556B4F" }}>
            Product not found
          </p>
          <button
            onClick={() => navigate("/store")}
            className="text-sm underline"
            style={{ color: "#9CAF88" }}
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const tabs = ["benefits", "how to use"];

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Back */}

        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/store")}
          className="flex items-center gap-2 text-sm w-fit px-3 py-2 rounded-xl transition-all cursor-pointer"
          style={{
            color: "#556B4F",
            backgroundColor: "#FFFFFF",
            border: "1px solid #DCCFB8",
          }}
        >
          <span>←</span>
          <span>Back to Store</span>
        </motion.button>

        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border rounded-2xl overflow-hidden"
          style={{ borderColor: "#DCCFB8" }}
        >
          {/* Image */}
          <div className="overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-72 object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-6 flex flex-col gap-4">

            {/* Tag + Name */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-semibold leading-snug" style={{ color: "#556B4F" }}>
                {product.name}
              </h1>
              <span
                className="text-xs px-2.5 py-1 rounded-full shrink-0 font-medium"
                style={{ backgroundColor: "#F5F1E8", color: "#9CAF88", border: "1px solid #DCCFB8" }}
              >
                {product.tag}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        star <= Math.round(product.rating) ? "#556B4F" : "#DCCFB8",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: "#9CAF88" }}>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold" style={{ color: "#556B4F" }}>
                Rs {product.price}
              </span>
              <span className="text-sm line-through" style={{ color: "#9CAF88" }}>
                Rs {product.originalPrice}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ backgroundColor: "#A8B79E30", color: "#556B4F" }}
              >
                {discount}% off
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "#9CAF88" }}>
              {product.description}
            </p>
              
             <div className="flex flex-wrap gap-2">
            {[
              "Natural Ingredients",
              "Ayurvedic Formula",
              "Lab Tested",
              "Fast Delivery",
            ].map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "#F5F1E8",
                  color: "#556B4F",
                  border: "1px solid #DCCFB8",
                }}
              >
                {item}
              </span>
            ))}
          </div>   

            {/* Tabs */}
            <div>
              <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "#DCCFB8" }}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 text-sm font-medium capitalize transition-all"
                    style={{
                      color: activeTab === tab ? "#556B4F" : "#9CAF88",
                      borderBottom: activeTab === tab ? "2px solid #556B4F" : "2px solid transparent",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "benefits" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-2"
                >
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: "#556B4F" }}
                      />
                      <p className="text-sm" style={{ color: "#556B4F" }}>{b}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "how to use" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "#556B4F" }}>
                    {product.howToUse}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: "#556B4F" }}>
                Quantity
              </span>
              <div className="flex items-center gap-4 border rounded-xl px-4 py-2 shadow-sm"
                style={{ borderColor: "#DCCFB8" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-lg font-medium w-5 text-center cursor-pointer"
                  style={{ color: "#556B4F" }}
                >
                  -
                </button>
                <span className="text-sm font-semibold w-4 text-center"
                  style={{ color: "#556B4F" }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-lg font-medium w-5 text-center cursor-pointer"
                  style={{ color: "#556B4F" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3 border-t border-b"
              style={{ borderColor: "#DCCFB8" }}>
              <span className="text-sm font-medium" style={{ color: "#9CAF88" }}>
                Total
              </span>
              <span className="text-lg font-bold" style={{ color: "#556B4F" }}>
                Rs {product.price * quantity}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer"
                style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate("/cart"), 300);
                }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
                style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
              >
                Buy Now
              </motion.button>
            </div>

          </div>
        </motion.div>

      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-md"
          style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
        >
          Added to cart successfully
        </motion.div>
      )}

    </div>
  );
};

export default ProductDetail;