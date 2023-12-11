const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    address_id: { type: Number, unique: true },
    user_id: Number,
    userUid: {
      type: String,
    },
    latitude: {
      type: String,
      required: [true, "Latitude is required"],
    },
    longitude: {
      type: String,
      required: [true, "Longitude is required"],
    },
    country: {
      type: String,
      default: null,
      required: true,
    },
    state: {
      type: String,
      default: null,
      required: true,
    },
    city: {
      type: String,
      default: null,
      required: true,
    },
    pincode: {
      type: String,
      default: null,
      required: true,
    },
    address: {
      type: String,
      default: null,
      required: true,
    },
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

addressSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.address_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const Address = mongoose.model("Address", addressSchema);
module.exports = {
  Address,
};
