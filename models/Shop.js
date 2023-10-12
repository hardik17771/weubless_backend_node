const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shop_id: { type: Number, unique: true },
    name: { type: String, required: true },
    latitude: {
      type: String,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: String,
      required: [true, "Longitude is required"],
    },
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

shopSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.shop_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getShopById = async (shop_id) => {
  try {
    const shop = await Shop.findOne({ shop_id }).exec();
    return shop;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const Shop = mongoose.model("Shop", shopSchema);

module.exports = { Shop, getShopById };
