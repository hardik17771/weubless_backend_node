const mongoose = require("mongoose");

const flashDealSchema = new mongoose.Schema(
  {
    title: String,
    start_date: Date,
    end_date: Date,
    status: Number,
  },
  {
    timestamps: true,
  }
);

const FlashDeal = mongoose.model("FlashDeal", flashDealSchema);

module.exports = FlashDeal;
