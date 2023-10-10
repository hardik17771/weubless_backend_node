const mongoose = require("mongoose");
const { SubCategory } = require("./SubCategory");

const categorySchema = new mongoose.Schema(
  {
    category_id: { type: Number, unique: true },
    name: { type: String, required: true },
    banner: String,
    icon: String,
    image: { type: String, required: true },
    featured: Number,
    top: Number,
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
  },
  { timestamps: true }
);

// Define a pre-save middleware to handle auto-incrementing category_id
categorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      // If the document is not new, don't do anything
      return next();
    }

    // Find the current count of documents and use it as the next category_id
    const count = await this.constructor.countDocuments({});
    this.category_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getCategoryById = async (category_id) => {
  try {
    const category = await Category.findOne({
      category_id,
    }).exec();
    return category;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

const getSubCategoriesByCategoryId = async (category_id) => {
  try {
    const category = await Category.findOne({
      category_id,
    }).exec();
    return category ? category.subCategories : [];
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const findSubCategories = async (objectIds) => {
  try {
    const subCategories = await SubCategory.find({ _id: { $in: objectIds } });
    return subCategories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const Category = mongoose.model("Category", categorySchema);

module.exports = {
  Category,
  getCategoryById,
  getSubCategoriesByCategoryId,
  findSubCategories,
};
