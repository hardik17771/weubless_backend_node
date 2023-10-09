const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
