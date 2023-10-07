const express = require("express");
const app = express();
const crypto = require("crypto");
const User = require("../../models/User");
const token = require("../../models/Token");
const bcrypt = require("bcrypt");

class ApiRepository {
  constructor() {
    // Access token
    this.token_id = Math.random().toString(36).substring(2, 15);
    this.access_token = crypto
      .createHash("sha1")
      .update(`WUECART${this.token_id}!@#$%^&*!!`)
      .digest("hex");
  }

  async login(data) {
    try {
      const accessToken = this.access_token;
      console.log("login for API Repository is hit");
      console.log("data.email", data.email);

      if (data.email && data.password) {
        console.log("email password not null");
        const user = await User.getUser(data.email);

        if (user) {
          const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password
          );

          if (isPasswordValid) {
            const userId = user.id;
            const check = await token.countDocuments({ userId });

            console.log(check);

            if (check > 0) {
              await token
                .findOneAndUpdate({ userId }, { token: accessToken })
                .exec();
            } else {
              const newToken = new token({ userId, token: accessToken });
              await newToken.save();
            }

            return {
              id: user.id,
              name: user.name,
              country_code: user.country_code,
              email: user.email,
              access_token: accessToken,
              code: 200,
            };
          } else {
            return { code: 430 }; // Incorrect password
          }
        } else {
          return { code: 431 }; // User not found
        }
      } else {
        if (data.email === "") {
          return { code: 531 }; // Empty email
        } else {
          return { code: 532 }; // Empty password
        }
      }
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Internal server error." };
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
