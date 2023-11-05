const mongoose = require("mongoose");

// Define the schema for Advertisement
const advertisementSchema = new mongoose.Schema({
  ad_id: String,
  category_id: String,
  name: String,
  date_range: String,
  amount: String,
});

advertisementSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.ad_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getAdvertisementById = async (ad_id) => {
  try {
    const advertisement = await Advertisement.findOne({ ad_id }).exec();
    return advertisement;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getAdvertisementsByCategoryId = async (category_id) => {
  try {
    const advertisements = await Advertisement.find({ category_id }).exec();
    return advertisements;
  } catch (error) {
    throw new Error(`Error fetching advertisements: ${error.message}`);
  }
};

// Create the Advertisement model
const Advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = {
  Advertisement,
  getAdvertisementById,
  getAdvertisementsByCategoryId,
};
