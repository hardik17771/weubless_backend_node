const mongoose = require("mongoose");
const { Product } = require("./Product");
const subSubCategorySchema = new mongoose.Schema(
  {
    subcategory_id: { type: Number, unique: true },
    name: { type: String, required: true },
    brands: String,
    main_subcategory_id: {
      type: Number,
      ref: "SubCategory",
      required: true,
    },
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

subSubCategorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.subcategory_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getSubSubCategoryById = async (subcategory_id) => {
  try {
    const sub_sub_Category = await SubSubCategory.findOne({
      subcategory_id,
    }).exec();
    return sub_sub_Category;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

const getProdutsBySubCategoryId = async (subcategory_id) => {
  try {
    const sub_sub_Category = await SubSubCategory.findOne({
      subcategory_id,
    }).exec();
    return sub_sub_Category ? sub_sub_Category.products : [];
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

const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = {
  SubSubCategory,
  getSubSubCategoryById,
  getProdutsBySubCategoryId,
  findProducts,
};
