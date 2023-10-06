const { validationResult, check } = require("express-validator");
const Msg = require("./Msg");
const ApiService = require("./Service/ApiService");
const User = require("../models/User");
const crypto = require("crypto");

// Login
const login = async (req) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();

  const validationRules = [
    check("email").isEmail().withMessage("Invalid email format"),
    check("password").notEmpty().withMessage("Password is required"),
  ];

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errorMsg.responseMsg(403);
    return { status: "0", message: errors.array()[0].msg };
  }

  const Check = await apiService.login(data);
  const msg = errorMsg.responseMsg(Check.error_code);

  if (Check.error_code === 200) {
    return { status: "1", message: msg, data: Check.data };
  } else {
    return { status: "0", message: msg };
  }
};

// Change Password
const changePassword = async (req) => {
  const data = req.body;
  const errorMsg = new Msg();
  const apiService = new ApiService();

  const validationRules = [
    check("country_code").notEmpty().withMessage("Country code is required"),
    check("password").notEmpty().withMessage("Password is required"),
    check("phone").notEmpty().withMessage("Phone is required"),
  ];

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errorMsg.responseMsg(403);
    return { status: "0", message: errors.array()[0].msg };
  }

  const Check = await apiService.changePassword(data);
  const msg = errorMsg.responseMsg(Check.error_code);

  if (Check.error_code === 204) {
    return { status: "1", message: msg };
  } else {
    return { status: "0", message: msg };
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
    const newUser = new User.User2(req.body);
    await newUser.save();
    res.json({
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

    res.json({ status: 0, message: errorMessage });
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

function hashPassword(password) {
  console.log(password);
  // Assuming hashPassword function is implemented elsewhere
  // Use a secure hashing algorithm (e.g., bcrypt) in a real application
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = {
  login,
  changePassword,
  logout,
  register,
  save_token,
  delete_account,
  registerUser,
};
