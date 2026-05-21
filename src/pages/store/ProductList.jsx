import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { products, categories } from "../../data/products";
import { motion } from "framer-motion";

const ProductCard = ({ product, onViewDetail, onAddToCart }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white border rounded-2xl p-5 flex flex-col gap-3"
    style={{ borderColor: "#DCCFB8" }}
  >
    {/* Image Placeholder */}
    <div
      className="w-full h-36 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: "#F5F1E8" }}
    >
      <span className="text-sm font-medium" style={{ color: "#9CAF88" }}>
        {product.category}
      </span>
    </div>

    {/* Tag + Name */}
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-sm font-semibold leading-snug" style={{ color: "#556B4F" }}>
        {product.name}
      </h3>
      <span
        className="text-xs px-2 py-0.5 rounded-full shrink-0 font-medium"
        style={{ backgroundColor: "#F5F1E8", color: "#9CAF88", border: "1px solid #DCCFB8" }}
      >
        {product.tag}
      </span>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: star <= Math.round(product.rating) ? "#556B4F" : "#DCCFB8",
            }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: "#9CAF88" }}>
        {product.rating} ({product.reviews} reviews)
      </span>
    </div>

    {/* Price */}
    <div className="flex items-center gap-2">
      <span className="text-base font-bold" style={{ color: "#556B4F" }}>
        Rs {product.price}
      </span>
      <span
        className="text-xs line-through"
        style={{ color: "#9CAF88" }}
      >
        Rs {product.originalPrice}
      </span>
      <span
        className="text-xs font-medium px-1.5 py-0.5 rounded"
        style={{ backgroundColor: "#A8B79E30", color: "#556B4F" }}
      >
        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
      </span>
    </div>

    {/* Buttons */}
    <div className="flex gap-2 mt-1">
      <button
        onClick={() => onViewDetail(product.id)}
        className="flex-1 py-2 rounded-lg text-xs font-medium border transition-all"
        style={{ borderColor: "#556B4F", color: "#556B4F", backgroundColor: "white" }}
      >
        View Details
      </button>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onAddToCart(product)}
        className="flex-1 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90"
        style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
      >
        Add to Cart
      </motion.button>
    </div>
  </motion.div>
);

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setToast(`${product.name} added to cart`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#F5F1E8" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "#556B4F" }}>
            AyurGenX Store
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9CAF88" }}>
            Premium Ayurvedic wellness products
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{
              backgroundColor: "white",
              borderColor: "#DCCFB8",
              color: "#556B4F",
            }}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200"
              style={{
                backgroundColor: activeCategory === cat ? "#556B4F" : "white",
                borderColor: activeCategory === cat ? "#556B4F" : "#DCCFB8",
                color: activeCategory === cat ? "#F5F1E8" : "#556B4F",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs mb-4" style={{ color: "#9CAF88" }}>
          Showing {filtered.length} products
        </p>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={(id) => navigate(`/store/${id}`)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16 rounded-2xl border"
            style={{ borderColor: "#DCCFB8", backgroundColor: "white" }}
          >
            <p className="text-sm font-medium" style={{ color: "#556B4F" }}>
              No products found
            </p>
            <p className="text-xs mt-1" style={{ color: "#9CAF88" }}>
              Try a different category or search term
            </p>
          </div>
        )}

        {/* Cart CTA */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
            style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
          >
            View Cart
          </button>
        </div>

      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-medium shadow-md"
          style={{ backgroundColor: "#556B4F", color: "#F5F1E8" }}
        >
          {toast}
        </motion.div>
      )}

    </div>
  );
};

export default ProductList;