const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    added_by: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    photos: String,
    thumbnail_img: String,
    featured_img: String,
    flash_deal_img: String,
    video_provider: String,
    video_link: String,
    tags: String,
    description: String,
    unit_price: Number,
    purchase_price: Number,
    choice_options: String,
    colors: String,
    variations: String,
    todays_deal: Number,
    published: Number,
    featured: Number,
    current_stock: Number,
    unit: String,
    discount: Number,
    discount_type: String,
    tax: Number,
    tax_type: String,
    shipping_type: String,
    shipping_cost: Number,
    num_of_sale: Number,
    meta_title: String,
    meta_description: String,
    meta_img: String,
    pdf: String,
    slug: String,
    rating: Number,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
