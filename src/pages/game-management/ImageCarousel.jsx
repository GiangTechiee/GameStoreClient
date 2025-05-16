import { useState, useEffect, useRef } from 'react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const carouselRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const lastDragTime = useRef(0);

  // Kiểm tra nếu không có ảnh
  if (!images || images.length === 0) {
    return (
      <img
        src="/api/placeholder/400/320"
        alt="Placeholder"
        className="w-full h-40 object-cover rounded-3xl"
      />
    );
  }

  // Xử lý khi bắt đầu kéo
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragDistance(0);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  // Xử lý trong quá trình kéo
  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - startX;
    setTranslateX(diffX);
    setDragDistance(Math.abs(diffX));
  };

  // Xử lý khi kết thúc kéo
  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    lastDragTime.current = Date.now();
    setIsDragging(false);
    
    if (translateX > 50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (translateX < -50 && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    
    setTranslateX(0);
  };

  // Xử lý click vào carousel
  const handleClick = (e) => {
    // Nếu đã kéo quá một khoảng cách nhỏ hoặc mới drag xong trong 300ms, thì không tính là click
    if (dragDistance > 5 || Date.now() - lastDragTime.current < 300) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // Cập nhật vị trí carousel khi currentIndex thay đổi
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full h-40 overflow-hidden rounded-3xl">
      <div
        ref={carouselRef}
        className={`flex h-full transition-transform duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))` }}
        onMouseDown={handleDragStart}
        onMouseMove={isDragging ? handleDragMove : null}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={isDragging ? handleDragMove : null}
        onTouchEnd={handleDragEnd}
        onClick={handleClick}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image.imageUrl || "/api/placeholder/400/320"}
            alt={`Game image ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
            draggable="false"
            onError={(e) => {
              e.target.src = "/api/placeholder/400/320";
            }}
            onClick={handleClick}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;