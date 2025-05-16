import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    return guestCart;
  });
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);

  // Tải giỏ hàng khi userId thay đổi
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (!userId) {
        // Người dùng chưa đăng nhập: Lấy từ guestCart
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCartItems(guestCart);
        setCartCount(guestCart.length);
      } else {
        // Người dùng đã đăng nhập: Lấy từ API
        try {
          const response = await apiRequest(`/cart/user/${userId}`);
          const items = response.cartDetails || [];
          setCartItems(items);
          setCartCount(items.length);
        } catch (err) {
          if (err.response?.status === 404) {
            // Giỏ hàng không tồn tại: Đặt giỏ hàng rỗng
            setCartItems([]);
            setCartCount(0);
          } else if (err.message.includes("hết hạn")) {
            setCartItems([]);
            setCartCount(0);
          } else {
            toast.error("Không thể tải giỏ hàng: " + err.message);
          }
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, [userId]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (game) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      // Người dùng chưa đăng nhập: Thêm vào guestCart
      try {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        if (guestCart.some((item) => item.gameId === game.gameId)) {
          toast.error("Sản phẩm đã có trong giỏ hàng.");
          return false;
        }

        // Xử lý imageUrl
        let imageUrl = game.imageUrl || "";
        if (!imageUrl && game.gameImages && game.gameImages.length > 0) {
          imageUrl = game.gameImages[0].imageUrl || "";
        }

        guestCart.push({
          gameId: game.gameId,
          unitPrice: game.unitPrice,
          gameName: game.gameName,
          imageUrl: imageUrl,
        });
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems(guestCart);
        setCartCount(guestCart.length);
        //console.log('Updated cartItems:', guestCart); // Debug
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        return true;
      } catch (err) {
        toast.error("Không thể thêm vào giỏ hàng: " + err.message);
        return false;
      }
    }

    // Người dùng đã đăng nhập: Gửi yêu cầu đến API
    try {
      const addToCartData = {
        userId: parseInt(userId),
        gameId: game.gameId,
        unitPrice: game.unitPrice,
      };
      await apiRequest("/cart/add", "POST", addToCartData);
      const response = await apiRequest(`/cart/user/${userId}`);
      const items = response.cartDetails || [];
      setCartItems(items);
      setCartCount(items.length);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      return true;
    } catch (err) {
      toast.error(err.message || "Không thể thêm vào giỏ hàng.");
      return false;
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (item) => {
    if (!userId) {
      // Người dùng chưa đăng nhập: Xóa từ guestCart
      try {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const updatedCart = guestCart.filter(
          (cartItem) => cartItem.gameId !== item.gameId
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        setCartCount(updatedCart.length);
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
        return true;
      } catch (err) {
        toast.error("Không thể xóa sản phẩm: " + err.message);
        return false;
      }
    }

    // Người dùng đã đăng nhập: Gửi yêu cầu đến API
    try {
      await apiRequest(`/cart/remove-detail/${item.cartDetailId}`, "DELETE");
      const response = await apiRequest(`/cart/user/${userId}`);
      const items = response.cartDetails || [];
      setCartItems(items);
      setCartCount(items.length);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
      return true;
    } catch (err) {
      toast.error(err.message || "Không thể xóa sản phẩm.");
      return false;
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!userId) {
      // Người dùng chưa đăng nhập: Xóa guestCart
      try {
        localStorage.removeItem("guestCart");
        setCartItems([]);
        setCartCount(0);
        return true;
      } catch (err) {
        toast.error("Không thể xóa giỏ hàng: " + err.message);
        return false;
      }
    }

    // Người dùng đã đăng nhập: Gửi yêu cầu đến API
    try {
      await apiRequest(`/cart/user/${userId}`, "DELETE");
      setCartItems([]);
      setCartCount(0);
      return true;
    } catch (err) {
      toast.error(err.message || "Không thể xóa giỏ hàng.");
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems, 
        cartCount,
        setCartCount, 
        addToCart,
        removeFromCart,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
