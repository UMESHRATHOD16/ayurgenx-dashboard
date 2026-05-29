import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { products, categories } from "../../data/products";
import { motion } from "framer-motion";

const ProductCard = ({ product, onViewDetail, onAddToCart, index }) => (
    <motion.div
      onClick={() => onViewDetail(product.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.01,
      }}
    className="bg-white border rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-xl transition-all duration-10 cursor-pointer"
    style={{ borderColor: "#DCCFB8" }}
  >
    {/* Image Placeholder */}
    <div className="overflow-hidden rounded-xl">
    <div className="overflow-hidden rounded-xl">
      <motion.img
        src={product.image}
        alt={product.name}
        className="w-full h-52 object-cover"
        whileHover={{
          scale: 1.06,
        }}
        transition={{
          duration: 0.4,
        }}
      />
    </div>
    </div>

    {/* Tag + Name */}
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-base font-semibold leading-snug" style={{ color: "#556B4F" }}>
        {product.name}
      </h3>
      <span
        className="text-xs px-2.5 py-1 rounded-full shrink-0 font-medium"
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
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
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
        <motion.div
            whileHover={{
              y: -2,
            }}
            transition={{
              duration: 0.2,
            }}
            className="relative"
          >
        <div className="mb-4">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#9CAF88"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search Ayurvedic products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none shadow-sm transition-all duration-300 focus:shadow-md"
            style={{
              backgroundColor: "white",
              borderColor: "#DCCFB8",
              color: "#556B4F",
            }}
          />
        </div>
        </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer relative h-12 w-40 overflow-hidden before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:m-auto before:h-0 before:w-0 before:rounded-sm before:bg-[#556B4F] before:duration-450 before:ease-out hover:shadow-[#556B4F] hover:before:h-40 hover:before:w-40 hover:before:opacity-80"
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
        <p className="text-xs mb-5" style={{ color: "#9CAF88" }}>
          Showing {filtered.length} products
        </p>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index = {index}
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