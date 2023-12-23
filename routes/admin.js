const express = require("express");
const router = express.Router();
const homeController = require("../controllers/Admin/homeController");

router.get("/", homeController.indexView);
router.get("/tables", homeController.tablesView);
router.get("/table/:tableName", homeController.singleTableView);



router.get("/billing", homeController.billingView);
router.get("/profile", homeController.profileView);

// GET request for displaying the detail page
router.get("/detail/:product_id", homeController.detailView);

// POST request for updating the product
router.post("/detail/:product_id", homeController.updateProduct);

module.exports = router;
