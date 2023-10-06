const express = require("express");
const userRoutes = require("./users");
// const apiController = require("../controllers/APIController");

const router = express.Router();

router.use("", userRoutes);
// router.post("/register", apiController.registerUser3);

module.exports = router;
