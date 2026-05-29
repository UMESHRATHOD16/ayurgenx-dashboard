import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, scale } from "framer-motion";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = items.reduce(
    (acc, item) => acc + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  const handleQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: "#556B4F" }}>
              Your Cart
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#9CAF88" }}>
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs font-medium cursor-pointer"
              style={{ color: "#9CAF88" }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border rounded-2xl p-12 text-center"
            style={{ borderColor: "#DCCFB8" }}
          >
            <p className="text-base font-semibold mb-1" style={{ color: "#556B4F" }}>
              Your cart is empty
            </p>
            <p className="text-sm mb-6" style={{ color: "#9CAF88" }}>
              Add some wellness products to get started
            </p>
            <button
              onClick={() => navigate("/store")}
              className="px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
            >
              Browse Store
            </button>
          </motion.div>
        )}

        {/* Cart Items */}
        {items.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{
                    y: -4,
                  }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-lg"
                    style={{ borderColor: "#DCCFB8" }}
                  >
                    {/* Image Placeholder */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => navigate(`/store/${item.id}`)}
                        className="text-left"
                      >
                        <h3
                          className="text-sm font-semibold leading-snug hover:underline cursor-pointer"
                          style={{ color: "#556B4F" }}
                        >
                          {item.name}
                        </h3>
                      </button>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-xs shrink-0 px-2 py-1 rounded-lg transition-all hover:bg-gray-50 cursor-pointer"
                          style={{ color: "#9CAF88" }}
                        >
                          Remove
                        </button>
                      </div>

                      <p className="text-xs" style={{ color: "#9CAF88" }}>
                        {item.weight}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div
                          className="flex items-center gap-4 border rounded-xl px-4 py-2 shadow-sm"
                          style={{ borderColor: "#DCCFB8" }}
                        >
                          <button
                            onClick={() => handleQuantity(item.id, item.quantity - 1)}
                            className="text-base font-medium cursor-pointer"
                            style={{ color: "#556B4F" }}
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold w-4 text-center"
                            style={{ color: "#556B4F" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantity(item.id, item.quantity + 1)}
                            className="text-base font-medium cursor-pointer"
                            style={{ color: "#556B4F" }}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: "#556B4F" }}>
                            Rs {item.price * item.quantity}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs" style={{ color: "#9CAF88" }}>
                              Rs {item.price} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Delivery Notice */}
            {delivery === 0 ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-3 rounded-xl text-sm text-center font-medium"
                style={{ backgroundColor: "#A8B79E30", color: "#556B4F", border: "1px solid #A8B79E" }}
              >
                You have unlocked free delivery
              </motion.div>
            ) : (
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "#DCCFB8" }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min((subtotal / 999) * 100, 100)}%`,
                    backgroundColor: "#556B4F",
                  }}
                />
              </div>
            )}

            {/* Order Summary */}
            <div
              className="bg-white border rounded-2xl p-6 flex flex-col gap-3"
              style={{ borderColor: "#DCCFB8" }}
            >
              <h2 className="text-base font-semibold mb-1" style={{ color: "#556B4F" }}>
                Price Summary
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
                <span style={{ color: "#556B4F" }}>Total</span>
                <span style={{ color: "#556B4F" }}>Rs {total}</span>
                {discount > 0 && (
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#556B4F" }}
                  >
                    You saved Rs {discount}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/store")}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer"
                style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
              >
                Continue Shopping
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/order-summary")}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all cursor-pointer"
                style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
              >
                Proceed to Order
              </motion.button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Cart;