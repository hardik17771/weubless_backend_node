const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");

router.get("/", (req, res) => {
  res.render("admin/index", { title: "Admin Dashboard" });
});

module.exports = router;
