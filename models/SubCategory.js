const mongoose = require("mongoose");
const { SubSubCategory } = require("./SubSubCategory");

const subCategorySchema = new mongoose.Schema(
  {
    main_subcategory_id: { type: Number, unique: true },
    name: { type: String, required: true },
    category_id: {
      type: Number,
      ref: "Category",
      required: true,
    },
    subsubCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubSubCategory" },
    ],
  },
  { timestamps: true }
);

subCategorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.main_subcategory_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getSubCategoryById = async (main_subcategory_id) => {
  try {
    const sub_Category = await SubCategory.findOne({
      main_subcategory_id,
    }).exec();
    return sub_Category;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

const getSubSubCategoriesByMainSubCategoryId = async (main_subcategory_id) => {
  try {
    const subCategory = await SubCategory.findOne({
      main_subcategory_id,
    }).exec();
    return subCategory ? subCategory.subsubCategories : [];
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const findSubSubCategories = async (objectIds) => {
  try {
    const subSubCategories = await SubSubCategory.find({
      _id: { $in: objectIds },
    });
    return subSubCategories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = {
  SubCategory,
  getSubCategoryById,
  getSubSubCategoriesByMainSubCategoryId,
  findSubSubCategories,
};
