const Product= require("../../models/Product");
const SubCategory= require("../../models/SubCategory");
const Category= require("../../models/Category");
const Shop = require("../../models/Shop");
const User = require("../../models/User");
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
        // console.log("field_key", field_key)
        if(Array.isArray(field_key)){
          if(field_key[0]=== "idField"){
            headers_field_list[`${key}`] = field_key ? item[field_key[1]] : `Unknown ${field_key}`;
            headers_field_list["modelId"] = field_key ? item[field_key[1]] : `Unknown ${field_key}`;
          }
          else if(field_key[0]=== "countField"){
            headers_field_list[`${key}`] = field_key ? item[field_key[1]].length : `Unknown ${field_key}`;
          }
          else if(field_key[0]=== "selfModelField"){
            headers_field_list[`${key}`] = field_key ? item[field_key[1]] : `Unknown ${field_key}`;
          }
          else {
            const foreignItem = await getModelById("getProductStats", item[field_key[1]]);
            console.log("Foreign item", foreignItem)
            headers_field_list[`${key}`] = foreignItem ? foreignItem : `Unknown ${field_key}`;
          }
        }
        else {
          const foreignItem = await getModelById(field_key, item[field_key]);
          headers_field_list[`${key}`] = foreignItem ? foreignItem.name : `Unknown ${field_key}`;
        }

      }

      // Use Object.assign to add properties to processedItem
      Object.assign(processedItem, headers_field_list);

      // console.log("processItem", processedItem);
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
    case "getProductStats":
      return await Category.getTotalProductsInfoByCategoryId(id);
    default:
      return null;
  }
};

