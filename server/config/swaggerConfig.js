require("dotenv").config();
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  swagger: '2.0', // Specifies Swagger (OpenAPI 2.0)
  info: {
    title: 'Car Management API', // API title
    version: '1.0.0', // API version
    description: 'API documentation for the Car Management Application', // Short description
  },
  host: process.env.SERVER_URL, // Host URL of your API server (without protocol)
  basePath: '/', // Base path for the API
  schemes: ['http', 'https'], // Protocols supported (you can adjust as needed)
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey', // Use 'apiKey' for OpenAPI 2.0
      name: 'Authorization', // Header name for authentication
      in: 'header', // Location of the API key (in header)
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;