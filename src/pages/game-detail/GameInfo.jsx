import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { WishlistContext } from "../../context/WishlistContext";

function GameInfo({ game, gameId }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!game || !game.price) {
      toast.error("Dữ liệu game không hợp lệ.");
      return;
    }
    setIsAdding(true);
    const success = await addToCart({
      gameId: parseInt(gameId),
      unitPrice: game.price,
      gameName: game.title,
      imageUrl: game.gameImages?.length > 0 ? game.gameImages[0].imageUrl : "",
    });
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (!game || !game.price) {
      toast.error("Dữ liệu game không hợp lệ.");
      return;
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const isAlreadyInCart = cartItems.some((item) => item.gameId === parseInt(gameId));

    if (!isAlreadyInCart) {
      // Nếu chưa có, thêm vào giỏ
      setIsAdding(true);
      const success = await addToCart({
        gameId: parseInt(gameId),
        unitPrice: game.price,
        gameName: game.title,
        imageUrl: game.gameImages?.length > 0 ? game.gameImages[0].imageUrl : "",
      });
      setIsAdding(false);
      if (!success) {
        // Nếu thêm thất bại, không chuyển hướng
        return;
      }
    }

    // Chuyển hướng đến trang checkout
    navigate("/checkout");
  };

  const handleToggleWishlist = async () => {
    const gameIdNum = parseInt(gameId);
    if (isInWishlist(gameIdNum)) {
      await removeFromWishlist(gameIdNum);
      toast.info("Đã xóa khỏi wishlist");
    } else {
      await addToWishlist(gameIdNum);
      toast.success("Đã thêm vào wishlist");
    }
  };

  return (
    <div className="text-center md:text-left">
      <h1 className="text-5xl font-bold text-gray-800 mb-2 mt-0">{game.title}</h1>
      {game.isGOTY && (
        <span className="inline-block bg-pink-500 text-white text-sm px-2 py-1 rounded-full mb-2">
          Game of the Year
        </span>
      )}

      <p className="text-gray-600 mb-2">
        <strong>Lượt xem:</strong> {game.viewCount}
      </p>

      <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
        <button
          onClick={handleToggleWishlist}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
          title={isInWishlist(parseInt(gameId)) ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
        >
          {isInWishlist(parseInt(gameId)) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>
        <span className="text-gray-600">
          {isInWishlist(parseInt(gameId)) ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}
        </span>
      </div>

      <div className="flex flex-row gap-4 items-start mb-4">
        <div className="w-1/3 text-left">
          <p className="text-2xl text-gray-800 font-semibold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(game.price)}
          </p>
        </div>
        <div className="w-2/3 flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200 ${
              isAdding ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isAdding}
            className={`w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 ${
              isAdding ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameInfo;
