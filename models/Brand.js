const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: String,
    logo: String,
    top: Number,
  },
  { timestamps: true }
);

brandSchema.statics.alphabetical = function () {
  return this.find().sort("name");
};

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
