import { useState, useEffect, useContext } from 'react';
import { WishlistContext } from '../../context/WishlistContext';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

function WishlistModal({ isOpen, onClose }) {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);

  // Xóa game khỏi wishlist
  const handleRemove = async (wishlistItemId, gameName) => {
    try {
      await removeFromWishlist(wishlistItemId);
      toast.success(`Đã xóa "${gameName}" khỏi danh sách yêu thích!`);
    } catch (err) {
      toast.error("Không thể xóa game: " + err.message);
    }
  };

  // Định dạng ngày, xử lý Invalid Date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleString("vi-VN");
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? new Date().toLocaleString("vi-VN")
      : date.toLocaleString("vi-VN");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Danh Sách Yêu Thích</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        {wishlistItems.length === 0 ? (
          <p className="text-gray-600">Không có game nào trong danh sách yêu thích.</p>
        ) : (
          <ul className="space-y-4">
            {wishlistItems.map((item) => (
              <li
                key={item.wishlistItemId}
                className="flex items-center justify-between p-2 border-b"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <span className="text-gray-800 font-medium">{item.gameName}</span>
                  <span className="text-gray-600 text-sm">
                    Thêm vào: {formatDate(item.addedAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(item.wishlistItemId, item.gameName)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WishlistModal;