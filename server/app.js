const express = require('express')
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

//Connection to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));



app.use('/', require('./routes/welcome'));
app.use('/auth', require('./routes/auth'));
app.use('/service', require('./routes/car'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = 5005

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
} )