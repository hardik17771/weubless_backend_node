const express = require("express");
const turf = require("@turf/turf");

const app = express();
const crypto = require("crypto");
const User = require("../../models/User");
const token = require("../../models/Token");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Address = require("../../models/Address");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const SubSubCategory = require("../../models/SubSubCategory");
const Product = require("../../models/Product");
const Shop = require("../../models/Shop");
const Seller = require("../../models/Seller");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const Advertisement = require("../../models/Advertisement");
const Faq = require('../../models/Faq')

class ApiRepository {
  constructor() {
    // Access token
    this.token_id = Math.random().toString(36).substring(2, 15);
    this.access_token = crypto
      .createHash("sha1")
      .update(`WUECART${this.token_id}!@#$%^&*!!`)
      .digest("hex");
  }

  async createAddress(data) {
    // try {
      if (data.latitude && data.longitude  && data.user_id) {
        const user =
          (await User.getUserById(data.user_id)) ||
          (await User.getUserByUserUid(data.userUid));
  
        if (!user) {
          return { code: 461 };
        } else {
          // Ensure that latitude and longitude are present in the data object
          if (data.latitude && data.longitude) {
            const address = new Address.Address({
              latitude: data.latitude,
              longitude: data.longitude,
              address: data.address,
              pincode: data.pincode,
              city: data.city,
              state: data.state,
              country: data.country,
            });
  
            await address.save();
  
            console.log("data", data);
            console.log("address", address);
            
            user.addresses = [...user.addresses, {
              latitude: data.latitude,
              longitude: data.longitude,
              address: data.address,
              pincode: data.pincode,
              city: data.city,
              state: data.state,
              country: data.country,
            }];
            await user.save();
  
            console.log(user);
            return { code: 744, data: address };
          } else {
            return { code: 730 };
          }
        }
      } else if (!data.latitude) {
        return { code: 719 };
      } else if (!data.longitude) {
        return { code: 719 };
      } else {
        return { code: 730 };
      }
    // } catch (error) {
    //   return { code: 1100 };
    // }
  }


  async updateAddress( data) {
    try {
      if(data.address_id)
      {
        const existingAddress = await Address.getAddressById(data.address_id);

        if (!existingAddress) {
          return { code: 748 }; 
        }
  
        existingAddress.latitude = data.latitude || existingAddress.latitude;
        existingAddress.longitude = data.longitude || existingAddress.longitude;
        existingAddress.address = data.address || existingAddress.address;
        existingAddress.pincode = data.pincode || existingAddress.pincode;
        existingAddress.city = data.city || existingAddress.city;
        existingAddress.state = data.state || existingAddress.state;
        existingAddress.country = data.country || existingAddress.country;
  
        await existingAddress.save();
  
        
        return { code: 749, data: existingAddress }; 
      }
      else{
        return {code : 750}
      }

    } catch (error) {
      console.error("Error updating address:", error.message);
      return { code: 1100 }; 
    }
  }

