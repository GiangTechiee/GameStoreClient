import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { apiRequest } from '../services/api';
import { toast } from 'react-toastify';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Đồng bộ wishlist từ localStorage lên database
  const syncWishlistToDatabase = async () => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (localWishlist.length > 0) {
      try {
        for (const gameId of localWishlist) {
          await apiRequest('/wishlist/items', 'POST', { gameId });
        }
        localStorage.removeItem('wishlist');
      } catch (err) {
        toast.error('Không thể đồng bộ danh sách yêu thích: ' + err.message);
      }
    }
  };

  // Tải wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated) {
        await syncWishlistToDatabase();
        try {
          const response = await apiRequest('/wishlist');
          const items = response.wishlistItems || [];
          setWishlist(items.map((item) => item.gameId));
          setWishlistItems(items.map((item) => ({
            wishlistItemId: item.wishlistItemId,
            gameId: item.gameId,
            gameName: item.gameName,
            addedAt: item.addedAt || new Date().toISOString(),
          })));
        } catch (err) {
          toast.warn('Không thể tải danh sách yêu thích: ' + err.message);
          setWishlist([]);
          setWishlistItems([]);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        try {
          const items = await Promise.all(
            localWishlist.map(async (gameId) => {
              try {
                const response = await apiRequest(`/game/${gameId}`);
                return {
                  wishlistItemId: `local-${gameId}`,
                  gameId,
                  gameName: response.name || `Game ${gameId}`,
                  addedAt: new Date().toISOString(),
                };
              } catch (err) {
                return {
                  wishlistItemId: `local-${gameId}`,
                  gameId,
                  gameName: `Game ${gameId}`,
                  addedAt: new Date().toISOString(),
                };
              }
            })
          );
          setWishlist(localWishlist);
          setWishlistItems(items);
        } catch (err) {
          toast.warn('Không thể tải chi tiết game: ' + err.message);
          setWishlist(localWishlist);
          setWishlistItems(localWishlist.map((gameId) => ({
            wishlistItemId: `local-${gameId}`,
            gameId,
            gameName: `Game ${gameId}`,
            addedAt: new Date().toISOString(),
          })));
        }
      }
    };
    loadWishlist();
  }, [isAuthenticated]);

  // Thêm game vào wishlist
  const addToWishlist = async (gameId) => {
    try {
      let gameName = `Game ${gameId}`;
      try {
        const response = await apiRequest(`/game/${gameId}`);
        gameName = response.name || gameName;
      } catch (err) {
        console.warn(`Không thể lấy tên game ${gameId}: ${err.message}`);
      }

      if (isAuthenticated) {
        const response = await apiRequest('/wishlist/items', 'POST', { gameId });
        if (!wishlist.includes(gameId)) {
          setWishlist((prev) => [...prev, gameId]);
          setWishlistItems((prev) => [
            ...prev,
            {
              wishlistItemId: response.wishlistItemId,
              gameId: response.gameId,
              gameName: response.gameName || gameName,
              addedAt: response.addedAt || new Date().toISOString(),
            },
          ]);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (!localWishlist.includes(gameId)) {
          localWishlist.push(gameId);
          localStorage.setItem('wishlist', JSON.stringify(localWishlist));
          setWishlist(localWishlist);
          setWishlistItems((prev) => [
            ...prev,
            {
              wishlistItemId: `local-${gameId}`,
              gameId,
              gameName,
              addedAt: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (err) {
      toast.error('Không thể thêm vào danh sách yêu thích: ' + err.message);
    }
  };

  // Xóa game khỏi wishlist
  const removeFromWishlist = async (gameId) => {
    try {
      if (isAuthenticated) {
        const item = wishlistItems.find((i) => i.gameId === gameId);
        if (item) {
          await apiRequest(`/wishlist/items/${item.wishlistItemId}`, 'DELETE');
          setWishlist((prev) => prev.filter((id) => id !== gameId));
          setWishlistItems((prev) => prev.filter((i) => i.wishlistItemId !== item.wishlistItemId));
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = localWishlist.filter((id) => id !== gameId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlist(updatedWishlist);
        setWishlistItems((prev) => prev.filter((i) => i.gameId !== gameId));
      }
    } catch (err) {
      toast.error('Không thể xóa khỏi danh sách yêu thích: ' + err.message);
      throw err;
    }
  };

  // Kiểm tra game có trong wishlist
  const isInWishlist = (gameId) => {
    //console.log('Checking isInWishlist:', gameId, wishlist); // Debug log
    return wishlist.includes(gameId);
  };

  const value = useMemo(
    () => ({ wishlist, wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }),
    [wishlist, wishlistItems]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}