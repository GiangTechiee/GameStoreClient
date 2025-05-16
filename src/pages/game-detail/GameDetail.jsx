import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../../services/api";
import GameInfo from "./GameInfo";
import ImageGallery from "./ImageGallery";
import GameDescription from "./GameDescription";

function GameDetail() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await apiRequest(`/game/${gameId}`);
        const gameData = Array.isArray(data) ? data[0] : data;
        setGame(gameData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load game details: " + err.message);
        setLoading(false);
      }
    };
    loadGame();
  }, [gameId]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Phần trên: Thông tin và Ảnh */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
        <div className="md:w-1/2 max-w-lg mx-auto">
          <GameInfo game={game} gameId={gameId} />
        </div>
        <div className="md:w-1/2 max-w-md mx-auto">
          <ImageGallery
            images={
              game.gameImages?.length > 0
                ? game.gameImages
                : [{ imageId: 0, imageUrl: "https://via.placeholder.com/300x200" }]
            }
          />
        </div>
      </div>

      {/* Phần dưới: Mô tả và Chi tiết */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <GameDescription game={game} />
      </div>
    </div>
  );
}

export default GameDetail;
