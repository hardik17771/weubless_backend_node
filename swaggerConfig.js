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
        Category: {
          type: "object",
          properties: {
            category_id: { type: "number" },
            name: { type: "string" },
            banner: { type: "string" },
            icon: { type: "string" },
            feature: { type: "number" },
            subCategories: { type: "array" },
          },
        },
        SubCategory: {
          type: "object",
          properties: {
            main_subcategory_id: { type: "number" },
            name: { type: "string" },
            category_id: { type: "number" },
            subsubCategories: { type: "array" },
            products: { type: "array" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Update with the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
