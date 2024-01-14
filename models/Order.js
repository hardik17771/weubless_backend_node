const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: Number, unique: true },
    user_id: { type: Number, ref: "User2" },
    userUid: { type: String, ref: "User2" },
    // shop_id: { type: Number, ref: "Shop", required: true },
    products: [
      {
        product_id: { type: Number },
        quantity: { type: Number, default: 0 },
        shop_id : {type:Number}
      },
    ],
    cart_id: { type: Number, ref: "Cart" },
    total_amount : {type :Number ,default : 0},
    status : String 
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

orderSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const max = await this.constructor.findOne({}, { order_id: 1 })
    .sort({ order_id: -1 })
    .limit(1)
    .lean();

  
    this.order_id = max ? max.order_id + 1 : 1;

    next();
  } catch (error) {
    next(error);
  }
});

const getOrderById = async (order_id) => {
  try {
    const order = await Order.findOne({ order_id }).exec();
    return order;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const Order = mongoose.model("Order", orderSchema);

module.exports = {
  Order,
  getOrderById,
};
