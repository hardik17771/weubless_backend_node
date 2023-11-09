const express = require("express");
const userRoutes = require("./usersRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const shopRoutes = require("./shopRoutes");
const miscRoutes = require("./miscRoutes");

// const test = require("./testfunc");

const router = express.Router();

router.use("", userRoutes);
router.use("", categoryRoutes);
router.use("", productRoutes);
router.use("", cartRoutes);
router.use("", shopRoutes);
router.use("", miscRoutes);
// router.get("/testRoute", test.createCategory);

module.exports = router;
