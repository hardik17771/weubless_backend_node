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
  }
);

const FlashDealProduct = mongoose.model(
  "FlashDealProduct",
  flashDealProductSchema
);

module.exports = FlashDealProduct;
