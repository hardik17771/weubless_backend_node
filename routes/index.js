const express = require("express");
const userRoutes = require("./usersRoutes");
const categoryRoutes = require("./categoryRoutes");

const router = express.Router();

router.use("", userRoutes);
router.use("", categoryRoutes);

module.exports = router;
