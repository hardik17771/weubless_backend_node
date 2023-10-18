const mongoose = require("mongoose");
// const { SubSubCategory } = require("./SubSubCategory");

const productSchema = new mongoose.Schema(
  {
    product_id: { type: Number, unique: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    added_by: { type: String, default: "" },
    category_id: { type: Number, ref: "Category", default: 0 },
    main_subcategory_id: { type: Number, ref: "SubCategory", required: true },
    // subcategory_id: { type: Number, ref: "SubSubCategory", required: true },
    shop_id: { type: Number, ref: "Shop", required: true },
    latitude: {
      type: String,
      // required: [true, "Latitude is required"],
    },
    longitude: {
      type: String,
      // required: [true, "Longitude is required"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users2",
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

const populateCategory = async (category_id, product_id) => {
  // try {
  console.log(category_id);
  const product = await Product.findOne({ product_id }).exec();

  if (category_id) {
    product.category_id = category_id;

    await product.save();
    console.log(product);
    return product;
  } else {
    throw new Error(`Category with category ID ${category_id} not found`);
  }
  // } catch (error) {
  //   throw new Error(`Error populating main_subcategory_id: ${error.message}`);
  // }
};
const populateLatLong = async (lat, long, product_id) => {
  // try {
  console.log(lat, long);
  const product = await Product.findOne({ product_id }).exec();

  if (lat && long) {
    product.latitude = lat;
    product.longitude = long;

    await product.save();
    console.log(product);
    return product;
  } else {
    throw new Error(`lat long not defined`);
  }
  // } catch (error) {
  //   throw new Error(`Error populating main_subcategory_id: ${error.message}`);
  // }
};

productSchema.index({ name: 1 }, { unique: false });

const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
  getProductById,
  populateCategory,
  populateLatLong,
};
