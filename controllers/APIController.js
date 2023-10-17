const { validationResult, check } = require("express-validator");
const Msg = require("./Msg");
const ApiService = require("./Service/ApiService");
const ApiRepository = require("./Repository/ApiRepository");
const User = require("../models/User");
const bcrypt = require("bcrypt");

/*********************************************** AUTH  ***********************************/

// Login
const login = async (req, res) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.login(data);
  const msg = errorMsg.responseMsg(Check.error_code);
  console.log(Check);
  if (Check.error_code === 200) {
    console.log("Check.data", Check.data);
    res.status(200).json({ status: "1", message: msg, data: Check.data });
  } else {
    res.status(401).json({ status: "0", message: msg });
  }
};

// FetchUser
const fetchUser = async (req, res) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.fetchUser(data);
  const msg = errorMsg.responseMsg(Check.error_code);
  console.log(Check);
  if (Check.error_code === 200) {
    console.log("Check.data", Check.data);
    res.status(200).json({ status: "1", message: msg, data: Check.data });
  } else {
    res.status(401).json({ status: "0", message: msg });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.updateProfile(data);
  const msg = errorMsg.responseMsg(Check.error_code);
  console.log(Check);
  if (Check.error_code === 200) {
    console.log("Check.data", Check.data);
    res.status(200).json({ status: "1", message: msg, data: Check.data });
  } else {
    res.status(401).json({ status: "0", message: msg });
  }
};

// Change Password
const changePassword = async (req, res) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.changePassword(data);
  const msg = errorMsg.responseMsg(Check.error_code);

  if (Check.error_code === 204) {
    res.status(200).json({ status: "1", message: msg });
  } else {
    res.status(200).json({ status: "0", message: msg });
  }
};

// Logout
const logout = async (req) => {
  const errorMsg = new Msg();
  const msg = errorMsg.responseMsg(216);
  return { status: "1", message: msg };
};

// Register User
const register = async (req) => {
  try {
    const data = req.body;
    console.log("API Controller data");
    console.log(data);
    const errorMsg = new Msg();
    const apiService = new ApiService();

    const errors = validationResult(req);
    console.log("errors isEmpty: ", errors.isEmpty());
    if (!errors.isEmpty()) {
      const msg = errorMsg.responseMsg(403);
      return { status: "0", message: errors.array()[0].msg };
    }

    // const validationRules = [];

    console.log("Before Check");
    const Check = await apiService.register(data);
    console.log("Check error code message: ", Check);
    console.log("After Check Before msg");
    const msg = errorMsg.responseMsg(Check.error_code);
    console.log("message is : ", msg);
    console.log("After msg");

    if (Check.error_code === 636) {
      return { status: "1", message: msg };
    } else {
      return { status: "0", message: msg };
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle or rethrow the error as needed
  }
};

// Alternate Register

const registerUser = async (req, res) => {
  const data = req.body;
  console.log("API Controller data");
  console.log(data);

  try {
    const newUser = new User.User2({
      username: data.username,
      name: data.name,
      country_code: data.country_code,
      phone: data.phone,
      email: data.email,
      password: await hashPassword(data.password),
      user_type: data.user_type,
      latitude: data.latitude,
      longitude: data.longitude,
    });
    await newUser.save();
    res.status(200).json({
      status: 1,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    let errorMessage = "Registration failed";
    if (error.code === 11000) {
      if (error.keyPattern.username === 1) {
        errorMessage = "Username already in use";
      } else if (error.keyPattern.phone === 1) {
        errorMessage = "Phone number already in use";
      } else if (error.keyPattern.email === 1) {
        errorMessage = "Email already in use";
      }
    } else if (error.name === "ValidationError") {
      // Validation error
      const field = Object.keys(error.errors)[0];
      errorMessage = error.errors[field].message;
    }

    res.status(401).json({ status: 0, message: errorMessage });
  }
};

// Save Token
const save_token = async (req) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();
  const token = req.headers.authorization;

  if (!token) {
    return { status: "0", message: "unauthenticate" };
  }

  const userId = await Authorization(token);
  if (!userId) {
    return { status: "0", message: "unauthenticated" };
  }

  const validationRules = [
    check("token_data").notEmpty().withMessage("Token data is required"),
    // Add more validation rules as needed
  ];

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errorMsg.responseMsg(403);
    return { status: "0", message: errors.array()[0].msg };
  }

  const Check = await apiService.save_token(data, userId);
  const msg = errorMsg.responseMsg(Check.error_code);

  if (Check.error_code === 661) {
    return { status: "1", message: msg };
  } else {
    return { status: "0", message: msg };
  }
};

// Delete Account
const delete_account = async (req) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();
  const token = req.headers.authorization;

  if (!token) {
    return { status: "0", message: "unauthenticate" };
  }

  const userId = await Authorization(token);
  if (!userId) {
    return { status: "0", message: "unauthenticated" };
  }

  const validationRules = [
    check("account_id").notEmpty().withMessage("Account ID is required"),
    // Add more validation rules as needed
  ];

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errorMsg.responseMsg(403);
    return { status: "0", message: errors.array()[0].msg };
  }

  const Check = await apiService.delete_account(data, userId);
  const msg = errorMsg.responseMsg(Check.error_code);

  if (Check.error_code === 661) {
    return { status: "1", message: msg };
  } else {
    return { status: "0", message: msg };
  }
};

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

