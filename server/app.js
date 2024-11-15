const express = require('express')
const mongoose = require("mongoose");

const cors = require('cors');

require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

//Connection to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));



const PORT = 5005

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
} )