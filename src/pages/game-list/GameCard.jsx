import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaAndroid,
  FaShoppingCart,
} from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";
import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function GameCard({ game }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useCart();

  // Default platform icons
  const defaultIcons = {
    Windows: <FaWindows className="text-blue-500" size={20} />,
    PlayStation: <FaPlaystation className="text-blue-700" size={20} />,
    Xbox: <FaXbox className="text-green-500" size={20} />,
    NintendoSwitch: <SiNintendoswitch className="text-red-500" size={20} />,
    iOS: <FaApple className="text-gray-700" size={20} />,
    Android: <FaAndroid className="text-green-600" size={20} />,
  };

  // Map database platform values to standardized names
  const platformMap = {
    PC: "Windows",
    PS: "PlayStation",
    Xbox: "Xbox",
    NS: "NintendoSwitch",
    iOS: "iOS",
    Android: "Android",
  };

  // Handle wishlist toggle
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    const gameId = game.gameId;
    if (isInWishlist(gameId)) {
      await removeFromWishlist(gameId);
    } else {
      await addToWishlist(gameId);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    const cartItem = {
      gameId: game.gameId,
      unitPrice: game.price,
      gameName: game.title,
      imageUrl: game.gameImages[0]?.imageUrl || "",
    };
    await addToCart(cartItem);
  };

  // Split and normalize platforms
  const platforms =
    game.platform && typeof game.platform === "string"
      ? game.platform
          .split(",")
          .map((p) => {
            const trimmed = p.trim();
            return platformMap[trimmed] || trimmed; // Use mapped value or original if no mapping
          })
          .filter((p) => defaultIcons[p]) // Only keep platforms with icons
      : [];

  // Sort gameImages by imageId
  const sortedImages = game.gameImages
    ? [...game.gameImages].sort((a, b) => a.imageId - b.imageId)
    : [];

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200 flex flex-col h-[360px]">
      <div className="relative">
        <Link to={`/game/${game.gameId}`}>
          <img
            src={
              sortedImages[0]?.imageUrl ||
              "https://via.placeholder.com/300x200"
            }
            alt={game.title}
            className="w-full h-48 object-cover"
          />
        </Link>
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md text-red-500 hover:text-red-700 transition-colors duration-200"
          title={
            isInWishlist(game.gameId)
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >
          {isInWishlist(game.gameId) ? (
            <FaHeart size={16} />
          ) : (
            <FaRegHeart size={16} />
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/game/${game.gameId}`}>
          <h3 className="text-xl font-semibold text-gray-800 truncate hover:text-purple-500">
            {game.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-2 mt-2">
          {platforms.map((platform, index) => (
            <span key={index} title={platform}>
              {defaultIcons[platform]}
            </span>
          ))}
        </div>

        <p className="text-lg text-gray-800 font-semi mt-2">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(game.price)}
        </p>

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex items-center bg-purple-500 text-white px-3 py-1 rounded-3xl hover:bg-blue-600 transition-colors duration-200 w-full justify-center"
            title="Add to Cart"
          >
            <FaShoppingCart className="mr-1" size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
