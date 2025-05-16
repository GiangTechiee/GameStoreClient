import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { apiRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { setCartItems, setCartCount } = useCart();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedCartItems, setSelectedCartItems] = useState([]);

  // Lấy selectedCartItems từ localStorage khi component mount
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("selectedCartItems")) || [];
    setSelectedCartItems(items);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId && (!formData.customerName || !formData.customerEmail)) {
      toast.error("Vui lòng cung cấp tên và email.");
      return;
    }

    try {
      const orderData = {
        userId: userId ? parseInt(userId) : null,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        orderDetails: selectedCartItems.map((item) => ({
          gameId: item.gameId,
          unitPrice: item.unitPrice,
        })),
      };

      const response = await apiRequest("/order", "POST", orderData);
      toast.success("Đặt hàng thành công! Mã đơn hàng: " + response.orderId);

      // Xóa giỏ hàng
      if (!userId) {
        localStorage.removeItem("guestCart");
      } else {
        // Xóa các sản phẩm đã đặt khỏi giỏ hàng của người dùng đăng nhập
        const remainingItems = (await apiRequest(`/cart/user/${userId}`)).cartDetails || [];
        setCartItems(remainingItems);
        setCartCount(remainingItems.length);
      }
      localStorage.removeItem("selectedCartItems");
      setSelectedCartItems([]);
      setOrderPlaced(true);

      // Chuyển hướng về trang chủ sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("Không thể đặt hàng: " + err.message);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto p-4 text-center max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>
        <p className="text-green-500">Cảm ơn bạn đã đặt hàng. Bạn sẽ được chuyển về trang chủ...</p>
      </div>
    );
  }

  if (!selectedCartItems || selectedCartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Thanh toán</h1>
        <p className="text-red-500">Không có sản phẩm nào được chọn để thanh toán.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Thanh toán</h1>
      <div className="bg-white rounded-3xl shadow-md p-6 mx-4 sm:mx-8 md:mx-16 lg:mx-56">
        {!userId && (
          <div className="mb-6 px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Tên *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </form>
          </div>
        )}
        <div className="mb-6 px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
          <div className="grid gap-4">
            {selectedCartItems.map((item, index) => (
              <div
                key={item.gameId}
                className={`flex items-center py-4 ${
                  index < selectedCartItems.length - 1 ? "border-b-2 border-purple-500" : ""
                }`}
              >
                <img
                  src={item.imageUrl || "https://picsum.photos/100/100"}
                  alt={item.gameName}
                  className="w-20 h-20 object-cover rounded mr-4"
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.gameName}</h3>
                  <p className="text-gray-600">
                    Giá: {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.unitPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xl font-bold text-gray-800 mt-4">
            Tổng cộng: {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(
              selectedCartItems.reduce(
                (sum, item) => sum + (typeof item.unitPrice === "number" ? item.unitPrice : 0),
                0
              )
            )}
          </p>
        </div>
        <div className="text-right px-4 sm:px-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;