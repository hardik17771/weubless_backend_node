const mongoose = require("mongoose");
const { Product } = require("./Product");

const cartSchema = new mongoose.Schema(
  {
    cart_id: { type: Number, unique: true,  },
    product_id: { type: Number  },
    user_id: { type: Number,  },
    // shop_id: { type: Number,  },
    userUid: { type: String,  },
    category_id: { type: Number,  },
    products: [
      {
        product_id: { type: Number },
        quantity: { type: Number, default: 0 },
        shop_id : {type : Number},
      },
    ],
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product",  default: null }],
    price: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },

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

cartSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const max = await this.constructor.findOne({}, { cart_id: 1 })
    .sort({ cart_id: -1 })
    .limit(1)
    .lean();

  
    this.cart_id = max ? max.cart_id + 1 : 1;

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

const populateShopId = async (shop_id, cart_id) => {
  // try {
  // console.log(lat, long);
  const cart = await Cart.findOne({ cart_id }).exec();

  if (shop_id) {
    cart.shop_id = shop_id;
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

const populateAmount = async (amount, cart_id) => {
  try {
    const cart = await Cart.findOne({ cart_id }).exec();

    if (cart) {
      console.log("model amount",amount)
      cart.amount = amount;

      await cart.save();

      return cart;
    } else {
      // Throw an error if the cart is not found
      throw new Error(`Cart not found`);
    }
  } catch (error) {
    throw new Error(`Error populating amount: ${error.message}`);
  }
};

const getProductsByCartId = async (cart_id) => {
  try {
    const cart = await Cart.findOne({
      cart_id,
    }).exec();

    product_ids = []
    for(const product of cart.products)
    {
      const _id = product._id
      product_ids.push(_id)
    }

    return cart ? product_ids : [];
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
  populateShopId,
  populateAmount,
  getProductsByCartId,
  findProducts,
};
