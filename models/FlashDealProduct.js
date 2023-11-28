const mongoose = require("mongoose");

const flashDealProductSchema = new mongoose.Schema(
  {
    flash_deal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashDeal",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    discount: Number,
    discount_type: String,
  },
  {
    timestamps: true,
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

const FlashDealProduct = mongoose.model(
  "FlashDealProduct",
  flashDealProductSchema
);

module.exports = FlashDealProduct;
