const Msg = require("./Msg");
const ApiService = require("./Service/ApiService");
const Validator = require("validator");

// Login
const login = async (req) => {
  const data = req.body;
  const error_msg = new Msg();
  const ApiService = new ApiService();

  const rules = { email: "required", password: "required" };
  const validation = Validator.validate(data, rules);

  if (validation !== true) {
    const msg = error_msg.responseMsg(403);
    return { status: "0", message: validation[0] };
  }

  const Check = await ApiService.login(data);
  const msg = error_msg.responseMsg(Check.error_code);

  if (Check.error_code === 200) {
    return { status: "1", message: msg, data: Check.data };
  } else {
    return { status: "0", message: msg };
  }
};

// Change Password
const changePassword = async (req) => {
  const data = req.body;
  const error_msg = new Msg();
  const ApiService = new ApiService();
  const ApiRepository = new ApiRepository();

  const rules = {
    country_code: "required",
    password: "required",
    phone: "required",
  };
  const validation = Validator.validate(data, rules);

  if (validation !== true) {
    const msg = error_msg.responseMsg(403);
    return { status: "0", message: validation[0] };
  }

  const Check = await ApiService.changePassword(data);
  const msg = error_msg.responseMsg(Check.error_code);

  if (Check.error_code === 204) {
    return { status: "1", message: msg };
  } else {
    return { status: "0", message: msg };
  }
};

// Logout
const logout = async (req) => {
  const error_msg = new Msg();
  const msg = error_msg.responseMsg(216);
  return { status: "1", message: msg };
};

// Register User
const register = async (req) => {
  const data = req.body;
  const error_msg = new Msg();
  const ApiService = new ApiService();

  const rules = {
    username: "required",
    name: "required|max:255",
    country_code: "required|max:3",
    phone: "required|max:255|unique:users",
    email: "required|email|max:255|unique:users",
    password: "required",
    user_type: "required",
    latitude: "required",
    longitude: "required",
  };

  const validation = Validator.validate(data, rules);

  if (validation !== true) {
    const msg = error_msg.responseMsg(403);
    return { status: "0", message: validation[0] };
  }

  const Check = await ApiService.register(data);
  const msg = error_msg.responseMsg(Check.error_code);

  if (Check.error_code === 636) {
    return { status: "1", message: msg };
  } else {
    return { status: "0", message: msg };
  }
};

// Save Token
const save_token = async (req) => {
  const data = req.body;
  const error_msg = new Msg();
  const ApiService = new ApiService();
  const token = req.headers.authorization;

  if (token) {
    const userId = await Authorization(token);
    const Check = await ApiService.save_token(data, userId);
    const msg = error_msg.responseMsg(Check.error_code);

    if (Check.error_code === 661) {
      return { status: "1", message: msg };
    } else {
      return { status: "0", message: msg };
    }
  } else {
    return { status: "0", message: "unauthenticate" };
  }
};

// Delete Account
const delete_account = async (req) => {
  const data = req.body;
  const error_msg = new Msg();
  const ApiService = new ApiService();
  const token = req.headers.authorization;

  if (token) {
    const userId = await Authorization(token);
    const Check = await ApiService.delete_account(data, userId);
    const msg = error_msg.responseMsg(Check.error_code);

    if (Check.error_code === 661) {
      return { status: "1", message: msg };
    } else {
      return { status: "0", message: msg };
    }
  } else {
    return { status: "0", message: "unauthenticate" };
  }
};

module.exports = {
  login,
  changePassword,
  logout,
  register,
  save_token,
  delete_account,
};
