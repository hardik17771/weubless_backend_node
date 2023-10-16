const express = require("express");
const app = express();
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const routes = require("./routes");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");

dotenv.config();

// Connect to the database
connectDB();

app.use(bodyParser.json());
app.use("", routes);
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
