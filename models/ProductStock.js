const mongoose = require("mongoose");

const productStockSchema = new mongoose.Schema({
  // Define the fields for ProductStock model here
  // For example:
  quantity: Number,
  // Add other fields as needed
});

productStockSchema.methods.getProduct = function () {
  return mongoose.model("Product").findById(this.productId);
};

const ProductStock = mongoose.model("ProductStock", productStockSchema);

module.exports = ProductStock;
