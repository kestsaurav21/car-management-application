import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "../components/CarCard";
import { Button } from "@/components/ui/button";
import { AddCar } from "../components/AddCar";

const getCars = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}/service/car/list`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`, // Authorization header format should be "Bearer <token>"
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error; // Propagate the error if you need it in useEffect
    }
  } else {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
  }
};

function ProductListing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);

  const [carsData, setCarsData] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCarsData(data.cars); // Handle the car data here
        setFilteredCars(data.cars);
      } catch (error) {
        console.error("Error in useEffect:", error);
        navigate("/"); // Redirect to home if error occurs
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    getFilteredCars();
  }, [searchQuery]);

  const getFilteredCars = () => {
    if (!searchQuery) {
      // If no search query, show all cars
      setFilteredCars(carsData);
    } else {
      // Filter cars based on title, description, and tags
      const filtered = carsData.filter((car) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          car.company.toLowerCase().includes(lowerCaseQuery) || // Title match
          car.model.toLowerCase().includes(lowerCaseQuery) || // Title match
          car.description.toLowerCase().includes(lowerCaseQuery) || // Description match
          (car.tags &&
            car.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))) // Tags match
        );
      });

      setFilteredCars(filtered);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex pb-4">
        <Button
          className="bg-red-600"
          onClick={() => {
            sessionStorage.clear();
            navigate("/");
          }}>
          Log out
        </Button>
      </div>
      <h1 className="text-3xl font-bold">Available Cars</h1>
      {/* Search Section */}
      <div className="flex flex-row-reverse gap-10 w-full justify-center items-center h-20 space-x-4 my-auto">
        <input
          type="text"
          placeholder="Search cars by model, company, description, and tags"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[450px] p-3 h-12 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AddCar>
            <Button className="h-12 w-24 bg-green-600">Add</Button>
        </AddCar>
      </div>
      {/* Car Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars?.length > 0 ? (
          filteredCars.map((car) => <CarCard key={car._id} car={car} setMode={setMode} mode={mode} />)
        ) : (
          <p className="col-span-full text-center text-lg text-gray-500">
            No cars found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductListing;
