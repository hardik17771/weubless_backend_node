const mongoose = require("mongoose");

const businessSettingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    value: String,
  },
  {
    timestamps: true,
  }
);

const BusinessSetting = mongoose.model(
  "BusinessSetting",
  businessSettingSchema
);

module.exports = BusinessSetting;
