const { Product } = require("../../models/Product");
const { getSubCategoryById } = require("../../models/SubCategory");
const indexView = (req, res, next) => {
  res.render("admin/home");
};

const tablesView = async (req, res, next) => {
  const products = await Product.find().exec();

  // Fetch subcategory information for each product
  const productsWithSubcategory = await Promise.all(
    products.map(async (product) => {
      const subcategory = await getSubCategoryById(product.main_subcategory_id);
      return {
        ...product.toObject(),
        subcategoryName: subcategory ? subcategory.name : "Unknown Subcategory",
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

module.exports = {
  indexView,
  tablesView,
  billingView,
  profileView,
};
