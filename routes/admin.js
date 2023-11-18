const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");
const homeController = require("../controllers/Admin/homeController");

// router.get("/", (req, res) => {
//   res.render("admin/index", { title: "Admin Dashboard" });
// });

// // Route to handle user profile update
// router.post("/update-profile", async (req, res) => {
//   const data = req.body; // Assuming the data is sent via POST request body
//   const result = await apiController.updateProfile(data);

//   if (result.code === 200) {
//     res
//       .status(200)
//       .json({ message: "Profile updated successfully", data: result.data });
//   } else {
//     res.status(result.code).json({ message: "Failed to update profile" });
//   }
// });

router.get("/", homeController.indexView);

module.exports = router;
