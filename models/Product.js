const mongoose = require("mongoose");
const { SubSubCategory } = require("./SubSubCategory");
// const { SubCategory } = require("./SubCategory");

const productSchema = new mongoose.Schema(
  {
    product_id: { type: Number, unique: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    added_by: { type: String, default: "" },
    main_subcategory_id: { type: Number, ref: "SubCategory" },
    subcategory_id: { type: Number, ref: "SubSubCategory", required: true },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users2",
      default: null,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    photos: { type: String, default: "" },
    thumbnail_img: { type: String, default: "" },
    featured_img: { type: String, default: "" },
    flash_deal_img: { type: String, default: "" },
    video_provider: { type: String, default: "" },
    video_link: { type: String, default: "" },
    tags: { type: String, default: "" },
    description: { type: String, default: "" },
    unit_price: { type: Number, default: 0 },
    purchase_price: { type: Number, default: 0 },
    choice_options: { type: String, default: "" },
    colors: { type: String, default: "" },
    variations: { type: String, default: "" },
    todays_deal: { type: Number, default: 0 },
    published: { type: Number, default: 0 },
    featured: { type: Number, default: 0 },
    current_stock: { type: Number, default: 0 },
    unit: { type: String, default: "" },
    discount: { type: Number, default: 0 },
    discount_type: { type: String, default: "" },
    tax: { type: Number, default: 0 },
    tax_type: { type: String, default: "" },
    shipping_type: { type: String, default: "" },
    shipping_cost: { type: Number, default: 0 },
    num_of_sale: { type: Number, default: 0 },
    meta_title: { type: String, default: "" },
    meta_description: { type: String, default: "" },
    meta_img: { type: String, default: "" },
    pdf: { type: String, default: "" },
    slug: { type: String, default: "" },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);
productSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      // If the document is not new, don't do anything
      return next();
    }

    // Find the current count of documents and use it as the next category_id
    const count = await this.constructor.countDocuments({});
    this.product_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getProductById = async (product_id) => {
  try {
    const product = await Product.findOne({ product_id }).exec();
    return product;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

productSchema.index({ name: 1 }, { unique: false });

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, getProductById };
