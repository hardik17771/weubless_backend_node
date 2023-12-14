const Product= require("../../models/Product");
const SubCategory= require("../../models/SubCategory");
const Shop = require("../../models/Shop");
const ApiRepository = require("../Repository/ApiRepository")
const mongoose = require("mongoose");
const Msg = require("../Msg")

const apiRepository = new ApiRepository();
const msg = new Msg();
const indexView = (req, res, next) => {
  res.render("admin/home");
};

const tablesView = async (req, res, next) => {
  const products = await Product.Product.find().exec();

  // Fetch subcategory information for each product
  const productsWithSubcategory = await Promise.all(
    products.map(async (product) => {
      const subcategory = await SubCategory.getSubCategoryById(product.main_subcategory_id);
      const shop = await Shop.getShopById(product.shop_id);
      return {
        ...product.toObject(),
        subcategoryName: subcategory ? subcategory.name : "Unknown Subcategory",
        shopName: shop ? shop.name : "Unknown Shop",
      };
    })
  );

  res.render("admin/tables", { productsWithSubcategory });
};

const billingView = (req, res, next) => {
  res.render("admin/billing");
};

const profileView = (req, res, next) => {
  res.render("admin/profile");
};


// const detailView = async (req, res, next) => {
//   const product_id = req.params.product_id;
//   const product = await Product.getProductById(product_id)

//   // Fetch the product details based on productId
//   console.log(product)
//   if (!product) {
//     // Handle case where the product is not found
//     res.status(404).send('Product not found');
//     return;
//   }

//   // Fetch additional information (subcategory, shop) if needed

//   res.render("admin/detail", {product});
// };


// const detailView = async (req, res, next) => {
//   const product_id = req.params.product_id;
//   const product = await Product.getProductById(product_id);

//   // Fetch the product details based on productId
//   if (!product) {
//     // Handle case where the product is not found
//     res.status(404).send('Product not found');
//     return;
//   }

//   if (req.method === 'POST') {
//     // Handle the form submission and update the product in the database
//     const updatedData = req.body; // Assuming you're using a middleware like body-parser
//     const updateResult = await updateProduct(updatedData);

//     // Handle the result, perhaps redirect to the detail page with a success query parameter
//     if (updateResult.code === 297) {
//       res.redirect(`/admin/detail/${product_id}?success=true`);
//     } else {
//       // Handle errors
//       res.status(500).send('Error updating product');
//     }
//   } else {
//     // Render the detail page as usual
//     res.render("admin/detail", { product });
//   }
// };


const detailView = async (req, res, next) => {
  const product_id = req.params.product_id;
  const product = await Product.getProductById(product_id);
  
  if (!product) {
    res.status(404).send('Product not found');
    return;
  }

  const uneditableFields = ["_id", "createdAt", "updatedAt", "__v"];

  // Get the schema paths and their types
  const fieldTypes = Object.keys(Product.Product.schema.paths).reduce((acc, key) => {
    acc[key] = Product.Product.schema.paths[key].instance;
    return acc;
  }, {});

  res.render("admin/detail", {
    product,
    uneditableFields,
    fieldTypes,
  });
};


const updateProduct = async (req, res, next) => {
  const product_id = req.params.product_id;
  const product = await Product.getProductById(product_id);

  if (!product) {
    res.status(404).send('Product not found');
    return;
  }

  if (req.method === 'POST') {
    const updatedData = req.body;

    const convertToObjectId = (value) => {
      try {
        if (value === "") {
          return null;
        }
        return mongoose.Types.ObjectId(value);
      } catch (error) {
        console.error(`Error converting ${value} to ObjectId:`, error);
        return value; // Return the original value if conversion fails
      }
    };
    updatedData.user_id = convertToObjectId(updatedData.user_id);
    updatedData.brand_id = convertToObjectId(updatedData.brand_id);

    const updateResult = await apiRepository.updateProduct(updatedData);
    const error_msg = msg.responseMsg(updateResult.code); 

    if (updateResult.code === 297) {
      res.redirect(`/admin/detail/${product_id}?success=true`);
    } else {
      res.redirect(`/admin/detail/${product_id}?success=false&msg=${error_msg}`);
    }
  } else {
    res.render("admin/detail", { product });
  }
};
module.exports = {
  indexView,
  tablesView,
  billingView,
  profileView,
  detailView,
  updateProduct
};
