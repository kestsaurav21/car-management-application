import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/../hooks/use-toast";
import { AddCar } from "./AddCar";

const CarCard = ({ car, setMode, mode }) => {
  // State to keep track of the current image index
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  // Function to go to the next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const handleViewDetails = () => {
    // Navigate to the car detail page, passing car data through state
    navigate(`/car/${car._id}`, {
      state: { carData: car }, // Pass the car data
    });
  };

  const deleteCar = async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND}/service/car/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Assuming token is stored in localStorage
        },
      }
    );

    if (response.ok) {
      // Successfully added the car
      toast({
        title: "Car Deleted",
      });

      window.location.reload();
    } else {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const editCarMode = () => {
    console.log(mode);
    setMode("edit");
  }

  return (
    <div className="bg-white border rounded-lg shadow-lg overflow-hidden max-w-md">
      <div className="relative w-96 h-72">
        <img
          src={`data:image/jpeg;base64,${car.images[currentImageIndex]}`}
          alt={`${car.company} ${car.model}`}
          className="w-full h-full object-contain mx-auto"
        />
        <button
          onClick={handleNextImage}
          className="absolute px-4 top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 focus:outline-none">
          Next
        </button>
      </div>
      <hr />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">{car.company}</h2>
        <h3 className="text-md text-gray-600">{car.model}</h3>
        <p className="mt-2 text-gray-600">{car.description}</p>
        <div className="mt-4">
          {car.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold mr-2 mb-2 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <hr />
      <div className="flex gap-4 justify-center p-2">
        <Button className="bg-green-600" onClick={handleViewDetails}>View more</Button>
        <AddCar carEdit={car} mode={mode}><Button onClick={editCarMode}>Edit</Button></AddCar>
        <Button className="bg-red-400" onClick={() => deleteCar(car._id)}>
          Delete
        </Button>
      </div>
      <hr />
    </div>
  );
};

export default CarCard;
