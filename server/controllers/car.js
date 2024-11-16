const { default: mongoose } = require("mongoose");
const Car = require("../models/Car");

const addCar = async (req, res) => {
  try {
    const { company, model, description, tags } = req.body;
    
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Convert images to Base64
    const base64Images = req.files.map((file) =>
      file.buffer.toString("base64")
    );

    // Create a new Car entry
    const newCar = new Car({
      userId: req.user.userId,
      company,
      model,
      description,
      images: base64Images, // Save Base64 images to MongoDB
      tags: tags ? tags.split(",") : [], // Convert tags string to array
    });

    await newCar.save();
    res.status(200).json({ message: "Car created with images", car: newCar });
  } catch (error) {
    console.log("ROUTE: /car/add - ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCars = async (req, res) => {
  try {
    const carList = await Car.find({ userId: req.user.userId });

    return res.status(200).json({
      cars: carList,
    });
  } catch (error) {
    console.log("ROUTE: /car/list - ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchCar = async (req, res) => {
  try {
    // Ensure the keyword is treated as a string
    const keyword = String(req.query.keyword || "");

    // Validate that a keyword is provided and is not empty
    if (!keyword || keyword === "[object Object]") {
      return res
        .status(400)
        .json({
          error: "Keyword is required for search and must be a valid string",
        });
    }

    const cars = await Car.find({
      $or: [
        { company: { $regex: keyword, $options: "i" } },
        { model: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $elemMatch: { $regex: keyword, $options: "i" } } },
      ],
    });

    res.status(200).json(cars);
  } catch (error) {
    console.log("ROUTE: /car/search - ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCarDetails = async (req, res) => {
  try {
    const carId = req.params.id;

    // Check if carId is a valid ObjectId
    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({ error: "Invalid car ID format" });
    }

    console.log(req.body);
    
    const updateData = req.body;

    // Update the car details
    const updatedCar = await Car.findByIdAndUpdate(carId, updateData, {
      new: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json({
      message: "Car details updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.log("ROUTE: /car/update - ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteCar = async (req, res) => {

  try {

    const carId = req.params.id;
    const car = await Car.findByIdAndDelete(carId);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
  }
  
    res.status(200).json({ message: 'Car deleted successfully' });
    
  } catch (error) {
    console.log("ROUTE: /car/delete - ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  addCar,
  getCars,
  searchCar,
  updateCarDetails,
  deleteCar
};
