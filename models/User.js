const mongoose = require("mongoose");
const validator = require("validator");
const { Product } = require("./Product");
const { Address } = require("./Address");

const userSchema2 = new mongoose.Schema(
  {
    user_id: { type: Number, unique: true },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username should be unique"],
    },
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

    user_type: {
      type: Number,
      required: [true, "User type is required"],
    },
    is_deleted: Number,
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
    products_bought: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

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
    // latitude: {
    //   type: String,
    //   required: [true, "Latitude is required"],
    // },
    // longitude: {
    //   type: String,
    //   required: [true, "Longitude is required"],
    // },
    // country: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
    // state: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
    // liveCity: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
    // livePincode: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
    // liveAddress: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },

    // input_latitude: {
    //   type: String,
    //   // required: [true, "Latitude is required"],
    // },
    // input_longitude: {
    //   type: String,
    //   // required: [true, "Longitude is required"],
    // },

    // input_liveCity: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
    // input_livePincode: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
    // input_liveAddress: {
    //   type: String,
    //   default: null,
    //   required: false,
    // },
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

// userSchema.pre("findOne", function (next) {
//   this.select("-_id -__v");
//   next();
// });

userSchema2.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.user_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const getUser = async (email) => {
  try {
    const user = await User2.findOne({ email }).exec();
    console.log(user);
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getUserById = async (user_id) => {
  try {
    const user = await User2.findOne({ user_id: user_id }).exec();
    console.log(user);
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getUserByUserUid = async (userUid) => {
  try {
    const user = await User2.findOne({ userUid: userUid }).exec();
    console.log(user);
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const findProducts = async (objectIds) => {
  try {
    const products = await Product.find({
      _id: { $in: objectIds },
    });
    return products;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

const User2 = mongoose.model("User2", userSchema2);
module.exports = {
  User2,
  getUser,
  getUserById,
  getUserByUserUid,
  findProducts,
};
