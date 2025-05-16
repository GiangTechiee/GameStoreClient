import { useState, useEffect } from "react";

function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  // Sample banner images (replace with your actual image URLs)
  const banners = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  // Banner rotation effect
  useEffect(() => {
    if (!isBannerHovered) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000); // Change banner every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isBannerHovered, banners.length]);

  return (
    <div
      className="lg:w-2/3 lg:order-1 relative h-[400px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsBannerHovered(true)}
      onMouseLeave={() => setIsBannerHovered(false)}
    >
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentBanner ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h1 className="text-3xl lg:text-5xl font-bold text-white text-center">
              Khám Phá Trò Chơi Tuyệt Vời
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Banner;