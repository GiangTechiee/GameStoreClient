import { useState, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function ImageGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Ảnh lớn */}
      <div className="relative w-full h-80">
        <img
          src={images[selectedIndex].imageUrl}
          alt={`Game image ${images[selectedIndex].imageId}`}
          className="w-full h-full object-cover rounded-3xl shadow-md"
        />
        {/* Nút điều hướng ảnh */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Ảnh nhỏ (Desktop) và Dấu chấm (Mobile) */}
      <div className="relative">
        {/* Ảnh nhỏ trên Desktop */}
        <div
          ref={scrollRef}
          className="hidden md:flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        >
          {images.map((image, index) => (
            <img
              key={image.imageId}
              src={image.imageUrl}
              alt={`Game thumbnail ${image.imageId}`}
              className={`w-20 h-20 object-cover rounded-2xl cursor-pointer transition-all duration-200 ${
                selectedIndex === index ? "border-4 border-purple-500" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>

        {/* Dấu chấm trên Mobile */}
        <div className="md:hidden flex justify-center gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                selectedIndex === index ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>

        {/* Nút cuộn ảnh nhỏ trên Desktop */}
        {images.length > 4 && (
          <>
            <button
              onClick={() => scrollThumbnails("left")}
              className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => scrollThumbnails("right")}
              className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
            >
              <FaArrowRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;