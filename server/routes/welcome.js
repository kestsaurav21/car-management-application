const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /home:
 *   get:
 *     description: Welcome to Cars Server!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get('/', (req,res) => {
    res.send('Welcome to Cars server')
});

module.exports = router;