// Helper function to get the actual field name based on the template header
const getFieldName = (header) => {
  switch (header) {
    case "User ID":
      return ["idField" , "user_id"]
    case "Product ID":
      return ["idField" , "product_id"];
    case "Sub Category ID":
      return ["idField","main_subcategory_id"];
    case "Category Id":
      return ["idField","category_id"];
    case "UserName":
      return ["selfModelField","username"]
    case "Email":
      return ["selfModelField","email"]
    case "Phone":
      return ["selfModelField","phone"]
    case "City":
      return ["selfModelField","city"]
    case "Product Count":
      return ["countField","products"];
    case "SubCategory Count":
      return ["countField","subCategories"];
    case "Product Sales":
      return ["lineChartView", "category_id"]
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



const indexView = async (req, res, next) => {
  const totals = await Product.getTotalProductSoldAndSalesAndQuantity()
  const total_users = await User.getTotalUserCount() 
  const popularProducts = await Product.getTopFourProducts()
  
  for (const product of popularProducts) {
    const category = await Category.getCategoryById(product.category);
    product.category = category ? category.name : null; 
  }

  // const category_products = await Category.getTotalProductsInfoByCategoryId(1)
  // console.log(category_products)
  res.render("admin/home" , {totals,total_users,popularProducts});
};


const tablesView = async (req, res, next) => {
  try {

    const userHeaders = ["User ID", "UserName", "Email", "Phone", "City"];
    const productHeaders = ["Product ID", "Product", "Shop", "SubCategory", "Category"];
    const subCategoryHeaders = ["Sub Category ID", "SubCategory", "Category","Product Count"];
    const categoryHeaders = ["Category Id", "Category","SubCategory Count","Product Count","Product Sales"];

    const userData = await getModelData(User.User2);
    const productData = await getModelData(Product.Product);
    const subCategoryData = await getModelData(SubCategory.SubCategory);
    const categoryData = await getModelData(Category.Category);

    const userAlteredData = await processModelData(userData, "user_id", userHeaders);
    const productAlteredData = await processModelData(productData, "product_id", productHeaders);
    const subCategoryAlteredData = await processModelData(subCategoryData, "main_subcategory_id", subCategoryHeaders);
    const categoryAlteredData = await processModelData(categoryData, "category_id", categoryHeaders);

    console.log("CategoryAlteredData",categoryAlteredData)
    res.render("admin/tables", { userHeaders , userAlteredData,productHeaders,subCategoryHeaders,productAlteredData, subCategoryAlteredData , categoryHeaders ,categoryAlteredData});
  } catch (error) {
    console.error("Error fetching and processing data:", error);
    next(error);
  }
};

const singleTableView = async (req, res, next) => {
  try {
    const tableName = req.params.tableName;
    const tableData = await getTableData(tableName.toLowerCase());
    console.log("tableName",tableName) 
    console.log("tableData",tableData) 
    res.render("admin/singletable", {  tableName, tableData});
  } catch (error) {
    console.error("Error fetching and processing data:", error);
    next(error);
  }
};


async function getTableData(tableName) {

  switch (tableName) {
    case 'users':
      const userHeaders = ["User ID", "UserName", "Email", "Phone", "City"];
      const userData = await getModelData(User.User2);
      const userAlteredData = await processModelData(userData, "user_id", userHeaders);
      return { headers: userHeaders, data: userAlteredData };
      
    case 'products':
      const productHeaders = ["Product ID", "Product", "Shop", "SubCategory", "Category"];
      const productData = await getModelData(Product.Product);
      const productAlteredData = await processModelData(productData, "product_id", productHeaders);
      return { headers: productHeaders, data: productAlteredData };
        
        
    case 'subcategories':
      const subCategoryHeaders = ["Sub Category ID", "SubCategory", "Category","Product Count"];
      const subCategoryData = await getModelData(SubCategory.SubCategory);
      const subCategoryAlteredData = await processModelData(subCategoryData, "main_subcategory_id", subCategoryHeaders);
      return { headers: subCategoryHeaders, data: subCategoryAlteredData };
    
    case 'categories':
      const categoryHeaders = ["Category Id", "Category","SubCategory Count","Product Count","Product Sales"];
      const categoryData = await getModelData(Category.Category);
      const categoryAlteredData = await processModelData(categoryData, "category_id", categoryHeaders);
      return { headers: categoryHeaders, data: categoryAlteredData };

    default:
      return null;
  }
}


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

  const uneditableFields = ["_id", "createdAt", "updatedAt", "__v" ,];
  
  const subCategoryData = await getModelDataWithNames(SubCategory.SubCategory, 'main_subcategory_id');
  const categoryData = await getModelDataWithNames(Category.Category, 'category_id');
  

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


const dynamicDetailView = async (req, res, next) => {
  const model_name = req.params.model_name;
  const model_id = req.params.model_id;

  const Model = getModelByName(model_name);

  if (!Model) {
    res.status(404).send('Model not found');
    return;
  }

  const model = await Model.getModelById(model_id);

  if (!model) {
    res.status(404).send(`${model_name} not found`);
    return;
  }

  const uneditableFields = ["_id", "createdAt", "updatedAt", "__v"];

  // Fetch category and subcategory data for dynamic models
  const subCategoryData = await getModelDataWithNames(getSubCategoryModel(Model), 'main_subcategory_id');
  const categoryData = await getModelDataWithNames(getCategoryModel(Model), 'category_id');

  const fieldTypes = Object.keys(Model.schema.paths).reduce((acc, key) => {
    acc[key] = Model.schema.paths[key].instance;
    return acc;
  }, {});

  res.render("admin/detail", {
    model,
    uneditableFields,
    fieldTypes,
    categoryData,
    subCategoryData
  });
};

const getModelByName = (model_name) => {
  switch (model_name) {
    case 'product':
      return Product.Product;
    default:
      return null;
  }
};

const getSubCategoryModel = (parentModel) => {
  return SubCategory.SubCategory;
};

const getCategoryModel = (parentModel) => {
  return Category.Category;
};


const mapView = async (req, res, next) => {
  try {
    const shops = await Shop.Shop.find({}, 'name latitude longitude');
    const locations = shops.map(shop => ({
      lat: parseFloat(shop.latitude),
      lon: parseFloat(shop.longitude),
      name: shop.name
  }));
  console.log(locations)
  res.render("admin/map", { locations: JSON.stringify(locations) });

} catch (error) {
    console.log(error);
}};



module.exports = {
  indexView,
  tablesView,
  singleTableView,
  billingView,
  profileView,
  detailView,
  updateProduct,
  mapView,
  dynamicDetailView
};
