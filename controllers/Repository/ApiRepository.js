const express = require("express");
const app = express();
const crypto = require("crypto");
const User = require("../../models/User");
const token = require("../../models/Token");

class ApiRepository {
  constructor() {
    // Access token
    this.token_id = Math.floor(Math.random() * 1000);
    this.access_token = crypto
      .createHash("sha1")
      .update(`WUECART${this.token_id}!@#$%^&*!!`)
      .digest("hex");
  }

  login(data) {
    let getUsers;
    let accessToken = this.access_token;

    if (data.id) {
      // Assuming User.getUser and token are implemented elsewhere
      getUsers = User.getUser(null, data.id);

      const check = token.count({ userId: data.id });

      if (check > 0) {
        token
          .findOneAndUpdate({ userId: data.id }, { token: accessToken })
          .exec();
      } else {
        const newToken = new token({ userId: data.id, token: accessToken });
        newToken.save();
      }
    }

    if (getUsers) {
      return {
        id: getUsers.id,
        name: getUsers.name || "",
        country_code: getUsers.country_code || "",
        email: getUsers.email || "",
        access_token: accessToken,
      };
    } else {
      return { code: 461 };
    }
  }

  register(data) {
    const user = new User({
      username: data.username,
      name: data.name,
      country_code: data.country_code,
      phone: data.phone,
      email: data.email,
      password: hashPassword(data.password),
      user_type: data.user_type,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    user.save();

    // Assuming Mail.sendEmail is implemented elsewhere
    Mail.sendEmail({
      to: data.email,
      subject: "Information Recorded",
      body: `Dear ${data.name}, your information has been recorded.`,
    });

    return user;
  }

  // Change password
  changePassword(data) {
    const { phone, country_code, password } = data;
    const user = User.findOne({ phone, country_code });

    if (user) {
      user.password = hashPassword(password);
      user.save();
      return { code: 200 };
    } else {
      return { code: 410 };
    }
  }

  save_token(data, userId) {
    const user = User.findById(userId);

    if (user) {
      user.device_token = data.device_token || "";
      user.save();
      return { code: 200 };
    } else {
      return { code: 632 };
    }
  }

  delete_account(data, userId) {
    const user = User.findById(userId);

    if (user && user.is_deleted === 0) {
      user.is_deleted = 1;
      user.save();
      return { code: 200 };
    } else {
      return { code: 632 };
    }
  }
}

// Hash password function
function hashPassword(password) {
  // Assuming hashPassword function is implemented elsewhere
  // Use a secure hashing algorithm (e.g., bcrypt) in a real application
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Sample usage
// const apiRepo = new ApiRepository();
// const user = apiRepo.login({ id: 123 });
// console.log(user);

// Initialize Express app and handle routes (if applicable)
// ...
