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

const BusinessSetting = mongoose.model(
  "BusinessSetting",
  businessSettingSchema
);

module.exports = BusinessSetting;