/*********************************************** CATEGORY ***********************************/

const categoryListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const categoryListing = await apiRepository.categoryListing();
  const error_msg = new Msg();

  if (categoryListing) {
    const msg = error_msg.responseMsg(674);
    const response = { status: "1", message: msg, data: categoryListing };
    res.status(200).json(response);
  } else {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const createCategory = async (req, res) => {
  const { name, banner, icon, image, featured, top } = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  console.log("Create category api controller hit");
  try {
    const newCategory = await apiRepository.createCategory({
      name,
      banner,
      icon,
      image,
      featured,
      top,
    });

    const msg = error_msg.responseMsg(newCategory.code); //706
    if (newCategory.code === 706) {
      const response = { status: "1", message: msg, data: newCategory.data };
      res.status(201).json(response);
    } else {
      const response = { status: "0", message: msg, data: newCategory.data };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(newCategory.code); //707
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const createSubCategory = async (req, res) => {
  const { name, category_id } = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  console.log("Create category api controller hit");
  try {
    const newSubCategory = await apiRepository.createSubCategory({
      name,
      category_id,
    });

    const msg = error_msg.responseMsg(newSubCategory.code); //706
    if (newSubCategory.code === 712) {
      const response = { status: "1", message: msg, data: newSubCategory.data };
      res.status(201).json(response);
    } else {
      const response = { status: "0", message: msg, data: newSubCategory.data };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(707); //707
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const mainSubCategory = async (req, res) => {
  const data = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.mainSubCategory(data);
  // console.log("controller data", Check);
  const msg = error_msg.responseMsg(Check.code);

  if (Check.code == 689) {
    // console.log("code: ", Check.code);
    const response = { status: "1", message: msg, data: Check.list };
    return res.status(200).json(response);
  } else {
    const response = { status: "0", message: msg };
    return res.status(200).json(response);
  }
  // }
  // } catch (error) {
  //   console.error(error);
  //   const msg = error_msg.responseMsg(642);
  //   const response = { status: "0", message: msg };
  //   return res.status(500).json(response);
  // }
};

const createSubSubCategory = async (req, res) => {
  const { name, main_subcategory_id } = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  console.log("Create sub sub category api controller hit");
  try {
    const newSubSubCategory = await apiRepository.createSubSubCategory({
      name,
      main_subcategory_id,
    });

    const msg = error_msg.responseMsg(newSubSubCategory.code); //706
    if (newSubSubCategory.code === 712) {
      const response = {
        status: "1",
        message: msg,
        data: newSubSubCategory.data,
      };
      res.status(201).json(response);
    } else {
      const response = {
        status: "0",
        message: msg,
        data: newSubSubCategory.data,
      };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(707); //707
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const SubCategory = async (req, res) => {
  const data = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.SubCategory(data);
  // console.log("controller data", Check);
  const msg = error_msg.responseMsg(Check.code);

  if (Check.code == 689) {
    // console.log("code: ", Check.code);
    const response = { status: "1", message: msg, data: Check.list };
    return res.status(200).json(response);
  } else {
    const response = { status: "0", message: msg };
    return res.status(200).json(response);
  }
  // }
  // } catch (error) {
  //   console.error(error);
  //   const msg = error_msg.responseMsg(642);
  //   const response = { status: "0", message: msg };
  //   return res.status(500).json(response);
  // }
};

const createProduct = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  // console.log("Create product api controller hit");
  // try {
  const newProduct = await apiRepository.createProduct(data);

  const msg = error_msg.responseMsg(newProduct.code); //706
  if (newProduct.code === 716) {
    const response = { status: "1", message: msg, data: newProduct.data };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg, data: newProduct.data };
    res.status(201).json(response);
  }
  // } catch (error) {
  //   const msg = error_msg.responseMsg(717); //707
  //   const response = { status: "0", message: msg };
  //   res.status(400).json(response);
  // }
};

const productDetails = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
    const product = await apiRepository.productDetails(data);

    const msg = error_msg.responseMsg(product.code);
    console.log(product.code);
    if (product.code === 664) {
      console.log("status 1");
      const response = { status: "1", message: msg, data: product.data };
      res.status(201).json(response);
    } else {
      console.log("status 0");
      const response = { status: "0", message: msg, data: product.data };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(717);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const productsFromSubCategoryId = async (req, res) => {
  const data = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.productsFromSubCategoryId(data);
  // console.log("controller data", Check);
  const msg = error_msg.responseMsg(Check.code);

  if (Check.code == 684) {
    // console.log("code: ", Check.code);
    const response = { status: "1", message: msg, data: Check.list };
    return res.status(200).json(response);
  } else {
    const response = { status: "0", message: msg };
    return res.status(200).json(response);
  }
  // }
  // } catch (error) {
  //   console.error(error);
  //   const msg = error_msg.responseMsg(642);
  //   const response = { status: "0", message: msg };
  //   return res.status(500).json(response);
  // }
};

const createShop = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  console.log("Create product api controller hit");
  try {
    const newShop = await apiRepository.createShop(data);

    const msg = error_msg.responseMsg(newShop.code); //706
    if (newShop.code === 720) {
      const response = { status: "1", message: msg, data: newShop.data };
      res.status(201).json(response);
    } else {
      const response = { status: "0", message: msg, data: newShop.data };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(721); //707
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const shopDetails = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  // try {
  const shop = await apiRepository.shopDetails(data);

  const msg = error_msg.responseMsg(shop.code);
  console.log(shop.code);
  if (shop.code === 667) {
    // console.log("status 1");
    const response = { status: "1", message: msg, data: shop.data };
    res.status(201).json(response);
  } else {
    // console.log("status 0");
    const response = { status: "0", message: msg, data: shop.data };
    res.status(201).json(response);
  }
  // } catch (error) {
  //   const msg = error_msg.responseMsg(717);
  //   const response = { status: "0", message: msg };
  //   res.status(400).json(response);
  // }
};

const main_subcategoryproductLocation = async (req, res) => {
  // try {
  const { user_id, shop_id, main_subcategory_id } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.main_subcategoryproductLocation({
    user_id,
    shop_id,
    main_subcategory_id,
  });

  const msg = error_msg.responseMsg(Check.code);
  console.log("controller msg", msg);
  if (Check.code === 900) {
    console.log(Check.productsList);
    const response = { status: "1", message: msg, data: Check.productsList };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg };
    res.status(201).json(response);
  }
  // } catch (error) {}
};

const main_subcategoryproductDistance = async (req, res) => {
  // try {
  const { latitude, longitude, distance, main_subcategory_id } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.main_subcategoryproductDistance({
    latitude,
    longitude,
    distance,
    main_subcategory_id,
  });

  const msg = error_msg.responseMsg(Check.code);
  console.log("controller msg", msg);
  if (Check.code === 900) {
    console.log(Check.productsList);
    const response = { status: "1", message: msg, data: Check.productsList };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg };
    res.status(201).json(response);
  }
  // } catch (error) {}
};

const main_subcategoryproductLatLong = async (req, res) => {
  // try {
  const { lat1, long1, lat2, long2, main_subcategory_id } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.main_subcategoryproductLatLong({
    lat1,
    long1,
    lat2,
    long2,
    main_subcategory_id,
  });

  const msg = error_msg.responseMsg(Check.code);
  console.log("controller msg", msg);
  if (Check.code === 900) {
    console.log(Check.productsList);
    const response = { status: "1", message: msg, data: Check.productsList };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg };
    res.status(201).json(response);
  }
  // } catch (error) {}
};

const main_subcategoryproductUserDistance = async (req, res) => {
  // try {
  const { user_id, distance, main_subcategory_id } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.main_subcategoryproductUserDistance({
    distance,
    user_id,
    main_subcategory_id,
  });

  const msg = error_msg.responseMsg(Check.code);
  console.log("controller msg", msg);
  if (Check.code === 900) {
    console.log(Check.productsList);
    const response = { status: "1", message: msg, data: Check.productsList };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg };
    res.status(201).json(response);
  }
  // } catch (error) {}
};

module.exports = {
  login,
  changePassword,
  logout,
  register,
  save_token,
  delete_account,
  registerUser,
  fetchUser,
  updateProfile,
  categoryListing,
  createCategory,
  createSubCategory,
  mainSubCategory,
  createSubSubCategory,
  SubCategory,
  createProduct,
  productDetails,
  createShop,
  shopDetails,
  productsFromSubCategoryId,
  main_subcategoryproductLocation,
  main_subcategoryproductDistance,
  main_subcategoryproductLatLong,
  main_subcategoryproductUserDistance,
};
