const mongoose = require("mongoose");
// const { SubSubCategory } = require("./SubSubCategory");
const { Product } = require("./Product");
const subCategorySchema = new mongoose.Schema(
  {
    main_subcategory_id: { type: Number, unique: true },
    name: { type: String, required: true },
    category_id: {
      type: Number,
      ref: "Category",
      required: true,
    },
    // subsubCategories: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "SubSubCategory" },
    // ],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
    versionKey: false,
  }
);

subCategorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const max = await this.constructor.findOne({}, { main_subcategory_id: 1 })
    .sort({ main_subcategory_id: -1 })
    .limit(1)
    .lean();

  
    this.main_subcategory_id = max ? max.main_subcategory_id + 1 : 1;

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


const getProdutsByMainSubCategoryId = async (main_subcategory_id) => {
  try {
    const subCategory = await SubCategory.findOne({
      main_subcategory_id,
    }).exec();
    return subCategory ? subCategory.products : [];
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const findProducts = async (objectIds) => {
  try {
    const products = await Product.find({
      _id: { $in: objectIds },
    });
    return products;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = {
  SubCategory,
  getSubCategoryById,
  getProdutsByMainSubCategoryId,
  // getSubSubCategoriesByMainSubCategoryId,
  // findSubSubCategories,
  findProducts,
};
