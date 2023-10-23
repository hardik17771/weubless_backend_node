const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  price: Number,
  tax: Number,
  shipping_cost: Number,
  discount: Number,
  coupon_code: String,
  coupon_applied: Boolean,
  quantity: Number,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variation: String,
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
