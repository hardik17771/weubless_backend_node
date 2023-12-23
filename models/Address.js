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
      required: false,
    },
    state: {
      type: String,
      default: null,
      required: false,
    },
    city: {
      type: String,
      default: null,
      required: false,
    },
    pincode: {
      type: String,
      default: null,
      required: false,
    },
    address: {
      type: String,
      default: null,
      required: false,
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

const getAddressById = async (address_id) => {
  try {
    const address = await Address.findOne({ address_id }).exec();
    return address;
  } catch (error) {
    throw new Error(`Error fetching Address: ${error.message}`);
  }
};

const Address = mongoose.model("Address", addressSchema);
module.exports = {
  Address,
  getAddressById
};
