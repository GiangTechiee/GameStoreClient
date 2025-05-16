import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GameDetail from "./pages/game-detail/GameDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { WishlistProvider } from "./context/WishlistContext";

import CategoryManagement from "./pages/category-management/CategoryManagement";
import GameManagement from "./pages/game-management/GameManagement";
import UserManagement from "./pages/user-management/UserManagement";
import GameListPage from "./pages/game-list/GameListPage";

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<GameListPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game/:gameId" element={<GameDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/support"
                  element={
                    <div className="container mx-auto p-4">
                      Support Page (Coming Soon)
                    </div>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <div className="container mx-auto p-4">
                      About Page (Coming Soon)
                    </div>
                  }
                />
                <Route
                  path="*"
                  element={
                    <div className="container mx-auto p-4">
                      404 - Page Not Found
                    </div>
                  }
                />

                <Route
                  path="/admin/categories"
                  element={<CategoryManagement />}
                />
                <Route path="/admin/games" element={<GameManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
              </Routes>
            </div>
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
