const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");
const routes = require("./routes");
const connectDB = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
dotenv.config();

// Connect to the database
connectDB();
// Set EJS as the view engine
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use("", routes);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
