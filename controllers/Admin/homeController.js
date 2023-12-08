const Product= require("../../models/Product");
const SubCategory= require("../../models/SubCategory");
const Shop = require("../../models/Shop");
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

const detailView = async (req, res, next) => {
  const product_id = req.params.product_id;
  const product = await Product.getProductById(product_id)

  // Fetch the product details based on productId
  console.log(product)
  if (!product) {
    // Handle case where the product is not found
    res.status(404).send('Product not found');
    return;
  }

  // Fetch additional information (subcategory, shop) if needed

  res.render("admin/detail", {product});
};


module.exports = {
  indexView,
  tablesView,
  billingView,
  profileView,
  detailView
};
