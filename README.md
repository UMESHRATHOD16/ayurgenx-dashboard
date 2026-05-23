# AyurGenX Frontend Dashboard

A clean, responsive frontend prototype for AyurGenX

---

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Redux Toolkit + React Redux
- React Router DOM v7
- Framer Motion

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or above)
- npm

### Installation

1. Clone the repository

   git clone https://github.com/UMESHRATHOD16/ayurgenx-dashboard

2. Navigate into the project directory

   cd ayurgenx-dashboard

3. Install dependencies

   npm install

4. Start the development server

   npm run dev

5. Open your browser and visit

   http://localhost:5173

---

## Features Completed

### Authentication
- Login screen with form validation and error messages
- Signup screen with password confirmation validation
- Protected routes — unauthenticated users are redirected to login
- Auth state managed globally with Redux Toolkit

### User Profile
- First time setup flow — user fills profile on signup
- Static profile view with gradient banner and wellness goal display
- Edit profile with smooth animated transition
- Fields include name, age, gender, lifestyle type and wellness goal

### Wellness Assessment
- 10 question prakriti style wellness assessment
- Covers sleep, stress, digestion, energy, activity, water intake, food routine, mental clarity, emotional balance and overall wellness
- Animated slide transition between questions with direction awareness
- Progress bar showing completion percentage
- Next button disabled until current question is answered
- Score calculated from answers and stored in Redux

### Result Dashboard
- Animated SVG wellness score ring
- Vata, Pitta, Kapha percentage cards
- Sleep score and activity level progress bars
- Stress level badge with color based on severity
- Three personalised lifestyle suggestions
- Falls back to dummy data if assessment not taken

### AyurGenX Store
- Product listing with search and category filter
- 10 dummy products across 5 categories
- Discount percentage calculated and displayed on each card
- Product detail page with benefits and how to use tabs
- Quantity selector with live total calculation
- Add to cart and buy now functionality
- Cart page with quantity update, remove item and clear all
- Free delivery unlocks above Rs 999
- Order summary with delivery address form and validation
- Cash on delivery payment option
- Order placed success screen with dummy order ID

### Admin Preview
- Total users, assessment submissions and total orders stat cards
- Order status breakdown with color coded counts
- Recent orders table with desktop and mobile responsive views
- All 5 order statuses covered — Pending, Confirmed, Shipped, Delivered, Cancelled

### General
- Fully responsive design for mobile and desktop
- Framer Motion animations throughout — page transitions, cards, progress indicators
- Redux Toolkit for global state — auth, cart and assessment slices
- React Router with protected route wrapper
- Toast notifications on cart actions
- AyurGenX brand color palette applied consistently

---

## Project Structure

```
src/
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── profile/
│   │   └── UserProfile.jsx
│   ├── assessment/
│   │   └── Assessment.jsx
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   ├── store/
│   │   ├── ProductList.jsx
│   │   ├─  ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   └── OrderSummary.jsx
│   └── admin/
│       └── AdminPreview.jsx
├── components/
│   └── layout/
│       └── Navbar.jsx
├── store/
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   └── assessmentSlice.js
│   └── store.js
├── data/
│   ├── products.js
│   └── adminData.js
├── App.jsx
└── main.jsx
```

---

## Dummy Data

All product data, wellness results, admin statistics and order data is dummy and hardcoded locally. No backend or external API is used. Redux manages all runtime state in memory.

---

## Challenges Faced

- Tailwind CSS v4 uses a new CSS based theme configuration instead of tailwind.config.js. Custom colors had to be defined using the @theme directive in index.css and applied via inline styles in some components.

- Preventing unnecessary re-renders on the profile page required moving inner component definitions outside the parent component so React would not remount them on every state change.

- Designing the assessment score calculation to feel meaningful while staying completely dummy required mapping option indexes to scores and deriving Vata, Pitta and Kapha values proportionally.

---

## What Can Be Improved

- Extract reusable ui components like Button, Input, Toast and StatusBadge to avoid repetition
- Move hardcoded data to centralised data files and import where needed
- Centralise inline color values into a theme utility
- Persist Redux state using localStorage so data survives page refresh
- Add loading skeletons for better perceived performance
- Integrate react hook form for scalable form management
- Write unit tests for components and Redux slices

---

## Author

Rathod Umesh
