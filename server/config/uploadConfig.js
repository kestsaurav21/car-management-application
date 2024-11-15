const multer = require('multer');

// Set storage to memory, as we will convert images to Base64
const storage = multer.memoryStorage(); 

// Initialize multer with the memory storage
const upload = multer({ storage: storage });

module.exports = upload;