const Product= require("../../models/Product");
const SubCategory= require("../../models/SubCategory");
const Category= require("../../models/Category");
const Shop = require("../../models/Shop");
const ApiRepository = require("../Repository/ApiRepository")
const mongoose = require("mongoose");
const Msg = require("../Msg")

const apiRepository = new ApiRepository();
const msg = new Msg();

// Helper function to get model data
const getModelData = async (model) => {
  return await model.find().exec();
};

// Helper function to get model data with names and custom ids
const getModelDataWithNames = async (model, idField) => {
  try {
    const data = await model.find().exec();

    // Extract custom id and name from each entry
    const formattedData = data.map(entry => ({
      id: entry[idField], // Use the custom id field name
      name: entry.name,    // Replace with the actual field name you want to use
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching model data:', error);
    throw error;
  }
};

// Helper function to process model data
const processModelData = async (data, idField, headers) => {
  return await Promise.all(
    data.map(async (item) => {
      const processedItem = { ...item.toObject() };

      let headers_field_list = {}
      for (const key of headers) { 
        let field_key = getFieldName(key)
        console.log("field_key", field_key)
        if(Array.isArray(field_key)){
          if(field_key[0]=== "idField"){
            headers_field_list[`${key}`] = field_key ? item[field_key[1]] : `Unknown ${field_key}`;
            headers_field_list["modelId"] = field_key ? item[field_key[1]] : `Unknown ${field_key}`;
          }
          else{
            headers_field_list[`${key}`] = field_key ? item[field_key[1]].length : `Unknown ${field_key}`;
          }
        }
        else{
          const foreignItem = await getModelById(field_key, item[field_key]);
          headers_field_list[`${key}`] = foreignItem ? foreignItem.name : `Unknown ${field_key}`;
        }
      }

      // Use Object.assign to add properties to processedItem
      Object.assign(processedItem, headers_field_list);

      console.log("processItem", processedItem);
      return processedItem;
    })
  );
};

// Helper function to get model by ID
const getModelById = async (modelName, id) => {
  switch (modelName) {
    case "main_subcategory_id":
      return await SubCategory.getSubCategoryById(id);
    case "category_id":
      return await Category.getCategoryById(id);
    case "shop_id":
      return await Shop.getShopById(id);
    default:
      return null;
  }
};

// Helper function to get the actual field name based on the template header
const getFieldName = (header) => {
  switch (header) {
    case "Product ID":
      return ["idField" , "product_id"];
    case "Sub Category ID":
      return ["idField","main_subcategory_id"];
    case "Category Id":
      return ["idField","category_id"];
    case "Product Count":
      return ["countField","products"];
    case "SubCategory Count":
      return ["countField","subCategories"];
    case "Product":
      return "name";
    case "Shop":
      return "shop_id";
    case "SubCategory":
      return "main_subcategory_id";
    case "Category":
      return "category_id";
    case "Updated At":
      return "updatedAt"


    default:
      return header.toLowerCase(); 
  }
};



const indexView = (req, res, next) => {
  res.render("admin/home");
};


const tablesView = async (req, res, next) => {
  try {
    const productHeaders = ["Product ID", "Product", "Shop", "SubCategory", "Category"];
    const subCategoryHeaders = ["Sub Category ID", "SubCategory", "Category"];
    const categoryHeaders = ["Category Id", "Category","SubCategory Count","Product Count"];

    const productData = await getModelData(Product.Product);
    const subCategoryData = await getModelData(SubCategory.SubCategory);
    const categoryData = await getModelData(Category.Category);

    const productAlteredData = await processModelData(productData, "product_id", productHeaders);
    const subCategoryAlteredData = await processModelData(subCategoryData, "main_subcategory_id", subCategoryHeaders);
    const categoryAlteredData = await processModelData(categoryData, "category_id", categoryHeaders);
    // console.log("productHeaders",productHeaders)
    // console.log("productAlteredData",productAlteredData)
    // console.log("subCategoryData",subCategoryHeaders)
    // console.log("subCategoryAlteredData",subCategoryAlteredData)
    res.render("admin/tables", { productHeaders,subCategoryHeaders,productAlteredData, subCategoryAlteredData , categoryHeaders ,categoryAlteredData});
  } catch (error) {
    console.error("Error fetching and processing data:", error);
    next(error);
  }
};


const billingView = (req, res, next) => {
  res.render("admin/billing");
};

const profileView = (req, res, next) => {
  res.render("admin/profile");
};


const detailView = async (req, res, next) => {
  const product_id = req.params.product_id;
  const product = await Product.getProductById(product_id);
  
  if (!product) {
    res.status(404).send('Product not found');
    return;
  }

  const uneditableFields = ["_id", "createdAt", "updatedAt", "__v" , "product_id"];
  
  const subCategoryData = await getModelDataWithNames(SubCategory.SubCategory, 'main_subcategory_id');
  const categoryData = await getModelDataWithNames(Category.Category, 'category_id');
  
  // Usage example
  // console.log('Subcategories:', subCategoryData);
  // console.log('Categories:', categoryData);


  const fieldTypes = Object.keys(Product.Product.schema.paths).reduce((acc, key) => {
    acc[key] = Product.Product.schema.paths[key].instance;
    return acc;
  }, {});

  res.render("admin/detail", {
    product,
    uneditableFields,
    fieldTypes,
    categoryData,
    subCategoryData
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
    // console.log(updatedData)
    const new_category_id = parseInt(updatedData.selected_category,10)
    updatedData.category_id = new_category_id
    const new_main_subcategory_id = parseInt(updatedData.selected_subcategory,10)
    updatedData.main_subcategory_id = new_main_subcategory_id
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
