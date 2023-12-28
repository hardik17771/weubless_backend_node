const Product= require("../../models/Product");
const SubCategory= require("../../models/SubCategory");
const Category= require("../../models/Category");
const Shop = require("../../models/Shop");
const User = require("../../models/User");
const Address = require("../../models/Address");
const ApiRepository = require("../Repository/ApiRepository")
const mongoose = require("mongoose");
const Msg = require("../Msg")
const ApiController = require("../../controllers/APIController")

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

// Helper function to get model data with names and custom ids
const getOnlyListModelDataWithNames = async (model, mongooseIds , idField) => {
  try {
    // const data = await model.find().exec();

    // // Extract custom id and name from each entry
    // const formattedData = data.map(entry => ({
    //   id: entry[idField], // Use the custom id field name
    //   name: entry.name,    // Replace with the actual field name you want to use
    // }));

    const documents = await model.find({ _id: { $in: mongooseIds } });

    console.log("documents",documents)
    const result = documents.map(doc => ({
      name: doc.name, 
      id: doc[idField],
    }));

    return result;
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
const getModelById = async (idName, id) => {
  switch (idName) {
    case "main_subcategory_id":
      return await SubCategory.getSubCategoryById(id);
    case "category_id":
      return await Category.getCategoryById(id);
    case "shop_id":
      return await Shop.getShopById(id);
    case "product_id":
      return await Product.getProductById(id);
    case "user_id":
      return await User.getUserById(id);
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
    case 'user':
      const userHeaders = ["User ID", "UserName", "Email", "Phone", "City"];
      const userData = await getModelData(User.User2);
      const userAlteredData = await processModelData(userData, "user_id", userHeaders);
      return { headers: userHeaders, data: userAlteredData };
      
    case 'product':
      const productHeaders = ["Product ID", "Product", "Shop", "SubCategory", "Category"];
      const productData = await getModelData(Product.Product);
      const productAlteredData = await processModelData(productData, "product_id", productHeaders);
      return { headers: productHeaders, data: productAlteredData };
        
        
    case 'subcategory':
      const subCategoryHeaders = ["Sub Category ID", "SubCategory", "Category","Product Count"];
      const subCategoryData = await getModelData(SubCategory.SubCategory);
      const subCategoryAlteredData = await processModelData(subCategoryData, "main_subcategory_id", subCategoryHeaders);
      return { headers: subCategoryHeaders, data: subCategoryAlteredData };
    
    case 'category':
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


const addView = async (req, res, next) => {
  const model_name = req.params.model_name;
  // const model_id = req.params.model_id;
  const ModelParameters = getModelParameters(model_name);
  const createFunction  = ModelParameters["createFunction"]
  const requiredFieldsDummyData = ModelParameters["requiredFieldsDummyData"]
  const idName = ModelParameters["idName"]
  const success_code = ModelParameters["success_code"]
  console.log("requiredFieldsDummyData",requiredFieldsDummyData)
  const response = await createFunction(requiredFieldsDummyData)
  
  console.log("response",response)
  console.log("responseCode",response["code"])
  console.log("responseData",response["data"])
  const model_id = response["data"][idName]
  if(model_name === "user")
  {

    if (response["status_code"] === success_code) {
      res.redirect(`/admin/item-detail/${model_name}/${model_id}`);
    } else {
      alert(`Couldn't create new ${model_name}`)
      res.redirect(`/admin/`)
    }
  }
  else
  {
    if (response["code"] === success_code) {
      res.redirect(`/admin/item-detail/${model_name}/${model_id}`);
    } else {
      alert(`Couldn't create new ${model_name}`)
      res.redirect(`/admin/`)
    }
  }
};


const deleteView = async (req, res, next) => {
  try {
    const model_name = req.body.model_name;
    const model_id = req.body.model_id;
    const ModelParameters = getModelParameters(model_name);
    const particularModel = await getModelById(ModelParameters["idName"], model_id);
    const Model = ModelParameters["name"]
    // const idName = ModelParameters["idName"]
    if (!Model) {
      res.status(404).send(`${model_name} not found`);
      return;
    }
      await Model.deleteOne({_id : particularModel._id});
      console.log("deletedData", particularModel)
      res.redirect(`/admin/table/${model_name}?success=deleted`);
  } catch (error) {
    next(error);
  }
};

const showDeleteConfirmationPage = (req, res) => {
  const model_name = req.params.model_name;
  const model_id = req.params.model_id;
  const ModelParameters = getModelParameters(model_name);

  res.render('admin/deleteconfirmation', {
    model_name,
    model_id,
    idName: ModelParameters["idName"]
  });
};



// Function to generate a random 3-digit number
function getRandomThreeDigitNumber() {
  return Math.floor(100 + Math.random() * 900);
}

// Function to generate a random 10-digit number
function getRandomTenDigitNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

// const getAddModelParameters = (model_name) => {
//   switch (model_name) {
//     case 'product':
//       return {
//         "name": Product.Product,
//         "idName": "product_id",
//         "requiredFields" : ['name','product_id','main_subcategory_id'],
//         "createFunction" : apiRepository.createProduct,
//         "requiredFieldsDummyData" : {'name': "DummyProduct",'main_subcategory_id' : 1 , 'shop_id': 1},
//         "success_code" : 716
//       };
//     case 'user':
//       return {
//         "name": User.User2,
//         "idName": "user_id",
//         "requiredFields" : ['name','user_id','username','userUid','phone','email','user_type','dob','deviceToken','profileImage','primary_address_index','latitude','longitude','country','state','city','pincode','address'],
//         "createFunction" : apiRepository.register,
//         "requiredFieldsDummyData" : {
//           "userUid": "DummyUserUid" + getRandomThreeDigitNumber(),
//           "name": "Dummy Name",
//           "username": "DummyUserName" + getRandomThreeDigitNumber(),
//           "phone": getRandomTenDigitNumber().toString(),
//           "email": "dummy" + getRandomThreeDigitNumber() + "@email.com",          "user_type": 1,
//           "profileImage" : "image_url",
//           "latitude": "100",
//           "longitude": "100",
//           "country" : "dummycountry",
//           "state" : "dummystate",
//           "city" : "dummycity",
//           "pincode" : "123456",
//           "address" : "dummyaddress",
//           "dob" : "01/01/2000",
//           "deviceToken" : "1234"
//       },
//       "success_code" : 200

        
//       };
//     case 'category':
//       return {
//         "name": Category.Category,
//         "idName": "category_id",
//         "requiredFields" : ['name','image','category_id'],
//         "createFunction" : apiRepository.createCategory,
//         "requiredFieldsDummyData" : {'name': "DummyCategory",'image' : 'https://weucart.online/public/uploads/all/zadqgmYfjv2x5gWDrBqzT81ddRyaCvLUkprIIhKU.png'},
//         "success_code" : 706
        
        
//       };
//       case 'subcategory':
//         return {
//           "name": SubCategory.SubCategory,
//           "idName": "main_subcategory_id",
//           "requiredFields" : ['name','main_subcategory_id','category_id'],
//           "createFunction" : apiRepository.createSubCategory,
//           "requiredFieldsDummyData" : {'name': "DummySubCategory",'category_id' : 1},
//           "success_code" : 712
//       };
//     default:
//       return null;
//   }
// };


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



const dynamicDetailView = async (req, res, next) => {
  console.log("Hlleo")
  const model_name = req.params.model_name;
  const model_id = req.params.model_id;
  const ModelParameters = getModelParameters(model_name);

  // console.log("model_name",model_name)
  // console.log("model_id",model_id)
  // console.log("Model", ModelParameters)
  if (!ModelParameters["name"]) {
    res.status(404).send('Model not found');
    return;
  }

  const particularModel = await getModelById(ModelParameters["idName"] , model_id);
  // console.log("particular Model",particularModel)
  // console.log("ModelParameters['idName']",ModelParameters["idName"])
  if (!particularModel) {
    res.status(404).send(`${model_name} not found`);
    return;
  }

  const uneditableFields = ModelParameters["uneditableFields"]
  const requiredFields = ModelParameters["requiredFields"]

  let fieldModelsList = [];
  for (const fieldModel of ModelParameters["fieldModels"]) {
      const fieldModelData = await getModelDataWithNames(fieldModel[0], fieldModel[1]);
      const modifiedFieldModelData = {"fields" : { "title" : fieldModel[2] , "fieldmodelid":fieldModel[1] } , "data" : fieldModelData }
      fieldModelsList.push(modifiedFieldModelData);
  }
  
  let onlyListFieldModelsList = []
  
  for (const onlyListFieldModel of ModelParameters["onlyListFieldModels"]) {
      
      const field = onlyListFieldModel[2]
      // console.log("field",field)
      if(field === "addresses")
      {
        // console.log("particularModel[field]",particularModel[field])
        for(const address of particularModel[field])
        {
          const modifiedFieldModelData = {"fields" : { "title" : onlyListFieldModel[2] , "fieldmodelid":onlyListFieldModel[1] } , "data" : address }
          onlyListFieldModelsList.push(modifiedFieldModelData);
        }
      }
      else
      {
        const mongooseIds = particularModel[field]
        // console.log(mongooseIds)
        const onlyListFieldModelData = await getOnlyListModelDataWithNames(onlyListFieldModel[0], mongooseIds,onlyListFieldModel[1]);
        const modifiedFieldModelData = {"fields" : { "title" : onlyListFieldModel[2] , "fieldmodelid":onlyListFieldModel[1] } , "data" : onlyListFieldModelData }
        onlyListFieldModelsList.push(modifiedFieldModelData);
      }
  }
  
  // console.log("fieldModelList",fieldModelsList )
  // console.log("onlyListFieldModelsList",onlyListFieldModelsList)
  // console.log("onlyListFieldModelsList data",onlyListFieldModelsList[0]["data"])
  // console.log("onlyListFieldModelsList",onlyListFieldModelsList[0]["data"][0])
  // console.log("list field",ModelParameters["onlyListFieldModels"])
  // const my_var = ModelParameters["onlyListFieldModels"][0][2]
  // console.log("particularModel.my_var",particularModel[my_var])
  // console.log('my_var',my_var)


  // console.log("fieldModelsList",fieldModelsList)

  const fieldTypes = Object.keys(ModelParameters["name"].schema.paths).reduce((acc, key) => {
    acc[key] = ModelParameters["name"].schema.paths[key].instance;
    return acc;
  }, {});

  

  res.render("admin/dynamicdetail", {
    model_name,
    model_id,
    particularModel,
    uneditableFields,
    requiredFields,
    fieldTypes,
    fieldModelsList,
    onlyListFieldModelsList

  });
};

const getModelParameters = (model_name) => {
  switch (model_name) {
    case 'product':
      return {
        "name": Product.Product,
        "idName": "product_id",
        "uneditableFields": ["_id", "createdAt", "updatedAt", "__v" ,"product_id","category_id","main_subcategory_id"],
        "fieldModels" : [
          [SubCategory.SubCategory , "main_subcategory_id", 'SubCategory'],
          [Category.Category, "category_id" , 'Category']
          // [Shop.Shop, "shop_id" , 'Shop']
        ],
        "onlyListFieldModels" :[],
        "requiredFields" : ['name','product_id','main_subcategory_id','shop_id'],
        "createFunction" : apiRepository.createProduct,
        "requiredFieldsDummyData" : {'name': "DummyProduct",'main_subcategory_id' : 1 , 'shop_id': 1},
        "success_code" : 716,
        "updateFunction": apiRepository.updateProduct,
        "convertToObjectIdFields": ["user_id", "brand_id"],
        "noUpdateFields" : [],
        "update_success_code" : 297

      };
    case 'user':
      return {
        "name": User.User2,
        "idName": "user_id",
        "uneditableFields": ["_id", "createdAt", "updatedAt", "__v" ,"user_id","addresses","primary_address_index"],
        "fieldModels" : [
          // [SubCategory.SubCategory , "main_subcategory_id", 'SubCategory'],
          // [Category.Category, "category_id" , 'Category']
        ],
        "onlyListFieldModels" :
        [
          [Product.Product , "product_id","products_bought"],
          [Address.Address , "address_id","addresses"]
        ],
        "requiredFields" : ['name','user_id','username','userUid','phone','email','user_type','dob','deviceToken','profileImage','primary_address_index','latitude','longitude','country','state','city','pincode','address'],
        "createFunction" : apiRepository.register,
        "requiredFieldsDummyData" : {
          "userUid": "DummyUserUid" + getRandomThreeDigitNumber(),
          "name": "Dummy Name",
          "username": "DummyUserName" + getRandomThreeDigitNumber(),
          "phone": getRandomTenDigitNumber().toString(),
          "email": "dummy" + getRandomThreeDigitNumber() + "@email.com",          "user_type": 1,
          "profileImage" : "image_url",
          "latitude": "100",
          "longitude": "100",
          "country" : "dummycountry",
          "state" : "dummystate",
          "city" : "dummycity",
          "pincode" : "123456",
          "address" : "dummyaddress",
          "dob" : "01/01/2000",
          "deviceToken" : "1234"
      },
      "success_code" : 200,
      "updateFunction": apiRepository.updateProfile,
      "convertToObjectIdFields": [],
      "noUpdateFields" : [],
      "update_success_code" : 208,
      



      };
    case 'category':
      return {
        "name": Category.Category,
        "idName": "category_id",
        "uneditableFields": ["_id", "createdAt", "updatedAt", "__v" ,"category_id","products","subCategories","image"],
        "fieldModels" : [
          // [Category.Category, "category_id" , 'Category']
        ],
        "onlyListFieldModels":[
          [SubCategory.SubCategory , "main_subcategory_id", 'subCategories'],
          [Product.Product , "product_id","products"],
        ],
        "requiredFields" : ['name','image','category_id'],
        "createFunction" : apiRepository.createCategory,
        "requiredFieldsDummyData" : {'name': "DummyCategory",'image' : 'https://weucart.online/public/uploads/all/zadqgmYfjv2x5gWDrBqzT81ddRyaCvLUkprIIhKU.png'},
        "success_code" : 706,
        "updateFunction": apiRepository.updateCategory,
        "convertToObjectIdFields": [],
        "noUpdateFields" : ['subCategories','products'],
        "update_success_code" : 297



      };
    case 'subcategory':
      return {
        "name": SubCategory.SubCategory,
        "idName": "main_subcategory_id",
        "uneditableFields": ["_id", "createdAt", "updatedAt", "__v" ,"main_subcategory_id","category_id"],
        "fieldModels" : [
          [Category.Category, "category_id" , 'Category']
        ],
        "onlyListFieldModels" :[],
        "requiredFields" : ['name','main_subcategory_id','category_id'],
        "createFunction" : apiRepository.createSubCategory,
        "requiredFieldsDummyData" : {'name': "DummySubCategory",'category_id' : 1},
        "success_code" : 712,
        "updateFunction": apiRepository.updateSubCategory,
        "convertToObjectIdFields": [],
        "noUpdateFields" : ['products'],
        "update_success_code" : 297


      };
    default:
      return null;
  }
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
    console.log(updatedData)
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

const updateModel= async (req, res, next) => {
  // console.log("Updated Model")
  // res.render("admin/profile");


  const model_name = req.params.model_name;
  const model_id = req.params.model_id;
  const ModelParameters = getModelParameters(model_name);
  // const model_id = req.params[`${Model.modelName.toLowerCase()}_id`];

  // console.log("model_name",model_name)
  // console.log("model_id",model_id)
  // console.log("Model", ModelParameters)
  // const model = await Model.getById(model_id);

  if (!ModelParameters["name"]) {
    res.status(404).send('Model not found');
  }

  const particularModel = await getModelById(ModelParameters["idName"] , model_id);
  // console.log("particular Model",particularModel)
  // console.log("ModelParameters['idName']",ModelParameters["idName"])
  
  if (!particularModel) {
    res.status(404).send(`${model_name} not found`);
  }

  const noUpdateFields = ModelParameters["noUpdateFields"]
  const requiredFields = ModelParameters["requiredFields"]

  if (req.method === 'POST') {
    const updatedData = req.body;
    console.log(updatedData)

    noUpdateFields.forEach((field) => {
      delete updatedData[field];
    });

    requiredFields.forEach((field) => {
      console.log("field",field)
      console.log("updatedData[field]",updatedData[field])
      if(  updatedData[field] == null || updatedData[field] == undefined || updatedData[field] == "")
      {
        delete updatedData[field];
      }
    });

    console.log("updatedData",updatedData)

    if(updatedData.selected_category)
    {
      const new_category_id = parseInt(updatedData.selected_category,10)
      updatedData.category_id = new_category_id

    }
    if(updatedData.selected_subcategory)
    {
      const new_main_subcategory_id = parseInt(updatedData.selected_subcategory,10)
      updatedData.main_subcategory_id = new_main_subcategory_id
      const subcategory = await SubCategory.getSubCategoryById(new_main_subcategory_id)
      updatedData.category_id = subcategory.category_id

      console.log("subcategory.category_id",subcategory.category_id) 
    }

    // Convert specific fields to ObjectId
    const objectIdFields = ModelParameters["convertToObjectIdFields"]
    objectIdFields.forEach((field) => {
      updatedData[field] = convertToObjectId(updatedData[field]);
    });


    const updateFunction = ModelParameters["updateFunction"]

    try {
    const updateResult = await updateFunction(updatedData);
    const error_msg = msg.responseMsg(updateResult.code);
    
    if (updateResult.code === ModelParameters["update_success_code"]) {
      res.redirect(`/admin/item-detail/${model_name}/${model_id}?success=true`);
    } else {
      res.redirect(`/admin/item-detail/${model_name}/${model_id}?success=false&msg=${error_msg}`);
    }
  } catch (error) {
    res.redirect(`/admin/item-detail/${model_name}/${model_id}?success=false&msg=${error_msg}`);

}
  } else {
    res.render("admin", { particularModel });
  }
};

// Example usage for Product model
// const updateProduct = updateModel(Product);

// const getUpdateModelParameters = (model_name) => {
//   switch (model_name) {
//     case 'product':
//       return {
//         "name": Product.Product,
//         "idName" : "product_id",
//         "requiredFields" : ['name','product_id','main_subcategory_id'],
//         "updateFunction": apiRepository.updateProduct,
//         "convertToObjectIdFields": ["user_id", "brand_id"],
//         "noUpdateFields" : [],
//         "update_success_code" : 297
//       };
//     case 'user':
//       return {
//         "name": User.User2,
//         "idName" : "user_id",
//         "requiredFields" : ['name','user_id','username','userUid','phone','email','user_type','dob','deviceToken','profileImage','primary_address_index','latitude','longitude','country','state','city','pincode','address'],
//         "updateFunction": apiRepository.updateProfile,
//         "convertToObjectIdFields": [],
//         "noUpdateFields" : [],
//         "update_success_code" : 208
//       };
//     case 'category':
//       return {
//         "name": Category.Category,
//         "idName" : "category_id",
//         "requiredFields" : ['name','image','category_id'],
//         "updateFunction": apiRepository.updateCategory,
//         "convertToObjectIdFields": [],
//         "noUpdateFields" : ['subCategories','products'],
//         "update_success_code" : 297
//       };
//     case 'subcategory':
//       return {
//         "name": SubCategory.SubCategory,
//         "idName" : "main_subcategory_id",
//         "requiredFields" : ['name','main_subcategory_id','category_id'],
//         "updateFunction": apiRepository.updateSubCategory,
//         "convertToObjectIdFields": [],
//         "noUpdateFields" : ['products'],
//         "update_success_code" : 297
//       };
//     default:
//       return null;
//   }
// };


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

const userMapView = async (req, res, next) => {
  try {
    const users = await User.User2.find({}, 'name latitude longitude');
    const locations = users.map(user => ({
      lat: parseFloat(user.latitude),
      lon: parseFloat(user.longitude),
      name: user.name
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
  userMapView,
  dynamicDetailView,
  updateModel,
  addView,
  deleteView,
  showDeleteConfirmationPage
};
