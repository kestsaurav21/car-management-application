const express = require('express');
const upload = require('../config/uploadConfig');
const { addCar, getCars, searchCar, updateCarDetails, deleteCar } = require('../controllers/car');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

//Route -> Add a car
/**
 * @swagger
 * /service/car/add:
 *   post:
 *     summary: Add a car for a user
 *     description: Endpoint to add car details. You can upload a maximum of 10 images.
 *     tags:
 *       - Car
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: company
 *         description: The car company name
 *         required: true
 *         type: string
 *         example: My Car
 *       - in: formData
 *         name: model
 *         description: The car model
 *         required: true
 *         type: string
 *         example: Fortuner
 *       - in: formData
 *         name: description
 *         description: Description of the car
 *         required: false
 *         type: string
 *         example: Description of the car
 *       - in: formData
 *         name: tags
 *         description: Tags associated with the car
 *         required: false
 *         type: string
 *         example: sedan, red, 2021
 *       - in: formData
 *         name: images
 *         description: Images of the car (maximum of 10 images)
 *         required: false
 *         type: file
 *         collectionFormat: multi
 *         maxItems: 10
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Car added
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Car Added successfully
 *       400:
 *         description: Bad request - No images uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/car/add', authenticate, upload.array('images', 10), addCar);

/**
 * @swagger
 * /service/car/list:
 *   get:
 *     summary: Fetches all car details of a user
 *     description: Endpoint to get all car details of a user
 *     tags:
 *       - Car
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Car list
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 6123abcd456ef7890abcde12
 *               title:
 *                 type: string
 *                 example: Red Tesla Model 3
 *               description:
 *                 type: string
 *                 example: "This is a description of a Red Tesla Model 3."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["electric", "red", "2022"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["base64encodedstring"]
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/car/list', authenticate, getCars);

/**
 * @swagger
 * /service/car/search:
 *   get:
 *     summary: Global search through all cars
 *     description: Search for cars where the keyword matches the title, description, or tags.
 *     tags:
 *       - Car
 *     parameters:
 *       - in: query
 *         name: keyword
 *         type: string
 *         required: true
 *         description: The keyword to search in the title, description, tags, and model
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars matching the keyword
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 6123abcd456ef7890abcde12
 *               title:
 *                 type: string
 *                 example: Red Tesla Model 3
 *               description:
 *                 type: string
 *                 example: "This is a description of a Red Tesla Model 3."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["electric", "red", "2022"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["base64encodedstring"]
 *       400:
 *         description: Keyword is missing
 *       500:
 *         description: Server error
 */
router.get('/car/search', authenticate, searchCar);


/**
 * @swagger
 * /service/car/update/{id}:
 *   put:
 *     summary: Update a car for a user
 *     description: Endpoint to update car details
 *     tags:
 *       - Car
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the car to update
 *       - in: formData
 *         name: company
 *         description: The car company name
 *         required: false
 *         type: string
 *         example: My Car
 *       - in: formData
 *         name: model
 *         description: The car model
 *         required: false
 *         type: string
 *         example: Fortuner
 *       - in: formData
 *         name: description
 *         description: Description of the car
 *         required: false
 *         type: string
 *         example: Description of the car
 *       - in: formData
 *         name: tags
 *         description: Tags associated with the car
 *         required: false
 *         type: string
 *         example: sedan, red, 2021
 *       - in: formData
 *         name: images
 *         description: Images of the car (if any)
 *         required: false
 *         type: file
 *         collectionFormat: multi
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Car Updated Successfully
 *       400:
 *         description: Bad request - No images uploaded
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/car/update/:id', authenticate, upload.array('images', 10), updateCarDetails);

/**
 * @swagger
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
 *         type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Car deleted successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Server error
 */
router.delete('/car/delete/:id', authenticate, deleteCar);

module.exports = router;
