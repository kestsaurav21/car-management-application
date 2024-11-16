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


/**
 * @openapi
 * /service/car/list:
 *   get:
 *     summary: Fetches all car details of a user
 *     description: Endpoint to get all car details of a user
 *     tags:
 *       - Car
 *     responses:
 *       200:
 *         description: Car list
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/car/list', authenticate, getCars)

/**
 * @openapi
 * /service/car/search:
 *   get:
 *     summary: Global search through all cars
 *     description: Search for cars where the keyword matches the title, description, or tags.
 *     tags:
 *       - Car
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: The keyword to search in the title, description, tags, and model
 *     responses:
 *       200:
 *         description: List of cars matching the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6123abcd456ef7890abcde12
 *                   title:
 *                     type: string
 *                     example: Red Tesla Model 3
 *                   description:
 *                     type: string
 *                     example: "This is a description of a Red Tesla Model 3."
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["electric", "red", "2022"]
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["base64encodedstring"]
 *       400:
 *         description: Keyword is missing
 *       500:
 *         description: Server error
 */
router.get('/car/search', authenticate, searchCar);



/**
 * @openapi
 * /service/car/update/{id}:
 *   put:
 *     summary: Update a car for a user
 *     description: Endpoint to update car details
 *     tags:
 *       - Car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the car to update
 *     requestBody:
 *       description: Add updating details
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
 *     responses:
 *       200:
 *         description: Car Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Car Updated Successfully
 *       400:
 *         description: No images uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.put('/car/update/:id', authenticate, upload.array('images', 10), updateCarDetails)

/**
 * @openapi
 * /service/car/delete/{id}:
 *   delete:
 *     summary: Delete a car by its ID
 *     description: This endpoint deletes a car from the database using the car ID.
 *     tags:
 *       - Car
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the car to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Car deleted successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server error
 */
router.delete('/car/delete/:id', authenticate, deleteCar)


module.exports = router;
