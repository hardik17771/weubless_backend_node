const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");
const routes = require("./routes");
const connectDB = require("./config/db");
// const ForestAdmin = require("forest-express-mongoose"); // Import Forest Admin

// const AdminBro = require("admin-bro"); // Import AdminBro
// const AdminBroExpress = require("@admin-bro/express"); // Import AdminBro Express middleware

// const mongoose = require("mongoose");
// const { createAgent } = require("@forestadmin/agent");
// const {
//   createMongooseDataSource,
// } = require("@forestadmin/datasource-mongoose");

const app = express();
dotenv.config();

// Connect to the database
connectDB();
// Set EJS as the view engine
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use("", routes);
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// // Initialize Forest Admin
// ForestAdmin.init({
//   modelsDir: __dirname + "/models", // Directory containing your Mongoose models
//   envSecret: process.env.FOREST_ENV_SECRET,
//   authSecret: process.env.FOREST_AUTH_SECRET,
//   mongoose: require("mongoose"),
// });

// // Attach Forest Admin to the Express app
// app.use("/forest", ForestAdmin.router);

// // Initialize Forest Admin agent and add Mongoose datasource
// const agent = createAgent({
//   authSecret: process.env.FOREST_AUTH_SECRET,
//   envSecret: process.env.FOREST_ENV_SECRET,
//   isProduction: process.env.NODE_ENV === "production",
// });
// agent.mountOnStandaloneServer(3000);
// agent.start();

// // Add Mongoose datasource
// agent.addDataSource(createMongooseDataSource(mongoose.connection));

// // Mount the Forest Admin agent on the Express app
// agent.mountOnExpress(app);

// // Initialize AdminBro
// const adminBro = new AdminBro({
//   databases: [mongoose],
//   rootPath: "/admin",
// });

// // Use AdminBro middleware along with your existing middleware
// app.use(adminBro.options.rootPath, AdminBroExpress.buildRouter(adminBro));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
