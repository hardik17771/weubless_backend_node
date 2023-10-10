const express = require("express");
const userRoutes = require("./usersRoutes");
const categoryRoutes = require("./categoryRoutes");
// const test = require("./testfunc");

const router = express.Router();

router.use("", userRoutes);
router.use("", categoryRoutes);
// router.get("/testRoute", test.createCategory);

module.exports = router;
