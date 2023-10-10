// categoryController.js

const Category = require("../models/Category"); // Import your Category model

const createCategory = async (req, res) => {
  console.log("test route working");
  try {
    const newCategory = new Category.Category({
      // category_id: 1,
      name: "Sample Category hehehe",
      banner: "sample_banner4hehehe.jpg",
      icon: "sample_icon4hehehe.jpg",
      image: "sample_image4hehehe.jpg",
      featured: 1,
      top: 1,
    });
    console.log("Category before save", newCategory);
    await newCategory.save();
    console.log("Category saved successfully");
    res.status(200).json({ msg: "data saved", data: newCategory });
  } catch (error) {
    console.error("Error saving category:", error);
  }
};

module.exports = { createCategory };