  async addressDetails(data) {
    try {
      if (data.address_id) {
        console.log("name and image present");
        const address = await Address.getAddressById(data.address_id);

        if (address) {
          return {
            data: address,
            code: 751,
          };
        } else {
          return { code: 748 };
        }
      } else {
        return { code: 750 };
      }
    } catch (error) {
      console.error(error);
      return { code: 1100 };
    }
  }


  
  async login(data) {
    try {
      const accessToken = this.access_token;
      // console.log("login for API Repository is hit");
      // console.log("data.email", data.email);

      if (data.email && data.password) {
        // console.log("email password not null");
        const user = await User.getUser(data.email);
        console.log("usere heheheeh is ", user);
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
      // const accessToken = this.access_token;

      if (data.user_id) {
        const user = await User.getUserById(data.user_id);
        if (user) {
          return {
            // // user_id: user.user_id,
            // // id: user.id,
            // // name: user.name,
            // // latitude: user.latitude,
            // // longitude: user.longitude,
            // // country_code: user.country_code,
            // // phone: user.phone,
            // // email: user.email,
            // // user_type: user.user_type,
            // // dob: user.dob,
            // // country: user.country,
            // // state: user.state,
            // // city: user.city,
            // // postal_code: user.postal_code,
            // // image: user.image,
            // userUid: user.userUid,
            // username: user.username,
            // name: user.name,
            // country_code: user.country_code,
            // phone: user.phone,
            // email: user.email,
            // password: await hashPassword(user.password),
            // user_type: user.user_type,
            // primary_address_index = user.primary_address_index,
            // // latitude: user.latitude,
            // // longitude: user.longitude,
            // // liveAddress: user.liveAddress,
            // // livePincode: user.livePincode,
            // // liveCity: user.liveCity,
            // // input_latitude: user.input_latitude,
            // // input_longitude: user.input_longitude,
            // // input_liveAddress: user.input_liveAddress,
            // // input_livePincode: user.input_livePincode,
            // // input_liveCity: user.input_liveCity,
            // deviceToken: user.deviceToken,
            // profileImage: user.profileImage,
            // // access_token: accessToken,
            user: user,
            code: 200,
          };
        } else {
          return { code: 422 };
        }
      } else if (data.userUid) {
        const user = await User.getUserByUserUid(data.userUid);
        if (user) {
          return {
            // userUid: user.userUid,
            // username: user.username,
            // name: user.name,
            // country_code: user.country_code,
            // phone: user.phone,
            // email: user.email,
            // password: await hashPassword(user.password),
            // user_type: user.user_type,
            // // latitude: user.latitude,
            // // longitude: user.longitude,
            // // liveAddress: user.liveAddress,
            // // livePincode: user.livePincode,
            // // liveCity: user.liveCity,
            // // input_latitude: user.input_latitude,
            // // input_longitude: user.input_longitude,
            // // input_liveAddress: user.input_liveAddress,
            // // input_livePincode: user.input_livePincode,
            // // input_liveCity: user.input_liveCity,
            // deviceToken: user.deviceToken,
            // profileImage: user.profileImage,
            // access_token: accessToken,
            user: user,
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
      // const accessToken = this.access_token;
      if (data) {
        const user =
          (await User.getUserById(data.user_id)) ||
          (await User.getUserByUserUid(data.userUid));


        if (user) {

        if (data.username && data.username !== user.username) {
          const usernameExists = await User.User2.findOne({ username: data.username });
          if (usernameExists) {
            return { code: 468, issue: "Username already in use" };
          }
        }

        if (data.email && data.email !== user.email) {
          const emailExists = await User.User2.findOne({ email: data.email });
          if (emailExists) {
            return { code: 468, issue: "Email already in use" };
          }
        }

        if (data.phone && data.phone !== user.phone) {
          const phoneExists = await User.User2.findOne({ phone: data.phone });
          if (phoneExists) {
            return { code: 468, issue: "Phone number already in use" };
          }
        }

          user.userUid = data.userUid || user.userUid;
          user.username = data.username || user.username;
          user.name = data.name || user.name;
          user.phone = data.phone || user.phone;
          user.email = data.email || user.email;
          user.user_type = data.user_type || user.user_type;
          user.dob = data.dob || user.dob;
          user.profileImage = data.profileImage || user.profileImage;
          user.latitude = data.latitude || user.latitude;
          user.longitude = data.longitude || user.longitude;
          user.address = data.address || user.address;
          user.pincode = data.pincode || user.pincode;
          user.city = data.city || user.city;
          user.state = data.state || user.state;
          user.country = data.country || user.country;
          // user.input_latitude = data.input_latitude || user.input_latitude;
          // user.input_longitude = data.input_longitude || user.input_longitude;
          // user.input_liveAddress =
          //   data.input_liveAddress || user.input_liveAddress;
          // user.input_livePincode =
          //   data.input_livePincode || user.input_livePincode;
          // user.input_liveCity = data.input_liveCity || user.input_liveCity;

          const primaryAddressIndex = data.primary_address_index || 0; // Change 0 to the desired index

          if (user.addresses && user.addresses.length > primaryAddressIndex) {
            user.addresses[primaryAddressIndex] = {
              latitude: data.latitude || user.addresses[primaryAddressIndex].latitude,
              longitude: data.longitude || user.addresses[primaryAddressIndex].longitude,
              address: data.address || user.addresses[primaryAddressIndex].address,
              pincode: data.pincode || user.addresses[primaryAddressIndex].pincode,
              city: data.city || user.addresses[primaryAddressIndex].city,
              state: data.state || user.addresses[primaryAddressIndex].state,
              country: data.country || user.addresses[primaryAddressIndex].country,
            };
          }
          
          user.save();
          return { data: user, code: 208 };

        } else {
          return { code: 422 };
        }
      } else {
        return { code: 422 };
      }
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
  
      // res.status(401).json({ status: 0, message: errorMessage });
      
      // console.error(error);
      return { code: 468 , msg : errorMessage};
    }
  }

  async register(data) {
    // const data = req.body;
    // console.log("API Controller data");
    // console.log(data);
    console.log("register Data", data)
    const newAddress = new Address.Address({
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      country: data.country,
    })
    await newAddress.save();
  
    try {
      const newUser = new User.User2({
        userUid: data.userUid,
        username: data.username,
        name: data.name,
        phone: data.phone,
        email: data.email,
        user_type: data.user_type,
        deviceToken: data.deviceToken,
        profileImage: data.profileImage,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        dob : data.dob,
        // input_latitude: data.input_latitude,
        // input_longitude: data.input_longitude,
        // input_liveAddress: data.input_liveAddress,
        // input_livePincode: data.input_livePincode,
        // input_liveCity: data.input_liveCity,
        addresses: [
          newAddress
        ],
      });
  
  
      // console.log('dob that is entered value before validation:', data.dob);
      // console.log('dob for user value before validation:', newUser.dob);
  
      // console.log(newAddress)
      await newUser.save();
      return{
        status: 1,
        message: "User registered successfully",
        data: newUser,
        status_code : 200
      };
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
  
      return{ status: 0, message: errorMessage ,status_code : 200};
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

    if (user) {
      user.save();
      return { code: 200 };
    } else {
      return { code: 632 };
    }
  }

  /*********************************************** CATEGORY ***********************************/

  async createCategory(data) {
    try {
      console.log("Create category api repo hit");

      if (data.name && data.image) {
        console.log("name and image present");
        const newCategory = new Category.Category(data);
        console.log("new category present");
        await newCategory.save();
        console.log(newCategory);
        return { data: newCategory, code: 706 };
      } else if (data.name == "") {
        console.log("name absent");
        return { code: 708 };
      } else {
        return { code: 709 };
      }
    } catch (error) {
      return { code: 707 };
    }
  }

  async updateCategory(data) {
    try {
      if (data.category_id) {
        const oldCategory = await Category.getCategoryById(data.category_id);
        const updatedCategory = await Category.getCategoryById(
          data.category_id
        );

        if (updatedCategory) {
          Object.assign(updatedCategory, data);
          console.log("Old Category present", oldCategory);
          console.log("Updated Category present", updatedCategory);

          updatedCategory.save();
          return { code: 297, updatedCategory: updatedCategory };
        } else {
          return { code: 425 };
        }
      } else {
        return { code: 711 };
      }
    } catch (error) {
      return { code: 425 };
    }
  }

  async categoryListing() {
    try {
      // console.log(Category.Category);
      const categoryList = await Category.Category.find();
      console.log("categoryList", categoryList);
      return { list: categoryList, code: 674 };
    } catch (error) {
      return { code: 425 };
    }
  }
  /*********************************************** SUB CATEGORY ***********************************/

  async createSubCategory(data) {
    try {
      console.log("Create sub category api repo hit");

      if (data.name && data.category_id) {
        const newSubCategory = new SubCategory.SubCategory(data);
        console.log("new category present");

        const category = await Category.getCategoryById(data.category_id);
        if (category) {
          category.subCategories.push(newSubCategory._id);
          await newSubCategory.save();
          await category.save();
        } else {
          return { code: 714 };
        }

        console.log(newSubCategory);
        return { data: newSubCategory, code: 712 };
      } else if (data.name == "") {
        console.log("name absent");
        return { code: 710 };
      } else {
        return { code: 711 };
      }
    } catch (error) {
      console.error(error);
      return { code: 713 };
    }
  }

  async updateSubCategory(data) {
    // try {
    // console.log(Category.Category);
    if (data.main_subcategory_id) {
      const oldSubCategory = await SubCategory.getSubCategoryById(
        data.main_subcategory_id
      );
      const updatedSubCategory = await SubCategory.getSubCategoryById(
        data.main_subcategory_id
        // Return the document as it was before the update
      );

      if (updatedSubCategory) {
        Object.assign(updatedSubCategory, data);
        console.log("Old Sub-Category present", oldSubCategory);
        console.log("Updated sub Category present", updatedSubCategory);
        if (data.category_id) {
          console.log("Category ID present");
          if (oldSubCategory.category_id != data.category_id) {
            console.log("Old Product not equal data main subcategory id ");

            // Category
            const oldCategory = await Category.getCategoryById(
              oldSubCategory.category_id
            );
            const category = await Category.getCategoryById(data.category_id);
            console.log("Apparantely the category", category);
            if (!category) {
              return { code: 714 };
            }

            await Category.Category.findOneAndUpdate(
              { _id: oldCategory._id },
              { $pull: { subCategories: updatedSubCategory._id } }
            );

            await Category.Category.findOneAndUpdate(
              { _id: category._id },
              { $push: { subCategories: updatedSubCategory._id } }
            );

            const products = await SubCategory.getProdutsByMainSubCategoryId(
              data.main_subcategory_id
            );
            if (products) {
              for (const product of products) {
                await Category.Category.findOneAndUpdate(
                  { _id: oldCategory._id },
                  { $pull: { products: product._id } }
                );

                await Category.Category.findOneAndUpdate(
                  { _id: category._id },
                  { $push: { products: product._id } }
                );
              }
            }
          }
        }

        await updatedSubCategory.save(); // Save the updated product
        return { code: 297, updatedSubCategory: updatedSubCategory };
      } else {
        return { code: 425 };
      }
    } else {
      return { code: 725 };
    }
    // } catch (error) {
    //   return { code: 425 };
    // }
  }

  async subCategoryListing() {
    try {
      // console.log(Category.Category);
      const subCategoryList = await SubCategory.SubCategory.find();
      console.log("subCategoryList", subCategoryList);
      return { list: subCategoryList, code: 690 };
    } catch (error) {
      return { code: 425 };
    }
  }

  async mainSubCategory(data) {
    const { category_id } = data;
    // console.log(category_id);
    let subCategoriesList = [];
    // try {
    const subCategoryIds = await Category.getSubCategoriesByCategoryId(
      category_id
    );
    const subCategoriesObjects = await Category.findSubCategories(
      subCategoryIds
    );
    // console.log("Main SUbcategories by the category Id", subCategoriesObjects);
    if (subCategoriesObjects && subCategoriesObjects.length > 0) {
      subCategoriesObjects.forEach((subCategory) => {
        subCategoriesList.push(subCategory);
      });
      return { code: 689, subCategoriesList: subCategoriesList };
    } else {
      return { code: 715, subCategoriesList: subCategoriesList };
    }
    // } catch (error) {
    //   return { code: 642, subCategoriesList: subCategoriesList };
    // }
  }

  // async createSubSubCategory(data) {
  //   try {
  //     console.log("Create sub category api repo hit");

  //     if (data.name && data.main_subcategory_id) {
  //       const newSubSubCategory = new SubSubCategory.SubSubCategory(data);
  //       // console.log("new category present");

  //       const subCategory = await SubCategory.getSubCategoryById(
  //         data.main_subcategory_id
  //       );
  //       if (subCategory) {
  //         subCategory.subsubCategories.push(newSubSubCategory._id);
  //         await subCategory.save();
  //         await newSubSubCategory.save();
  //       } else {
  //         return { code: 726 };
  //       }

  //       // console.log(newSubCategory);
  //       return { data: newSubSubCategory, code: 712 };
  //     } else if (data.name == "") {
  //       console.log("name absent");
  //       return { code: 710 };
  //     } else {
  //       return { code: 711 };
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return { code: 713 };
  //   }
  // }

  // async SubCategory(data) {
  //   const { main_subcategory_id } = data;
  //   let subSubCategoriesList = [];
  //   try {
  //     const subSubCategoryIds =
  //       await SubCategory.getSubSubCategoriesByMainSubCategoryId(
  //         main_subcategory_id
  //       );
  //     const subSubCategoriesObjects = await SubCategory.findSubSubCategories(
  //       subSubCategoryIds
  //     );

  //     if (subSubCategoriesObjects && subSubCategoriesObjects.length > 0) {
  //       for (const subSubCategory of subSubCategoriesObjects) {
  //         let productsList = [];
  //         const productIds = await SubSubCategory.getProdutsBySubCategoryId(
  //           subSubCategory.subcategory_id
  //         );
  //         const productObjects = await SubSubCategory.findProducts(productIds);

  //         if (productObjects && productObjects.length > 0) {
  //           for (const product of productObjects) {
  //             const productItem = {
  //               product_id: product.product_id,
  //               subcategory: product.name || "",
  //             };
  //             productsList.push(productItem);
  //           }
  //         }

  //         const item = {
  //           subcategory_id: subSubCategory.subcategory_id,
  //           subcategory: subSubCategory.name || "",
  //           products: productsList,
  //         };
  //         subSubCategoriesList.push(item);
  //       }

  //       return { code: 689, subSubCategoriesList: subSubCategoriesList };
  //     } else {
  //       return { code: 715, subSubCategoriesList: subSubCategoriesList };
  //     }
  //   } catch (error) {
  //     return { code: 642, subSubCategoriesList: subSubCategoriesList };
  //   }
  // }

  /*********************************************** PRODUCTS ***********************************/

  async createProduct(data) {
    // try {

    if (data.name && data.main_subcategory_id ) {
      const newProduct = new Product.Product(data);
      const subCategory = await SubCategory.getSubCategoryById(
        data.main_subcategory_id
      );


      if (subCategory ) {
        subCategory.products.push(newProduct._id);
        const categoryId = subCategory.category_id;
        const category = await Category.getCategoryById(categoryId);
        category.products.push(newProduct._id);
        
        await newProduct.save();
        
        const updated_product = await Product.populateCategory(
          categoryId,
          newProduct.product_id
        );


          let total_quantity = 0

          // This code will effectively take place only when it is required that when the seller is creating a new product and then it is pushing it in it's database hand to hand
          if (data.shops)
          {
            // console.log("data.shops is present")
          
            console.log("data.shops: ", data.shops)
            for(const shop of data.shops)
            {
              console.log("shop in the data.shops: ", shop)
              if(!shop.shop_id)
              {
                return {code : 723}
              }

              const shopFound = await Shop.getShopById(shop.shop_id)
              console.log("shopFound",shopFound)
              if(!shopFound)
              {
                return {code : 722}
              }

              const quantity = shop.quantity || 0;
              const shop_price = shop.shop_price || 0;
              const productData = {
                product_id : newProduct.product_id,
                quantity : quantity,
                shop_price : shop_price
              } 
              total_quantity += quantity
              shopFound.products.push(productData)
              shopFound.save();
              console.log("shopFound after updating" , shopFound)
            }
          
        
        updated_product.total_quantity += total_quantity
        await subCategory.save();
        await category.save();
        await updated_product.save();

      }
      console.log("final updated product" , updated_product)
      return { data: updated_product, code: 716 };
      } else {
        return { code: 726 };
      }


      // await newProduct.save();
      // console.log("new newProduct present");
      // await newProduct.save();
      // console.log(newProduct);
    } else if (!data.main_subcategory_id) {
      return { code: 725 };
    }  else {
      return { code: 708 };
    }
    // } catch (error) {
    //   return { code: 717 };
    // }
  }

  async productListing() {
    try {
      // console.log(Category.Category);
      const productList = await Product.Product.find();
      console.log("productList", productList);
      return { list: productList, code: 732 };
    } catch (error) {
      return { code: 425 };
    }
  }

  async updateProduct(data) {
    // try {
      // console.log(Category.Category);
      if (data.product_id) {
        const oldProduct = await Product.getProductById(data.product_id);
        const updatedProduct = await Product.getProductById(data.product_id);

        if (updatedProduct) {
          Object.assign(updatedProduct, data);
          // console.log("Updated product present", updatedProduct);
          // if (data.shop_id) {
          //   if (oldProduct.shop_id != data.shop_id) {
          //     const oldShop = await Shop.getShopById(oldProduct.shop_id);
          //     const shop = await Shop.getShopById(data.shop_id);

          //     if (!shop) {
          //       return { code: 722 };
          //     }

          //     console.log(oldShop._id);
          //     await Shop.Shop.findOneAndUpdate(
          //       { _id: oldShop._id },
          //       { $pull: { products: updatedProduct._id } }
          //     );

          //     // Add product_id to new shop
          //     await Shop.Shop.findOneAndUpdate(
          //       { _id: shop._id },
          //       { $push: { products: updatedProduct._id } }
          //     );
          //   }
          // }

          if(data.shops || data.total_quantity)
          {
            return { code : 760}
          }

          if (data.main_subcategory_id) {
            // console.log("SubCategory ID present");
            if (oldProduct.main_subcategory_id != data.main_subcategory_id) {
              // console.log("Old Product not equal data main subcategory id ");
              // Sub Category
              const oldSubCategory = await SubCategory.getSubCategoryById(
                oldProduct.main_subcategory_id
              );
              const subCategory = await SubCategory.getSubCategoryById(
                data.main_subcategory_id
              );

              if (!subCategory) {
                return { code: 726 };
              }

              // console.log("old Subcategory", oldSubCategory);
              // console.log("new Subcategory", subCategory);
              await SubCategory.SubCategory.findOneAndUpdate(
                { _id: oldSubCategory._id },
                { $pull: { products: updatedProduct._id } }
              );

              // Add product_id to new shop
              await SubCategory.SubCategory.findOneAndUpdate(
                { _id: subCategory._id },
                { $push: { products: updatedProduct._id } }
              );

              // Category
              const oldCategory = await Category.getCategoryById(
                oldSubCategory.category_id
              );
              const category = await Category.getCategoryById(
                subCategory.category_id
              );
              await Category.Category.findOneAndUpdate(
                { _id: oldCategory._id },
                { $pull: { products: updatedProduct._id } }
              );

              await Category.Category.findOneAndUpdate(
                { _id: category._id },
                { $push: { products: updatedProduct._id } }
              );
            }
          }

          await updatedProduct.save(); // Save the updated product
          return { code: 297, updatedProduct: updatedProduct };
        } else {
          return { code: 425 };
        }
      } else {
        return { code: 718 };
      }
    // } catch (error) {
    //   return { code: 425 };
    // }
  }

  async productDetails(data) {
    try {
      if (data.product_id) {
        console.log("name and image present");
        const product = await Product.getProductById(data.product_id);

        if (product) {
          // const {
          //   name,
          //   createdAt,
          //   updatedAt,
          //   product_id,
          //   main_subcategory_id,
          //   subcategory_id,
          //   latitude,
          //   longitude,
          //   quantity,
          //   added_by,
          //   user_id,
          //   category_id,
          //   brand_id,
          //   photos,
          //   thumbnail_img,
          //   featured_img,
          //   flash_deal_img,
          //   video_provider,
          //   video_link,
          //   tags,
          //   description,
          //   unit_price,
          //   purchase_price,
          //   choice_options,
          //   colors,
          //   variations,
          //   todays_deal,
          //   published,
          //   featured,
          //   current_stock,
          //   unit,
          //   discount,
          //   discount_type,
          //   tax,
          //   tax_type,
          //   shipping_type,
          //   shipping_cost,
          //   num_of_sale,
          //   meta_title,
          //   meta_description,
          //   meta_img,
          //   pdf,
          //   slug,
          //   rating,
          // } = product;

          return {
            data: product,
            code: 664,
          };
        } else {
          return { code: 422 }; 
        }
      } else {
        return { code: 718 }; 
      }
    } catch (error) {
      console.error(error);
      return { code: 642 };
    }
  }

  /*********************************************** FETCHING PRODUCTS BY IDs ***********************************/

  async productsFromMainSubCategoryId(data) {
    const { main_subcategory_id } = data;
    let productsList = [];
    try {
      const productIds = await SubCategory.getProdutsByMainSubCategoryId(
        main_subcategory_id
      );

      const productObjects = await SubCategory.findProducts(productIds);
      if (productObjects && productObjects.length > 0) {
        productObjects.forEach((product) => {
          productsList.push(product);
        });
        return { code: 684, productsList: productsList };
      } else {
        return { code: 728, productsList: productsList };
      }
    } catch (error) {
      return { code: 642, productsList: productsList };
    }
  }

  async productsFromCategoryId(data) {
    const { category_id } = data;
    let productsList = [];
    try {
      const productIds = await Category.getProdutsByCategoryId(category_id);

      const productObjects = await Category.findProducts(productIds);
      if (productObjects && productObjects.length > 0) {
        productObjects.forEach((product) => {
          productsList.push(product);
        });
        return { code: 684, productsList: productsList };
      } else {
        return { code: 729, productsList: productsList };
      }
    } catch (error) {
      return { code: 642, productsList: productsList };
    }
  }

  /*********************************************** SHOPS ***********************************/

  async createShop(data) {
    console.log(data);
    // try {
      console.log("Create newShop api repo hit");
      console.log("name is ", data.name);
      console.log("data is ", data);
      if (data.name && data.latitude && data.longitude && data.seller_id) {
        console.log("name and image present");
        const newShop = new Shop.Shop(data);
        console.log("new newShop present");
        await newShop.save();
        console.log(newShop);
        const seller = await Seller.getSellerById(data.seller_id)
        if(!seller){
          return {code : 765}
        }

        seller.shops_owned.push({
          shop_id : newShop.shop_id
        })
        await seller.save();
        return { data: newShop, code: 720 };
      } else if (!data.name) {
        return { code: 708 };
      }
      else if (!data.seller_id) {
        return { code: 761 };
      }  else {
        return { code: 719 };
      }
    // } catch (error) {
    //   return { code: 721 };
    // }
  }

  async addProductsToShop(data) {
    console.log(data);
    // try {
      if (Array.isArray(data.products) && data.shop_id) {
        const shop = await Shop.getShopById(data.shop_id)
        for(const productData of data.products)
        {
          if (!productData.product_id)
          {
            return { code : 718}
          }

          let alreadyExisting = false

          for(const existingProduct of shop.products)
          {
            if (existingProduct.product_id == productData.product_id)
            {
              if(productData.quantity)
              {
                existingProduct.quantity += productData.quantity
              }
              if(productData.shop_price)
              {
                existingProduct.shop_price = productData.shop_price
              }

              const product = await Product.getProductById(existingProduct.product_id)
              
              console.log("product.shops",product)

              for (const shopData of product.shops)
              {
                if(shopData.shop_id === shop.shop_id )
                {
                    shopData.quantity += productData.quantity
                    shopData.shop_price = productData.shop_price 
                }
              }
              await product.save();
              alreadyExisting = true
            }
          }
          if(!alreadyExisting)
          {
            shop.products.push(productData)
            const product = await Product.getProductById(productData.product_id)
            for (const shopData of product.shops)
            {
              if (shopData.shop_id === shop.shop_id)
              {
                product.shops.push({
                  shop_id : shop.shop_id,
                  quantity : productData.quantity,
                  shop_price : productData.shop_price,
                })
              }
            }
            await product.save();
          }
        }
        await shop.save();
        
        console.log("shop after the products added: " ,shop );
        return { data: shop, code: 763 };
      } else if (!data.shop_id) {
        return { code: 723 };
      }
      else  {
        return { code: 756 };
      }  
    // } catch (error) {
    //   return { code: 721 };
    // }
  }

  async deleteProductOfShop(data){
    if(data.product_id && data.shop_id)
    {
      const shop = await Shop.getShopById(data.shop_id)
      const product = await Product.getProductById(data.product_id)
      if(!shop)
      {
        return {code : 722}
      }
      if(!product)
      {
        return {code : 735}
      }
      for(const productData of shop.products)
      {
        if (productData.product_id === data.product_id)
        {
          shop.products.pop(productData)
        }
      }
      await shop.save();
      
      for(const shopData of product.shops)
      {
        if(shopData.shop_id === data.shop_id)
        {
          product.shops.pop(shopData)
        }
      }
      await product.save();

      return { data : {shop , product }, code : 767 }
    }
    else if(!data.product_id)
    {
      return { code : 718}
    }
    else{
      return { code : 723 }
    }
  }

  async shopListing() {
    try {
      // console.log(Category.Category);
      const shopList = await Shop.Shop.find();
      console.log("shopList", shopList);
      return { list: shopList, code: 733 };
    } catch (error) {
      return { code: 425 };
    }
  }

  async updateShop(data) {
    try {
      if (data.shop_id) {
        const oldShop = await Shop.getShopById(data.shop_id);
        const updatedShop = await Shop.getShopById(data.shop_id);

        if (updatedShop) {
          Object.assign(updatedShop, data);
          console.log("Old Shop present", oldShop);
          console.log("Updated Shop present", updatedShop);

          updatedShop.save();
          return { code: 297, updatedShop: updatedShop };
        } else {
          return { code: 425 };
        }
      } else {
        return { code: 723 };
      }
    } catch (error) {
      return { code: 425 };
    }
  }

  async shopDetails(data) {
    try {
      if (data.shop_id) {
        console.log("name and image present");
        const shop = await Shop.getShopById(data.shop_id);
        console.log("shop fetched by getShopId", shop);
  
        if (shop) {
          const { products } = shop;
          console.log("products", products);
  
          let productsList = [];
          for (const productData of products) {
            const productObject = await Product.getProductById(productData.product_id);
            productsList.push(productObject);
          }
  
          // Add productsList property to the existing shop object
          const shopWithProductsList = { ...shop.toObject(), productsList };
  
          // Return the modified shop object
          return {
            data: shopWithProductsList,
            code: 667,
          };
        } else {
          return { code: 722 };
        }
      } else {
        return { code: 723 };
      }
    } catch (error) {
      console.error(error);
      return { code: 724 };
    }
  }
  
  async getShopsByCategory(data) {
    try {
      if (data.category_id) {
        const shops = await Shop.getShopsByCategory(data.category_id);
  

        return { code: 900, data: shops };
      } else {
        return { code: 711 };
      }
    } catch (error) {
      console.error(error);
      return { code: 724 };
    }
  }
  
    /*********************************************** SELLER ***********************************/

  async createSeller(data) {
    // const data = req.body;
    // console.log("API Controller data");
    // console.log(data);
    console.log("register Data", data)

    try {
      const newAddress = new Address.Address({
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
      })
      await newAddress.save();
    
      const newSeller = new Seller.Seller({
        userUid: data.userUid,
        username: data.username,
        name: data.name,
        phone: data.phone,
        email: data.email,
        user_type: data.user_type,
        deviceToken: data.deviceToken,
        profileImage: data.profileImage,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        pincode: data.pincode,
        city: data.city,
        state: data.state,
        country: data.country,
        dob : data.dob,
        // input_latitude: data.input_latitude,
        // input_longitude: data.input_longitude,
        // input_liveAddress: data.input_liveAddress,
        // input_livePincode: data.input_livePincode,
        // input_liveCity: data.input_liveCity,
        addresses: [
          newAddress
        ],
      });
  
      await newSeller.save();
      return{
        code: 764,
        data: newSeller,
      };
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
      else {
        return {code : 1100}
      }
  
      return{ code:1100 , msg: errorMessage };
    }
  }

  async sellerDetails(data) {
    try {
      if (data.seller_id) {
        console.log("name and image present");
        const seller = await Seller.getSellerById(data.seller_id);

        if (seller) {
          return {
            data: seller,
            code: 766,
          };
        } else {
          return { code: 765 }; 
        }
      } else {
        return { code: 761 }; 
      }
    } catch (error) {
      console.error(error);
      return { code: 1100 };
    }
  }




  /*********************************************** LOCATION FEATURES ***********************************/

  async main_subcategoryproductLocation(data) {
    try {
      if (data.shop_id && data.user_id && data.main_subcategory_id) {
        const productsList = [];

        const shop = await Shop.getShopById(data.shop_id);
        const user = await User.getUserById(data.user_id);

        const subCategory = await SubCategory.getSubCategoryById(
          data.main_subcategory_id
        );

        // console.log("produtObjects", productObjects);

        if (shop && user && subCategory) {
          const productObjects = await SubCategory.findProducts(
            subCategory.products
          );
          const distanceUserShop = await calculateDistance(
            user.latitude,
            user.longitude,
            shop.latitude,
            shop.longitude
          );
          console.log(
            "user.latitude,user.longitude, shop.latitude,shop.longitude",
            user.latitude,
            user.longitude,
            shop.latitude,
            shop.longitude
          );
          console.log("subCategory products Ids", subCategory.products);
          console.log("Distance between user and shop", distanceUserShop);

          if (productObjects && productObjects.length > 0) {
            for (const product of productObjects) {
              const distanceUserProduct = await calculateDistance(
                user.latitude,
                user.longitude,
                product.latitude,
                product.longitude
              );
              console.log(
                "user.latitude,user.longitude,product.latitude,product.longitude",
                user.latitude,
                user.longitude,
                product.latitude,
                product.longitude
              );

              console.log(
                `distanceUserProduct ${product.name} and ${user.name}: `,
                distanceUserProduct
              );

              if (distanceUserProduct <= distanceUserShop) {
                const item = {
                  product_id: product.product_id,
                  product_name: product.name || "",
                };
                productsList.push(item);
              }
            }
          }
          console.log("Available products : ", productsList);
          // console.log(shop);
          // console.log(user);
        } else if (!shop) {
          return { code: 722 };
        } else if (!User) {
          return { code: 404 };
        } else {
          return { code: 726 };
        }
        // console.log(data);
        // console.log("Repository productsList ", productsList);
        return { code: 900, productsList: productsList };
      } else if (!data.shop_id) {
        return { code: 723 };
      } else if (!data.user_id) {
        return { code: 730 };
      } else {
        return { code: 725 };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async main_subcategoryproductDistance(data) {
    try {
      if (
        data.distance &&
        data.main_subcategory_id &&
        data.latitude &&
        data.longitude
      ) {
        const productsList = [];
        const subCategory = await SubCategory.getSubCategoryById(
          data.main_subcategory_id
        );
        if (subCategory) {
          const productObjects = await SubCategory.findProducts(
            subCategory.products
          );
          console.log("subCategory products Ids", subCategory.products);
          console.log("Distance given", data.distance);

          if (productObjects && productObjects.length > 0) {
            for (const product of productObjects) {
              const distanceUserProduct = await calculateDistance(
                data.latitude,
                data.longitude,
                product.latitude,
                product.longitude
              );
              console.log(
                "user.latitude,user.longitude,product.latitude,product.longitude",
                data.latitude,
                data.longitude,
                product.latitude,
                product.longitude
              );

              if (distanceUserProduct <= data.distance) {
                const item = {
                  product_id: product.product_id,
                  product_name: product.name || "",
                };
                productsList.push(item);
              }
            }
          }
          console.log("Available products : ", productsList);
        } else {
          return { code: 726 };
        }
        return { code: 900, productsList: productsList };
      } else if (!(data.latitude && data.longitude)) {
        return { code: 719 };
      } else if (!data.distance) {
        return { code: 731 };
      } else {
        return { code: 725 };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async main_subcategoryproductLatLong(data) {
    try {
      if (
        data.lat1 &&
        data.long1 &&
        data.lat2 &&
        data.long2 &&
        data.main_subcategory_id
      ) {
        const productsList = [];
        const subCategory = await SubCategory.getSubCategoryById(
          data.main_subcategory_id
        );
        if (subCategory) {
          const distanceBetween = await calculateDistance(
            data.lat1,
            data.long1,
            data.lat2,
            data.long2
          );

          const productObjects = await SubCategory.findProducts(
            subCategory.products
          );

          console.log("subCategory products Ids", subCategory.products);
          // console.log("Distance given", data.distance);

          if (productObjects && productObjects.length > 0) {
            for (const product of productObjects) {
              const distanceUserProduct = await calculateDistance(
                data.lat1,
                data.long1,
                parseFloat(product.latitude),
                parseFloat(product.longitude)
              );
              console.log(
                "user.latitude,user.longitude,product.latitude,product.longitude",
                data.lat1,
                data.long1,
                product.latitude,
                product.longitude
              );
              console.log(
                "distance User Product",
                distanceUserProduct,
                " distance between ",
                distanceBetween
              );
              if (distanceUserProduct <= distanceBetween) {
                const item = {
                  product_id: product.product_id,
                  product_name: product.name || "",
                };
                productsList.push(item);
              }
            }
          }
          console.log("Available products : ", productsList);
        } else {
          return { code: 726 };
        }
        return { code: 900, productsList: productsList };
      } else if (!(data.lat1 && data.long1 && data.lat2 && data.long2)) {
        return { code: 719 };
      } else {
        return { code: 725 };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async main_subcategoryproductUserDistance(data) {
    try {
      if (data.user_id && data.main_subcategory_id && data.distance) {
        const productsList = [];

        const user = await User.getUserById(data.user_id);

        const subCategory = await SubCategory.getSubCategoryById(
          data.main_subcategory_id
        );
        if (subCategory && user) {
          const productObjects = await SubCategory.findProducts(
            subCategory.products
          );
          console.log("subCategory products Ids", subCategory.products);
          console.log("Distance given", data.distance);

          if (productObjects && productObjects.length > 0) {
            for (const product of productObjects) {
              const distanceUserProduct = await calculateDistance(
                user.latitude,
                user.longitude,
                product.latitude,
                product.longitude
              );
              console.log(
                "user.latitude,user.longitude,product.latitude,product.longitude",
                user.latitude,
                user.longitude,
                product.latitude,
                product.longitude
              );

              console.log(
                "distance User Product",
                user.name,
                product.name,
                distanceUserProduct
              );

              if (distanceUserProduct <= data.distance) {
                const item = {
                  product_id: product.product_id,
                  product_name: product.name || "",
                };
                productsList.push(item);
              }
            }
          }
          console.log("Available products : ", productsList);
        } else {
          return { code: 726 };
        }
        return { code: 900, productsList: productsList };
      } else if (!data.user_id) {
        return { code: 730 };
      } else if (!data.distance) {
        return { code: 731 };
      } else {
        return { code: 725 };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async trendingProducts() {
    try {
      const productList = await Product.Product.find()
        .limit(50) // Limit to the top 50 products
        .sort({ num_of_sale: -1 });
      console.log("shopList", productList);
      return { productsList: productList, code: 732 };
    } catch (error) {
      return { code: 425 };
    }
  }

  async trendingProductsByCategory(data) {
    // try {
    if (data.category_id) {
      console.log(data.category_id);
      const productList = await Product.Product.find({
        category_id: data.category_id,
      })
        .limit(50) // Limit to the top 50 products
        .sort({ num_of_sale: -1 });
      console.log("shopList", productList);
      return { productsList: productList, code: 732 };
    } else {
      return { code: 711 };
    }
    // } catch (error) {
    //   return { code: 425 };
    // }
  }

  async trendingProductsByLocation(data) {
    // try {
    if (data.latitude && data.longitude && data.distance) {
      const productList = await Product.Product.find().sort({
        num_of_sale: -1,
      });
      console.log("Products List", productList);
      const filteredProducts = [];
      for (const product of productList) {
        const distanceUserProduct = await calculateDistance(
          data.latitude,
          data.longitude,
          product.latitude,
          product.longitude
        );

        console.log(
          "user.latitude,user.longitude,product.latitude,product.longitude",
          data.latitude,
          data.longitude,
          product.latitude,
          product.longitude
        );

        if (distanceUserProduct <= data.distance) {
          filteredProducts.push(product);
        }
      }

      console.log("filtered Products", filteredProducts);
      return { productsList: filteredProducts, code: 732 };
    } else if (!(data.latitude && data.longitude)) {
      return { code: 719 };
    } else {
      return { code: 731 };
    }
    // } catch (error) {
    //   return { code: 425 };
    // }
  }

  /*********************************************** CART ***********************************/

  async addToCart(data) {
    // console.log("data",data)
    // try {
    if (Array.isArray(data.products) && data.user_id && data.category_id && data.userUid) {
      let productsList = [];
      let category_id;
      // let shop_id;

      const newCart = new Cart.Cart({
        user_id: data.user_id,
        category_id: data.category_id,
        userUid: data.userUid,
      });      
      
      let amount = 0;
      // let commonShopId = null;

      for (const productData of data.products) {

        if (!productData.product_id)
        {
          return { code : 718}
        }
        if (!productData.quantity)
        {
          return { code : 757}
        }

        const product = await Product.getProductById(productData.product_id);

        if (!product || product.category_id !== data.category_id) {
          return { code: 741 }; 
        }

        if (productData.quantity > product.quantity) {
          return { code: 740 }; 
        }
        category_id = product.category_id

        // if (commonShopId === null) {
        //   commonShopId = product.shop_id;
        // } else if (commonShopId !== product.shop_id) {
        //   return { code: 758 }; 
        // }
        
        // shop_id = commonShopId

        // newCart.category_id = product.category_id
        amount += (product.unit_price * productData.quantity);
        console.log("productData.unit_price",product.unit_price)
        newCart.products.push({
          _id: product._id,
          product_id : product.product_id,
          quantity: productData.quantity,
          shop_id : productData.shop_id
        });

        // product.quantity -= productData.quantity;
        // await product.save();
        // console.log()
        productsList.push(product.toObject());
      }

      // await newCart.save();
      
      // const product = await Product.getProductById(data.product_id);
      const user =
      (await User.getUserById(data.user_id)) ||
      (await User.getUserByUserUid(data.userUid));

      if ( user) {
        
        await newCart.save();
        user.cart_id = newCart.cart_id;
        await user.save()
        

        const updatedCart = await Cart.populateCategoryId(
          category_id,
          newCart.cart_id
        );

        const newUpdateCart = await Cart.populateUserId(
          data.user_id,
          updatedCart.cart_id
        );
        
        console.log("amount",amount)
        const finalUpdateCart = await Cart.populateAmount(
          amount,
          newUpdateCart.cart_id
        );

        // const finalUpdateCart = await Cart.populateShopId(
        //   shop_id,
        //   newUpdateCart.cart_id
        // );

        // newUpdateCart.amount = amount;
        // newUpdateCart.list = productsList;
        // console.log("newUpdateCart", newUpdateCart)

        await finalUpdateCart.save();
        
        const updatedCartWithNewFields = { ...finalUpdateCart.toObject(),'list':productsList  };
        // console.log("updatedCartWithNewFields",updatedCartWithNewFields)
        
        return {
          data: updatedCartWithNewFields,
          code: 669,
        };
      } else  {
        return { code: 404 };
      } 

    } else if (!(Array.isArray(data.products))) {
      return { code: 756 };
    } else if (!data.category_id) {
      return { code: 711 };
    } else {
      return { code: 730 };
    }
    // } catch (error) {
    //   return { code: 670 };
    // }
  }

  async placeOrder(data) {
    // try {
      console.log("data incoming" , data)
      // console.log("placeorder repo")
      if (data.user_id) {
        const user =(await User.getUserById(data.user_id)) || (await User.getUserByUserUid(data.userUid));
        
        // if (!user)
        // {
        //   return {code : 461}
        // }

        const cart = await Cart.getCartById(user.cart_id)
        if(!cart)
        {
          return {code : 759 }
        }
        // const product_id = cart.product_id
        const products = cart.products
        console.log("cart Products: ",products)
        const user_id = cart.user_id
        const userUid = cart.userUid
        // const shop_id = cart.shop_id
        const quantity = cart.quantity
        const total_amount = cart.amount
        // for (const productData of products)
        // {
          
        // }
        console.log("cart details: ", cart)
        for (const productData of products)
        {
          
          const product = await Product.getProductById(productData.product_id);
          if (product ) {
            if (product.quantity > 0) {
              product.num_of_sale += quantity;
              product.quantity -= quantity;
              product.save();
              user.products_bought.push(product._id);
            } else {
              return { code: 734 };
            }
          } else {
            return { code: 735 };
          }
        }

        user.save();
        const newOrder = Order.Order({
          user_id : user_id,
          // shop_id : shop_id,
          products : products,
          userUid : userUid,
          total_amount : total_amount,
          status : "Placed"
        })
        await newOrder.save()
        await Cart.Cart.deleteOne({ cart_id: cart.cart_id });
        return { code: 753 , data : newOrder};

      } else {
        return { code: 730 };
      }
    // } catch (error) {
    //   return { code: 1100 };
    // }
  }

  

  async completeOrder(data) {
    try {
      console.log("completeorder repo")
      if (data.order_id ) {
        const order = await Order.getOrderById(data.order_id)
        
        if (order)
        {
          order.status = "Completed"
          await order.save()
          return { code: 754 , data : order };
        }

      } else {
        return { code: 755 };
      }
    } catch (error) {
      return { code: 425 };
    }
  }


  async orderDetails(data) {
    try {
      if (data.order_id) {
        // console.log("name and image present");
        const order = await Order.getOrderById(data.order_id);

        if (order) {
          const data = order;

          return {
            data: data,
            code: 671,
          };
        } else {
          return { code: 738 };
        }
      } else {
        return { code: 739 };
      }
    } catch (error) {
      console.error(error);
      return { code: 1100 };
    }
  }





  async cartListing() {
    try {
      // console.log(Category.Category);
      const cartList = await Cart.Cart.find();
      // console.log("shopList", shopList);
      return { list: cartList, code: 742 };
    } catch (error) {
      return { code: 425 };
    }
  }

  async cartDetails(data) {
    try {
      if (data.cart_id) {
        // console.log("name and image present");
        const cart = await Cart.getCartById(data.cart_id);

        if (cart) {
          const data = cart;

          // let productsList = [];

          // const productObjects = await Shop.findProducts(products);
          // if (productObjects && productObjects.length > 0) {
          //   productObjects.forEach((product) => {
          //     const item = {
          //       product_id: product.product_id,
          //       product_name: product.name || "",
          //     };
          //     productsList.push(item);
          //   });
          // }

          return {
            data: data,
            code: 671,
          };
        } else {
          return { code: 738 };
        }
      } else {
        return { code: 739 };
      }
    } catch (error) {
      console.error(error);
      return { code: 1100 };
    }
  }

  async checkout(data) {
    // try {
    if (data.cart_id) {
      const cart = await Cart.getCartById(data.cart_id);
      console.log(cart);
      if (cart) {
        // Cart
        await Cart.Cart.deleteOne({ cart_id: cart.cart_id });
        return { code: 683 };
      } else {
        return { code: 738 };
      }
    } else {
      return { code: 739 };
    }
    // } catch (error) {
    //   return { code: 670 };
    // }
  }

  /*********************************************** ADVERTISEMENT ***********************************/

  async createAdvertisement(data) {
    console.log(data);
    try {

      if (data.name && data.category_id) {
        console.log("name and image present");
        const newAdvertisement = new Advertisement.Advertisement(data);
        const category = await Category.getCategoryById(data.category_id);
        if (!category) {
          return { code: 714 };
        }
        await newAdvertisement.save();
        console.log(newAdvertisement);
        return { data: newAdvertisement, code: 743 };
      } else if (!data.name) {
        return { code: 708 };
      } else {
        return { code: 711 };
      }
    } catch (error) {
      return { code: 1100 };
    }
  }

  async advertisementListing() {
    try {
      const advertisementList = await Advertisement.Advertisement.find();
      return { list: advertisementList, code: 678 };
    } catch (error) {
      return { code: 425 };
    }
  }

  async advertisementListingByCategory(data) {
    // try {
    // const { category_id } = data;
    if (data.category_id) {
      const advertisementList =
        await Advertisement.getAdvertisementsByCategoryId(data.category_id);

      console.log("advertisementList", advertisementList);
      return { list: advertisementList, code: 678 };
    } else {
      return { code: 711 };
    }
    // console.log(Category.Category);
    // } catch (error) {
    //   return { code: 425 };
    // }
  }

    /*********************************************** FAQ ***********************************/

    async createFaq(data) {
      try {
        console.log("Create category api repo hit");
  
        if (data.question && data.answer) {
          const newFaq = new Faq.Faq(data);
          await newFaq.save();
          console.log(newFaq);
          return { data: newFaq, code: 745 };
        } else if (data.question == "") {
          return { code: 746 };
        } else {
          return { code: 747 };
        }
      } catch (error) {
        return { code: 1100 };
      }
    }

    async faqListing() {
      try {
        const faqList = await Faq.Faq.find();
        return { list: faqList, code: 900 };
      } catch (error) {
        return { code: 1100 };
      }
    }

  /******************************************** END OF FUNCTION ********************************************/
}

async function calculateDistance(lat1, lon1, lat2, lon2) {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle) => angle * (Math.PI / 180);
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Radius of the Earth in kilometers
  const R = 6371;

  // Calculate the distance
  const distance = R * c;

  return distance;
}

// async function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = degToRad(lat2 - lat1);
//   const dLon = degToRad(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(degToRad(lat1)) *
//       Math.cos(degToRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in kilometers
//   return distance;
// }

// function degToRad(deg) {
//   return deg * (Math.PI / 180);
// }

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
