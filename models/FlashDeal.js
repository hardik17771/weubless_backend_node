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

const FlashDeal = mongoose.model("FlashDeal", flashDealSchema);

module.exports = FlashDeal;
