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
    res.status(200).json({ message: 'Car created with images', car: newCar });

  } catch (error) {
    console.log("ROUTE: /car/add - ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
    addCar
}