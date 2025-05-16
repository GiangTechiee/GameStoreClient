import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { FaTimes } from "react-icons/fa";

function Cart() {
  const { cartItems, cartCount, removeFromCart, clearCart, isLoading } =
    useCart();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  // Kiểm tra xem tất cả sản phẩm có được chọn hay không
  const isAllSelected =
    cartItems.length > 0 &&
    cartItems.every((item) =>
      selectedItems.includes(userId ? item.cartDetailId : item.gameId)
    );

  // Chọn hoặc bỏ chọn sản phẩm
  const handleSelectItem = (item) => {
    const itemId = userId ? item.cartDetailId : item.gameId;
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Chọn hoặc hủy chọn tất cả sản phẩm
  const handleSelectAll = () => {
    if (isAllSelected) {
      // Hủy chọn tất cả
      setSelectedItems([]);
    } else {
      // Chọn tất cả
      const allItemIds = cartItems.map((item) =>
        userId ? item.cartDetailId : item.gameId
      );
      setSelectedItems(allItemIds);
    }
  };

  // Xóa tất cả sản phẩm
  const handleClearCart = async () => {
    try {
      await clearCart();
      setSelectedItems([]);
      toast.success("Đã xóa toàn bộ giỏ hàng.");
    } catch (err) {
      toast.error("Không thể xóa giỏ hàng: " + err.message);
    }
  };

  // Chuyển hướng đến checkout với sản phẩm được chọn
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(userId ? item.cartDetailId : item.gameId)
    );
    localStorage.setItem(
      "selectedCartItems",
      JSON.stringify(selectedCartItems)
    );
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Giỏ hàng ({cartCount} sản phẩm)
        </h1>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Giỏ hàng (0 sản phẩm)
        </h1>
        <p className="text-red-500">Giỏ hàng của bạn đang trống.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Giỏ hàng ({cartCount} sản phẩm)
      </h1>
      <div className="bg-white rounded-3xl shadow-md p-6 mx-4 sm:mx-8 md:mx-16 lg:mx-56">
        <div className="flex justify-between mb-4 items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="h-5 w-5 mr-4"
            />
            <span className="text-blue-500 hover:underline cursor-pointer">
              Chọn hết
            </span>
            </label>
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:underline"
            >
              Xóa hết
            </button>
        </div>
        <div className="grid gap-4 px-4 sm:px-6">
          {cartItems.map((item, index) => (
            <div
              key={userId ? item.cartDetailId : item.gameId}
              className={`flex items-center py-4 ${
                index < cartItems.length - 1
                  ? "border-b-2 border-purple-500"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(
                  userId ? item.cartDetailId : item.gameId
                )}
                onChange={() => handleSelectItem(item)}
                className="mr-4 h-5 w-5"
              />
              <img
                src={item.imageUrl || "https://picsum.photos/100/100"}
                alt={item.gameName}
                className="w-20 h-20 object-cover rounded-2xl mr-4"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.gameName}
                </h2>
                <p className="text-gray-600">
                  Giá:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.unitPrice)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                title="Xóa"
              >
                <FaTimes size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right px-4 sm:px-6">
          <p className="text-xl font-bold text-gray-800">
            Tổng cộng:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(
              cartItems
                .filter((item) =>
                  selectedItems.includes(
                    userId ? item.cartDetailId : item.gameId
                  )
                )
                .reduce(
                  (sum, item) =>
                    sum +
                    (typeof item.unitPrice === "number" ? item.unitPrice : 0),
                  0
                )
            )}
          </p>
          <button
            onClick={handleCheckout}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
