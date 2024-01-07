const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    product_id: { type: Number, unique: true },
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    added_by: { type: String, default: "" },
    category_id: { type: Number, ref: "Category", default: 0 },
    main_subcategory_id: { type: Number, ref: "SubCategory", required: true },
    shop_id: { type: Number, ref: "Shop", required: true },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users2",
      default: null,
    },
    num_of_sale: { type: Number, default: 0 },
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
    meta_title: { type: String, default: "" },
    meta_description: { type: String, default: "" },
    meta_img: { type: String, default: "" },
    pdf: { type: String, default: "" },
    slug: { type: String, default: "" },
    rating: { type: Number, default: 0 },
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

productSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      // If the document is not new, don't do anything
      return next();
    }

    const max = await this.constructor.findOne({}, { product_id: 1 })
    .sort({ product_id: -1 })
    .limit(1)
    .lean();

  
    this.product_id = max ? max.product_id + 1 : 1;
    next();

  } catch (error) {
    next(error);
  }
});

const getProductByMongoId = async (product_mongo_id) => {
  try {
    const product = await Product.findOne({ _id: product_mongo_id }).exec();
    return product;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

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

const getTotalProductSoldAndSalesAndQuantity = async () => {
  try {
    const products = await Product.find().exec();

    let totalProductSold = 0;
    let totalSales = 0;
    let totalQuantity = 0;

    products.forEach(product => {
      totalProductSold += product.num_of_sale;
      totalSales += product.num_of_sale * product.unit_price;
      totalQuantity += product.quantity;
    });

    return {
      totalProductSold,
      totalSales,
      totalQuantity,
    };
  } catch (error) {
    throw new Error(`Error calculating totals: ${error.message}`);
  }
};
productSchema.index({ name: 1 }, { unique: false });

const getTopFourProducts = async () => {
  try {
    const topFourProducts = await Product.find({})
      .sort({ num_of_sale: -1 })
      .limit(5)
      .exec();

    const result = topFourProducts.map(product => ({
      category: product.category_id, 
      quantity: product.quantity,
      num_of_sale: product.num_of_sale,
      totalSales: product.num_of_sale * product.unit_price,
      name : product.name
    }));

    return result;
  } catch (error) {
    throw new Error(`Error fetching top four products: ${error.message}`);
  }
};

const getTotalProductCount = async () => {
  try {
    const totalProductCount = await Product.countDocuments().exec();
    return totalProductCount;
  } catch (error) {
    throw new Error(`Error fetching total product count: ${error.message}`);
  }
};

const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
  getProductByMongoId,
  getProductById,
  populateCategory,
  populateLatLong,
  getTotalProductSoldAndSalesAndQuantity,
  getTopFourProducts,
  getTotalProductCount
};
