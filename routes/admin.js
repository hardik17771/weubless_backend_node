const express = require("express");
const router = express.Router();
const homeController = require("../controllers/Admin/homeController");

router.get("/", homeController.indexView);
router.get("/tables", homeController.tablesView);
router.get("/table/:tableName", homeController.singleTableView);



router.get("/billing", homeController.billingView);
router.get("/profile", homeController.profileView);
router.get("/map", homeController.mapView);
router.get("/user-map", homeController.userMapView);

// GET request for displaying the detail page
router.get("/detail/:product_id", homeController.detailView);

// POST request for updating the product
router.post("/detail/:product_id", homeController.updateProduct);


router.get("/add-item/:model_name/", homeController.addView);
router.post("/delete-item", homeController.deleteView);
router.get("/confirm-delete/:model_name/:model_id", homeController.showDeleteConfirmationPage);
router.get("/item-detail/:model_name/:model_id", homeController.dynamicDetailView);
router.post("/item-detail/:model_name/:model_id", homeController.updateModel);

module.exports = router;
