import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ProductDetails() {
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { carData } = location.state || {}; // Destructure carData from state

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carData.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carData.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
    <div className="max-w-4xl mx-auto p-4">
      {/* Image carousel: show current image and navigation buttons */}
      <Button className="mb-4" onClick={() => navigate("/productList")}>
        Back
      </Button>
      <div className="flex justify-center mb-8">
        <div className="relative w-96 h-72">
          {/* Display the current image */}
          <img
            src={`data:image/jpeg;base64,${carData.images[currentImageIndex]}`}
            alt={carData.model}
            className="w-full h-full object-contain"
          />

          {/* Navigation buttons */}
          <button
            onClick={handlePrevImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
          >
            &#60;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
          >
            &#62;
          </button>
        </div>
      </div>

      {/* Thumbnails of all images below */}
      <div className="flex justify-center gap-4 mb-8">
        {carData.images.map((image, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${image}`}
            alt={`Thumbnail ${index + 1}`}
            className={`w-24 h-24 object-cover rounded-md cursor-pointer ${
              index === currentImageIndex ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>

      {/* Product Information */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">{carData.company} | {carData.model}</h1>
        <p className="text-lg text-gray-600 mb-6">{carData.description}</p>
      </div>
    </div>
    </>
  );
}

export default ProductDetails;
