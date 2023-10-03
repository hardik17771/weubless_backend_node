const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
