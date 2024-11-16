const express = require('express');
const upload = require('../config/uploadConfig');
const { addCar, getCars, searchCar, updateCarDetails, deleteCar } = require('../controllers/car');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

//Route -> Add a car

/**
 * @openapi
 * /service/car/add:
 *   post:
 *     summary: Add a car for a user
 *     description: Endpoint to add car details
 *     tags:
 *       - Car
 *     requestBody:
 *       description: Add car details
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 example: My Car
 *               model:
 *                 type: string
 *                 example: Fortuner
 *               description:
 *                 type: string
 *                 example: Description of the car
 *               tags:
 *                 type: string
 *                 example: sedan, red, 2021
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Car added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Car Added successfully
 *       400:
 *         description: Bad request - No images uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/car/add', authenticate, upload.array('images', 10), addCar);

module.exports = router;
