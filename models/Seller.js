const mongoose = require("mongoose");
const validator = require("validator");
const { Shop } = require("./Shop");

const sellerSchema = new mongoose.Schema(
  {
    seller_id: { type: Number, unique: true },

    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [255, "Name is too long"],
    },

    userUid: {
      type: String,
      required : true
    },


    phone: {
      type: String,
      required: [true, "Phone is required"],
      maxlength: [255, "Phone is too long"],
      unique: [true, "Phone should be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxlength: [255, "Email is too long"],
      unique: [true, "Email should be unique"],
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: "Invalid email format",
      },
    },


    dob: {
      type: String,
      required: true,
    },


    deviceToken: {
      type: String,
      default: null,
      required: true,
    },

    profileImage: {
      type: String,
      default: null,
      required: false,
    },
    shops_owned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],

    primary_address_index: {
      type: Number,
      default: 0,
      required : true
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
    addresses: [
      {
        latitude: { type: String, required: [true, "Latitude is required"] },
        longitude: { type: String, required: [true, "Longitude is required"] },
        country: { type: String, default: null, required: false },
        state: { type: String, default: null, required: false },
        city: { type: String, default: null, required: false },
        pincode: { type: String, default: null, required: false },
        address: { type: String, default: null, required: false },
      },
    ],

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



sellerSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const max = await this.constructor.findOne({}, { seller_id: 1 })
    .sort({ seller_id: -1 })
    .limit(1)
    .lean();

  
    this.seller_id = max ? max.seller_id + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});



const getSellerById = async (seller_id) => {
  try {
    const seller = await Seller.findOne({ seller_id: seller_id }).exec();
    console.log(seller);
    return seller;
  } catch (error) {
    throw new Error(`Error fetching seller: ${error.message}`);
  }
};

const getUserByUserUid = async (userUid) => {
  try {
    const seller = await User2.findOne({ userUid: userUid }).exec();
    console.log(seller);
    return seller;
  } catch (error) {
    throw new Error(`Error fetching seller: ${error.message}`);
  }
};

const findShops = async (objectIds) => {
  try {
    const shops = await Shop.find({
      _id: { $in: objectIds },
    });
    return shops;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const getTotalSellerCount = async () => {
  try {
    const totalSellerCount = await Seller.countDocuments().exec();
    return totalSellerCount;
  } catch (error) {
    throw new Error(`Error fetching total seller count: ${error.message}`);
  }
};

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = {
  Seller,
  getSellerById,
  getUserByUserUid,
  findShops,
  getTotalSellerCount
};
