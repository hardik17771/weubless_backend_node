const express = require("express");
const app = express();
const crypto = require("crypto");
const User = require("../../models/User");
const token = require("../../models/Token");
const bcrypt = require("bcrypt");
const axios = require("axios");

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
      // console.log("login for API Repository is hit");
      // console.log("data.email", data.email);

      if (data.email && data.password) {
        // console.log("email password not null");
        const user = await User.getUser(data.email);

        if (user) {
          const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password
          );

          if (isPasswordValid) {
            const userId = user.id;
            const check = await token.countDocuments({ userId });

            // console.log(check);

            user.access_token = accessToken;
            user.save();

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
            return { code: 430 };
          }
        } else {
          return { code: 461 };
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
      return { code: 468 };
    }
  }

  async fetchUser(data) {
    try {
      const accessToken = this.access_token;

      if (data.id) {
        const user = await User.getUserById(data.id);
        if (user) {
          return {
            id: user.id,
            name: user.name,
            country_code: user.country_code,
            phone: user.phone,
            email: user.email,
            user_type: user.user_type,
            dob: user.dob,
            country: user.country,
            state: user.state,
            city: user.city,
            postal_code: user.postal_code,
            image: user.image,
            access_token: accessToken,
            code: 200,
          };
        } else {
          return { code: 422 };
        }
      } else {
        return { code: 422 };
      }
    } catch (error) {
      console.error(error);
      return { code: 468 };
    }
  }

  async updateProfile(data) {
    console.log("data", data);
    try {
      const accessToken = this.access_token;
      if (data) {
        const user = await User.getUser(data.email);

        if (user) {
          user.name = data.name || "";
          user.phone = data.phone || "";
          user.username = data.username || "";
          user.email = data.email || "";
          user.dob = data.dob || "";
          user.address = data.address || "";
          user.country = data.country || "";
          user.state = data.state || "";
          user.city = data.city || "";
          user.postal_code = data.postal_code || "";
          user.image = data.image || "";

          user.save();

          const response = await axios.post(
            "http://localhost:8080/api/update_profile",
            {},
            {
              headers: {
                Authorization: accessToken,
              },
            }
          );

          console.log("response.data", response.data);
          return { data: response.data, code: 200 };

          // return {
          //   id: user.id,
          //   name: user.name,
          //   country_code: user.country_code,
          //   phone: user.phone,
          //   email: user.email,
          //   user_type: user.user_type,
          //   dob: user.dob,
          //   country: user.country,
          //   state: user.state,
          //   city: user.city,
          //   postal_code: user.postal_code,
          //   image: user.image,
          //   access_token: accessToken,
          //   code: 200,
          // };
        } else {
          return { code: 422 };
        }
      } else {
        return { code: 422 };
      }
    } catch (error) {
      console.error(error);
      return { code: 468 };
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
  async changePassword(data) {
    try {
      if (data.email && data.password && data.phone && data.country_code) {
        const user = await User.getUser(data.email);
        if (user) {
          console.log("user.password", user.password);
          console.log("data.password", data.password);
          const isPasswordSame = await bcrypt.compare(
            data.password,
            user.password
          );
          if (isPasswordSame) {
            return { code: 420 };
          }
          console.log("isPasswordSame", isPasswordSame);

          user.password = await hashPassword(data.password);
          user.save();
          console.log(user);
          return { code: 200 };
        } else {
          return { code: 411 };
        }
      } else {
        return { code: 411 };
      }
    } catch (error) {
      console.error(error);
      return { code: 468 };
    }
    // const { email, phone, country_code, password } = data;
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

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

module.exports = ApiRepository;
