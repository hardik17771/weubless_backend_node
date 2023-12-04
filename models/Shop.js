const mongoose = require("mongoose");
const { Product, getProductByMongoId } = require("./Product");

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
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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
  { timestamps: true },
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

const getProdutsByShopId = async (shop_id) => {
  try {
    const shop = await Shop.findOne({
      shop_id,
    }).exec();
    return shop ? shop.products : [];
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

const getShopsByCategory = async (category_id) => {
  try {
    const shops = await Shop.find({}).exec();
    let shop_list = [];
    for (const shop of shops) {
      let flag = 0;
      console.log("shop is", shop);

      for (const product_mongo_id of shop.products) {
        // const product_mongo_id = element;
        // console.log("product id", product_mongo_id);
        const product = await getProductByMongoId(product_mongo_id);
        // console.log("product is: ", product);
        // console.log("product CATEGORYID is: ", product.category_id);

        if (product.category_id === category_id) {
          flag = 1;
          break;
        }
      }

      if (flag === 1) {
        const {
          name,
          createdAt,
          updatedAt,
          shop_id,
          latitude,
          longitude,
          products,
          // user_id,
        } = shop;

        let productsList = [];
        // console.log(products);
        const productObjects = await findProducts(products);
        if (productObjects && productObjects.length > 0) {
          productObjects.forEach((product) => {
            productsList.push(product);
          });
        }

        let shop_data = {
          name,
          createdAt,
          updatedAt,
          shop_id,
          latitude,
          longitude,
          productsList,
        };
        // console.log(shop);
        // shop_list.push(shop);
        shop_list.push(shop_data);
      }
    }
    return shop_list;
  } catch (error) {
    throw new Error(`Error fetching shops by category: ${error.message}`);
  }
};

const Shop = mongoose.model("Shop", shopSchema);

module.exports = {
  Shop,
  getShopById,
  getProdutsByShopId,
  findProducts,
  getShopsByCategory,
};
