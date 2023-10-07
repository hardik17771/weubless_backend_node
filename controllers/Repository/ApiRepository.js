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

  async login(data) {
    let getUsers;
    let accessToken = this.access_token;
    console.log("login for API Repository is hit");
    console.log("data.email", data.email);
    if (data.email) {
      // Assuming User.getUser and token are implemented elsewhere
      getUsers = await User.getUser(data.email);

      // const check = token.count({ userId: data.id });
      // console.log(check);
      // if (check > 0) {
      //   token
      //     .findOneAndUpdate({ userId: data.id }, { token: accessToken })
      //     .exec();
      // } else {
      //   const newToken = new token({ userId: data.id, token: accessToken });
      //   newToken.save();
      // }
    }
    console.log("getUsers", getUsers);
    if (getUsers) {
      return {
        id: getUsers.id,
        name: getUsers.name,
        country_code: getUsers.country_code,
        email: getUsers.email,
        access_token: accessToken,
      };
    } else {
      return { code: 461 };
    }
  }

  async register(data) {
    try {
      console.log("Register API Repository data");
      console.log(data);
      const user = new User.User2({
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

      await user.save();
      return user;
    } catch (error) {
      throw error; // Rethrow the error to be caught in the higher level
    }
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
  console.log(password);
  // Assuming hashPassword function is implemented elsewhere
  // Use a secure hashing algorithm (e.g., bcrypt) in a real application
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = ApiRepository;
