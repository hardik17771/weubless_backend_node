const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_id: Number,
    name: String,
    banner: String,
    icon: String,
    image: String,
    featured: Number,
    top: Number,
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
