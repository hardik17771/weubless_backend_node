const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*users.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = function (app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
