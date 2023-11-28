const { validationResult, check } = require("express-validator");
const Msg = require("./Msg");
const ApiService = require("./Service/ApiService");
const ApiRepository = require("./Repository/ApiRepository");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const ContactUs = require("../models/ContactUs"); // Assuming you have a model defined
const Advertisement = require("../models/Advertisement"); // Assuming you have a model defined

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "acehunter500@gmail.com",
    pass: "mpajszqgvctxhonn",
  },
});

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
  if (Check.error_code === 208) {
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
      userUid: data.userUid,
      username: data.username,
      name: data.name,
      country_code: data.country_code,
      phone: data.phone,
      email: data.email,
      password: await hashPassword(data.password),
      user_type: data.user_type,
      latitude: data.latitude,
      longitude: data.longitude,
      liveAddress: data.liveAddress,
      livePincode: data.livePincode,
      liveCity: data.liveCity,
      input_latitude: data.input_latitude,
      input_longitude: data.input_longitude,
      input_liveAddress: data.input_liveAddress,
      input_livePincode: data.input_livePincode,
      input_liveCity: data.input_liveCity,
      input_deviceToken: data.deviceToken,
      profileImage: data.profileImage,
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

const updateCategory = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
    const Check = await apiRepository.updateCategory(data);
    const msg = error_msg.responseMsg(Check.code);
    console.log(Check.code);
    if (Check.code === 297) {
      console.log("status 1");
      const response = {
        status: "1",
        message: msg,
        updatedCategory: Check.updatedCategory,
      };
      res.status(201).json(response);
    } else {
      console.log("status 0");
      const response = { status: "0", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(737);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const categoryListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const data = await apiRepository.categoryListing();
  const error_msg = new Msg();
  try {
    if (data.code == 674) {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg, list: data.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};
/*********************************************** SUB CATEGORY ***********************************/

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

const subCategoryListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const data = await apiRepository.subCategoryListing();
  const error_msg = new Msg();
  try {
    if (data.code == 690) {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg, list: data.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const updateSubCategory = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
    const Check = await apiRepository.updateSubCategory(data);
    const msg = error_msg.responseMsg(Check.code);
    console.log(Check.code);
    if (Check.code === 297) {
      console.log("status 1");
      const response = {
        status: "1",
        message: msg,
        updatedSubCategory: Check.updatedSubCategory,
      };
      res.status(201).json(response);
    } else {
      console.log("status 0");
      const response = { status: "0", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(737);
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
  // console.log(Check);
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

// const createSubSubCategory = async (req, res) => {
//   const { name, main_subcategory_id } = req.body;
//   const apiRepository = new ApiRepository();
//   const error_msg = new Msg();

//   console.log("Create sub sub category api controller hit");
//   try {
//     const newSubSubCategory = await apiRepository.createSubSubCategory({
//       name,
//       main_subcategory_id,
//     });

//     const msg = error_msg.responseMsg(newSubSubCategory.code); //706
//     if (newSubSubCategory.code === 712) {
//       const response = {
//         status: "1",
//         message: msg,
//         data: newSubSubCategory.data,
//       };
//       res.status(201).json(response);
//     } else {
//       const response = {
//         status: "0",
//         message: msg,
//         data: newSubSubCategory.data,
//       };
//       res.status(201).json(response);
//     }
//   } catch (error) {
//     const msg = error_msg.responseMsg(707); //707
//     const response = { status: "0", message: msg };
//     res.status(400).json(response);
//   }
// };

// const SubCategory = async (req, res) => {
//   const data = req.body;
//   const error_msg = new Msg();
//   const apiService = new ApiService();

//   const Check = await apiService.SubCategory(data);
//   // console.log("controller data", Check);
//   const msg = error_msg.responseMsg(Check.code);

//   if (Check.code == 689) {
//     // console.log("code: ", Check.code);
//     const response = { status: "1", message: msg, data: Check.list };
//     return res.status(200).json(response);
//   } else {
//     const response = { status: "0", message: msg };
//     return res.status(200).json(response);
//   }
//   // }
//   // } catch (error) {
//   //   console.error(error);
//   //   const msg = error_msg.responseMsg(642);
//   //   const response = { status: "0", message: msg };
//   //   return res.status(500).json(response);
//   // }
// };

/*********************************************** PRODUCTS ***********************************/

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

const productListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const data = await apiRepository.productListing();
  const error_msg = new Msg();
  try {
    if (data.code == 732) {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg, list: data.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const updateProduct = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
    const product = await apiRepository.updateProduct(data);
    const msg = error_msg.responseMsg(product.code);
    console.log(product.code);
    if (product.code === 297) {
      console.log("status 1");
      const response = {
        status: "1",
        message: msg,
        data: product.updatedProduct,
      };
      res.status(201).json(response);
    } else {
      console.log("status 0");
      const response = {
        status: "0",
        message: msg,
        data: product.updatedProduct,
      };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(736);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
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

/*********************************************** FETCHING PRODUCTS BY IDs ***********************************/

const productsFromMainSubCategoryId = async (req, res) => {
  const data = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.productsFromMainSubCategoryId(data);
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

const productsFromCategoryId = async (req, res) => {
  const data = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.productsFromCategoryId(data);
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

/*********************************************** SHOPS ***********************************/

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

const shopListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const data = await apiRepository.shopListing();
  const error_msg = new Msg();
  try {
    if (data.code == 733) {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg, list: data.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const updateShop = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
    const Check = await apiRepository.updateShop(data);
    const msg = error_msg.responseMsg(Check.code);
    console.log(Check.code);
    if (Check.code === 297) {
      console.log("status 1");
      const response = {
        status: "1",
        message: msg,
        updatedShop: Check.updatedShop,
      };
      res.status(201).json(response);
    } else {
      console.log("status 0");
      const response = { status: "0", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(737);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const shopDetails = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
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
  } catch (error) {
    const msg = error_msg.responseMsg(717);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

/*********************************************** LOCATION FEATURES ***********************************/

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

/*********************************************** BUY PRODUCT ***********************************/

const buyProduct = async (req, res) => {
  // try {
  const { user_id, product_id } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();

  const Check = await apiService.buyProduct({
    user_id,
    product_id,
  });

  const msg = error_msg.responseMsg(Check.code);
  console.log("controller msg", msg);
  if (Check.code === 900) {
    // console.log(Check.productsList);
    const response = { status: "1", message: msg };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg };
    res.status(201).json(response);
  }
  // } catch (error) {}
};

const trendingProducts = async (req, res) => {
  const error_msg = new Msg();
  const apiService = new ApiService();
  const Check = await apiService.trendingProducts();
  try {
    if (Check.code === 732) {
      // console.log(Check.productsList);
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "1", message: msg, list: Check.productsList };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "0", message: msg, list: Check.productsList };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const trendingProductsByCategory = async (req, res) => {
  const { category_id } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();
  const Check = await apiService.trendingProductsByCategory({ category_id });
  try {
    if (Check.code === 732) {
      // console.log(Check.productsList);
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "1", message: msg, list: Check.productsList };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "0", message: msg, list: Check.productsList };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const trendingProductsByLocation = async (req, res) => {
  const { latitude, longitude, distance } = req.body;
  const error_msg = new Msg();
  const apiService = new ApiService();
  const Check = await apiService.trendingProductsByLocation({
    latitude,
    longitude,
    distance,
  });
  try {
    if (Check.code === 732) {
      // console.log(Check.productsList);
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "1", message: msg, list: Check.productsList };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "0", message: msg, list: Check.productsList };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

/*********************************************** CART ***********************************/

const addToCart = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  // console.log("Create product api controller hit");
  // try {
  const Check = await apiRepository.addToCart(data);

  const msg = error_msg.responseMsg(Check.code); //706
  if (Check.code === 669) {
    const response = {
      status: "1",
      message: msg,
      data: Check.data,
      amount: Check.amount,
      list: Check.productsList,
    };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg, data: Check.data };
    res.status(201).json(response);
  }
  // } catch (error) {
  //   const msg = error_msg.responseMsg(717); //707
  //   const response = { status: "0", message: msg };
  //   res.status(400).json(response);
  // }
};

const cartListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const data = await apiRepository.cartListing();
  const error_msg = new Msg();
  try {
    if (data.code == 742) {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg, list: data.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const cartDetails = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  try {
    const cart = await apiRepository.cartDetails(data);

    const msg = error_msg.responseMsg(cart.code);
    console.log(cart.code);
    if (cart.code === 671) {
      // console.log("status 1");
      const response = { status: "1", message: msg, data: cart.data };
      res.status(201).json(response);
    } else {
      // console.log("status 0");
      const response = { status: "0", message: msg, data: cart.data };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(1100);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const checkout = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  // console.log("Create product api controller hit");
  // try {
  const Check = await apiRepository.checkout(data);

  const msg = error_msg.responseMsg(Check.code); //706
  if (Check.code === 683) {
    const response = { status: "1", message: msg, data: Check.data };
    res.status(201).json(response);
  } else {
    const response = { status: "0", message: msg, data: Check.data };
    res.status(201).json(response);
  }
  // } catch (error) {
  //   const msg = error_msg.responseMsg(717); //707
  //   const response = { status: "0", message: msg };
  //   res.status(400).json(response);
  // }
};

const contactUs = async (req, res) => {
  data = req.body;
  const contact = new ContactUs.ContactUs({
    name: data.name,
    email: data.email,
    message: data.message,
  });

  const mailOptions = {
    from: data.email,
    to: "21BMA003@nith.ac.com",
    subject: "Inquiry Recorded",
    html: `
      <p>Name: ${data.name}</p>
      <p>Email: ${data.email}</p>
      <p>Message: ${data.message}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      const response = { status: "0", message: "Error in sending mail" };
      res.status(400).json(response);
    }
    console.log(info);
    console.log("Email sent:", info.response);
    const response = {
      status: "1",
      message: "Email sent successfully",
      data: info.response,
    };
    res.status(201).json(response);
  });

  try {
    await contact.save(); // Using await to wait for the save operation to complete
    console.log("User saved successfully:", contact);
    return contact;
  } catch (error) {
    console.error(error);
    throw new Error("Error saving contact");
  }
};

const createAdvertisement = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const error_msg = new Msg();

  console.log("Create product api controller hit");
  try {
    const newAdvertisement = await apiRepository.createAdvertisement(data);

    const msg = error_msg.responseMsg(newAdvertisement.code);
    if (newAdvertisement.code === 743) {
      const response = {
        status: "1",
        message: msg,
        data: newAdvertisement.data,
      };
      res.status(201).json(response);
    } else {
      const response = {
        status: "0",
        message: msg,
        data: newAdvertisement.data,
      };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(1100);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const advertisementListing = async (req, res) => {
  const apiRepository = new ApiRepository();
  const data = await apiRepository.advertisementListing();
  const error_msg = new Msg();
  try {
    if (data.code == 678) {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "1", message: msg, list: data.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(data.code);
      const response = { status: "0", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const advertisementListingByCategory = async (req, res) => {
  const data = req.body;
  const apiRepository = new ApiRepository();
  const Check = await apiRepository.advertisementListingByCategory(data);
  const error_msg = new Msg();
  try {
    if (Check.code == 678) {
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "1", message: msg, list: Check.list };
      res.status(201).json(response);
    } else {
      const msg = error_msg.responseMsg(Check.code);
      const response = { status: "0", message: msg };
      res.status(201).json(response);
    }
  } catch (error) {
    const msg = error_msg.responseMsg(425);
    const response = { status: "0", message: msg };
    res.status(400).json(response);
  }
};

const advertisementShow = async (data) => {
  try {
    let getDetails;

    if (data) {
      getDetails = await Advertisement.find({ category_id: data });
    } else {
      // Handle case when data is not set (if needed)
      getDetails = [];
    }

    const array2 = getDetails.map((list) => {
      return {
        advertisement_id: list.id,
        category_id: list.category_id || "",
        name: list.name || "",
        date_range: list.date_range || "",
        amount: list.amount || "",
      };
    });

    return array2;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  createCategory,
  updateCategory,
  categoryListing,
  createSubCategory,
  subCategoryListing,
  updateSubCategory,
  mainSubCategory,
  // createSubSubCategory,
  // SubCategory,
  createProduct,
  productListing,
  updateProduct,
  productDetails,
  createShop,
  shopListing,
  updateShop,
  shopDetails,
  productsFromMainSubCategoryId,
  productsFromCategoryId,
  main_subcategoryproductLocation,
  main_subcategoryproductDistance,
  main_subcategoryproductLatLong,
  main_subcategoryproductUserDistance,
  buyProduct,
  trendingProducts,
  trendingProductsByCategory,
  trendingProductsByLocation,
  addToCart,
  cartListing,
  cartDetails,
  checkout,
  contactUs,
  createAdvertisement,
  advertisementListing,
  advertisementListingByCategory,
  advertisementShow,
};
