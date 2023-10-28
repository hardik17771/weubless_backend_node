const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cart_id: { type: Number, unique: true },
  user_id: Number,
  category_id: Number,
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  price: Number,
  tax: Number,
  shipping_cost: Number,
  discount: Number,
  coupon_code: String,
  coupon_applied: Boolean,
  quantity: Number,
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  variation: String,
});

// Define a pre-save middleware to handle auto-incrementing category_id
cartSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.cart_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getCartById = async (cart_id) => {
  try {
    const cart = await Cart.findOne({
      cart_id,
    }).exec();
    return cart;
  } catch (error) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

const populateCategoryId = async (category_id, cart_id) => {
  // try {
  // console.log(lat, long);
  const cart = await Cart.findOne({ cart_id }).exec();

  if (category_id) {
    cart.category_id = category_id;
    await cart.save();
    console.log(cart);
    return cart;
  } else {
    throw new Error(`cart not defined`);
  }
  // } catch (error) {
  //   throw new Error(`Error populating main_subcategory_id: ${error.message}`);
  // }
};

const populateUserId = async (user_id, cart_id) => {
  // try {
  // console.log(lat, long);
  const cart = await Cart.findOne({ cart_id }).exec();

  if (user_id) {
    cart.user_id = user_id;
    await cart.save();
    console.log(cart);
    return cart;
  } else {
    throw new Error(`cart not defined`);
  }
  // } catch (error) {
  //   throw new Error(`Error populating main_subcategory_id: ${error.message}`);
  // }
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = { Cart, getCartById, populateCategoryId, populateUserId };
