const mongoose = require("mongoose");
const { Product } = require("./Product");

const cartSchema = new mongoose.Schema(
  {
    cart_id: { type: Number, unique: true,  },
    user_id: { type: Number,  },
    userUid: { type: String,  },
    category_id: { type: Number,  },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product",  default: null }],
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address", default: null },
    price: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    coupon_code: { type: String, default: '' },
    coupon_applied: { type: Boolean, default: false },
    quantity: { type: Number, default: 0 },
    variation: { type: String, default: '' },
  },
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

const getProdutsByCartId = async (cart_id) => {
  try {
    const cart = await Cart.findOne({
      cart_id,
    }).exec();
    return cart ? cart.products : [];
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

const Cart = mongoose.model("Cart", cartSchema);
module.exports = {
  Cart,
  getCartById,
  populateCategoryId,
  populateUserId,
  getProdutsByCartId,
  findProducts,
};
