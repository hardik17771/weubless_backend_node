const User = require("../../../models/User");
// const PasswordReset = require("../../../models/PasswordReset");
// const OTPVerificationController = require("./OTPVerificationController");
const bcrypt = require("bcrypt");

const forgetRequest = async (req, res) => {
  try {
    let user;
    if (req.body.verify_by === "email") {
      user = await User.findOne({ email: req.body.email_or_phone });
    } else {
      user = await User.findOne({ phone: req.body.email_or_phone });
    }

    if (!user) {
      return res.json({
        result: false,
        message: "User is not found",
        user_id: 0,
      });
    }

    user.verification_code = Math.floor(100000 + Math.random() * 900000);
    await user.save();

    if (req.body.verify_by === "phone") {
      return res.json({
        result: true,
        message: "User found, send OTP via firebase",
        user_id: user._id,
      });
    } else {
      // Assuming you have a function to send email notifications
      // You can implement it using a library like Nodemailer
      // Example: sendEmail(user.email, 'Password Reset Code', `Your code is ${user.verification_code}`);
      return res.json({
        result: true,
        message: "A code is sent",
        user_id: user._id,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const confirmReset = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    if (user) {
      let flag = false;
      if (
        req.body.verify_by === "email" &&
        req.body.otp == user.verification_code
      ) {
        flag = true;
      }

      if (flag) {
        user.verification_code = null;
        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save();
        return res.json({
          result: true,
          message: "Your password is reset. Please login",
        });
      } else {
        return res.json({
          result: false,
          message: "OTP is wrong!",
        });
      }
    } else {
      return res.json({
        result: false,
        message: "No user is found",
      });
    }
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
    let user;
    if (req.body.verify_by === "email") {
      user = await User.findOne({ email: req.body.email_or_phone });
    } else {
      user = await User.findOne({ phone: req.body.email_or_phone });
    }

    if (!user) {
      return res.json({
        result: false,
        message: "User is not found",
      });
    }

    user.verification_code = Math.floor(100000 + Math.random() * 900000);
    await user.save();

    if (req.body.verify_by === "email") {
      // Assuming you have a function to send email notifications
      // You can implement it using a library like Nodemailer
      // Example: sendEmail(user.email, 'Password Reset Code', `Your code is ${user.verification_code}`);
      return res.json({
        result: true,
        message: "A code is sent again",
        user_id: user._id,
      });
    } else {
      return res.json({
        result: true,
        message: "User found, send OTP via firebase",
        user_id: user._id,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

const passwordChange = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    if (user) {
      const isMatch = await bcrypt.compare(
        req.body.old_password,
        user.password
      );
      if (isMatch) {
        user.password = await bcrypt.hash(req.body.new_password, 10);
        await user.save();
        return res.json({
          result: true,
          message: "Your password changed successfully",
        });
      } else {
        return res.json({
          result: false,
          message: "Old password wrong!",
        });
      }
    } else {
      return res.json({
        result: false,
        message: "No user is found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      result: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  forgetRequest,
  confirmReset,
  resendCode,
  passwordChange,
};
