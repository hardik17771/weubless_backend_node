const mongoose = require("mongoose");

const subSubCategorySchema = new mongoose.Schema(
  {
    name: String,
    brands: String,
    sub_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
  },
  { timestamps: true }
);

const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = SubSubCategory;
