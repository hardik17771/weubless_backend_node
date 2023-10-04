const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Customer = require("../models/Customer");
const BusinessSetting = require("../models/BusinessSetting");

const sendVerificationCode = (user, method) => {
  // You'll implement the logic to send verification code based on method (email or phone)
};

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: "1h" });
};

const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(201).json({
        result: false,
        message: "User already exists.",
        user_id: 0,
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = new User({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      verification_code: verificationCode,
    });

    if (
      (await BusinessSetting.findOne({ type: "email_verification" }).value) !==
      1
    ) {
      user.email_verified_at = new Date();
    } else {
      sendVerificationCode(user, "email");
    }

    if (
      (await BusinessSetting.findOne({ type: "phone_verification" }).value) !==
      1
    ) {
      user.is_verified = true;
    }

    await user.save();

    const customer = new Customer({ user_id: user.id });
    await customer.save();

    const token = generateAccessToken(user);

    return res.json({
      result: true,
      message: "User registered successfully.",
      access_token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const resendCode = async (req, res) => {
  try {
    const { user_id, verify_by } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "User not found." });
    }

    user.verification_code = Math.floor(100000 + Math.random() * 900000);

    if (verify_by === "email") {
      sendVerificationCode(user, "email");
    } else {
      sendVerificationCode(user, "phone");
    }

    await user.save();

    return res.json({
      result: true,
      message: "Verification code sent again.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const confirmCode = async (req, res) => {
  try {
    const { user_id, verification_code } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ result: false, message: "User not found." });
    }

    if (user.verification_code !== verification_code) {
      return res.json({ result: false, message: "Code does not match." });
    }

    user.email_verified_at = new Date();
    user.verification_code = null;

    await user.save();

    return res.json({
      result: true,
      message: "Your account is now verified. Please login.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, user_type } = req.body;

    const deliveryBoyCondition = user_type === "delivery_boy";
    const user = deliveryBoyCondition
      ? await User.findOne({
          user_type: "delivery_boy",
          $or: [{ email }, { phone: email }],
        })
      : await User.findOne({
          user_type: { $in: ["customer", "seller"] },
          $or: [{ email }, { phone: email }],
        });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ result: false, message: "Unauthorized." });
    }

    const token = generateAccessToken(user);

    return res.json({
      result: true,
      message: "Successfully logged in.",
      access_token: token,
      user: {
        id: user.id,
        type: user.user_type,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        avatar_original: user.avatar_original,
        phone: user.phone,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const user = (req, res) => {
  return res.json(req.user);
};

const logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  return res.json({ result: true, message: "Successfully logged out." });
};

const socialLogin = async (req, res) => {
  try {
    const { name, email, provider } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        provider_id: provider,
        email_verified_at: new Date(),
      });
      await user.save();

      const customer = new Customer({ user_id: user.id });
      await customer.save();
    }

    const token = generateAccessToken(user);

    return res.json({
      result: true,
      message: "Successfully logged in.",
      access_token: token,
      user: {
        id: user.id,
        type: user.user_type,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        avatar_original: user.avatar_original,
        phone: user.phone,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const verify_phone = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.json({ result: false, message: "User not found." });
    }

    let token_id;
    try {
      token_id = jwt.verify(access_token, "your_secret_key").jti;
    } catch (error) {
      return res.json({ result: false, message: "User not found." });
    }

    const oauth_access_token_data = await DB("oauth_access_tokens")
      .where("id", token_id)
      .first();

    if (!oauth_access_token_data) {
      return res.json({ result: false, message: "User not found." });
    }

    const user = await User.findById(oauth_access_token_data.user_id);

    if (!user) {
      return res.json({ result: false, message: "User not found." });
    }

    user.is_verified = true;
    await user.save();

    const token = generateAccessToken(user);

    return res.json({
      result: true,
      message: "Phone verified.",
      access_token: token,
      user: {
        id: user.id,
        type: user.user_type,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        avatar_original: user.avatar_original,
        phone: user.phone,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  signup,
  resendCode,
  confirmCode,
  login,
  user,
  logout,
  socialLogin,
  verify_phone,
};
