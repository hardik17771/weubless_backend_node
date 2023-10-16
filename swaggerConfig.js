const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    // servers: [
    //   {
    //     url: 'http://localhost:3000', // Update with your server URL
    //   },
    // ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            username: { type: "string" },
            name: { type: "string" },
            country_code: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            user_type: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Update with the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
