const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    logo: String,
    sliders: String,
    address: String,
    facebook: String,
    google: String,
    twitter: String,
    youtube: String,
    instagram: String,
    slug: String,
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
