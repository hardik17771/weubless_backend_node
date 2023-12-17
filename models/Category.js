const mongoose = require("mongoose");
const { SubCategory } = require("./SubCategory");
const { Product } = require("./Product");

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

const getProdutsByCategoryId = async (category_id) => {
  try {
    const category = await Category.findOne({
      category_id,
    }).exec();
    return category ? category.products : [];
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
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

// const getTotalCountsByCategoryId = async (category_id) => {
//   try {
//     const category = await Category.findOne({
//       category_id,
//     }).exec();

//     if (!category) {
//       return { productCount: 0, subCategoryCount: 0 };
//     }

//     const productCount = category.products.length;
//     const subCategoryCount = category.subCategories.length;

//     return { productCount, subCategoryCount };
//   } catch (error) {
//     throw new Error(`Error fetching counts: ${error.message}`);
//   }
// };

const Category = mongoose.model("Category", categorySchema);

module.exports = {
  Category,
  getCategoryById,
  getSubCategoriesByCategoryId,
  findSubCategories,
  getProdutsByCategoryId,
  findProducts,
  // getTotalCountsByCategoryId, // Add the new function to exports
};
