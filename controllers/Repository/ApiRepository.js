const express = require("express");
const turf = require("@turf/turf");

const app = express();
const crypto = require("crypto");
const User = require("../../models/User");
const token = require("../../models/Token");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const SubSubCategory = require("../../models/SubSubCategory");
const Product = require("../../models/Product");
const Shop = require("../../models/Shop");

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
      const accessToken = this.access_token;

      if (data.user_id) {
        const user = await User.getUserById(data.user_id);
        if (user) {
          return {
            user_id: user.user_id,
            id: user.id,
            name: user.name,
            latitude: user.latitude,
            longitude: user.longitude,
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

  async categoryListing() {
    try {
      // console.log(Category.Category);
      const categoryList = await Category.Category.find();
      console.log("categoryList", categoryList);
      return categoryList;
    } catch (error) {
      throw new Error("Error fetching categories: " + error.message);
    }
  }

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

  async mainSubCategory(data) {
    const { category_id } = data;
    let subCategoriesList = [];
    try {
      const subCategoryIds = await Category.getSubCategoriesByCategoryId(
        category_id
      );

      const subCategoriesObjects = await Category.findSubCategories(
        subCategoryIds
      );
      if (subCategoriesObjects && subCategoriesObjects.length > 0) {
        subCategoriesObjects.forEach((subCategory) => {
          const item = {
            main_subcategory_id: subCategory.main_subcategory_id,
            main_subcategory: subCategory.name || "",
          };
          subCategoriesList.push(item);
        });
        return { code: 689, subCategoriesList: subCategoriesList };
      } else {
        return { code: 715, subCategoriesList: subCategoriesList };
      }
    } catch (error) {
      return { code: 642, subCategoriesList: subCategoriesList };
    }
  }

  async createSubSubCategory(data) {
    try {
      console.log("Create sub category api repo hit");

      if (data.name && data.main_subcategory_id) {
        const newSubSubCategory = new SubSubCategory.SubSubCategory(data);
        // console.log("new category present");

        const subCategory = await SubCategory.getSubCategoryById(
          data.main_subcategory_id
        );
        if (subCategory) {
          subCategory.subsubCategories.push(newSubSubCategory._id);
          await subCategory.save();
          await newSubSubCategory.save();
        } else {
          return { code: 726 };
        }

        // console.log(newSubCategory);
        return { data: newSubSubCategory, code: 712 };
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

  async SubCategory(data) {
    const { main_subcategory_id } = data;
    let subSubCategoriesList = [];
    try {
      const subSubCategoryIds =
        await SubCategory.getSubSubCategoriesByMainSubCategoryId(
          main_subcategory_id
        );
      const subSubCategoriesObjects = await SubCategory.findSubSubCategories(
        subSubCategoryIds
      );

      if (subSubCategoriesObjects && subSubCategoriesObjects.length > 0) {
        for (const subSubCategory of subSubCategoriesObjects) {
          let productsList = [];
          const productIds = await SubSubCategory.getProdutsBySubCategoryId(
            subSubCategory.subcategory_id
          );
          const productObjects = await SubSubCategory.findProducts(productIds);

          if (productObjects && productObjects.length > 0) {
            for (const product of productObjects) {
              const productItem = {
                product_id: product.product_id,
                subcategory: product.name || "",
              };
              productsList.push(productItem);
            }
          }

          const item = {
            subcategory_id: subSubCategory.subcategory_id,
            subcategory: subSubCategory.name || "",
            products: productsList,
          };
          subSubCategoriesList.push(item);
        }

        return { code: 689, subSubCategoriesList: subSubCategoriesList };
      } else {
        return { code: 715, subSubCategoriesList: subSubCategoriesList };
      }
    } catch (error) {
      return { code: 642, subSubCategoriesList: subSubCategoriesList };
    }
  }

  async createProduct(data) {
    // try {
    console.log("Create newProduct api repo hit");
    console.log("name is ", data.name);
    console.log("data is ", data);
    if (data.name && data.subcategory_id && data.shop_id) {
      // console.log("name and image present");
      const newProduct = new Product.Product(data);

      const subSubCategory = await SubSubCategory.getSubSubCategoryById(
        data.subcategory_id
      );
      const shop = await Shop.getShopById(data.shop_id);

      // console.log(subSubCategory.main_subcategory_id);

      if (subSubCategory && shop) {
        // Sub Sub Categories
        const mainSubcategoryId = subSubCategory.main_subcategory_id;
        subSubCategory.products.push(newProduct._id);
        await subSubCategory.save();

        // Sub Category
        const subCategory = await SubCategory.getSubCategoryById(
          mainSubcategoryId
        );
        subCategory.products.push(newProduct._id);
        await subCategory.save();
        console.log(subCategory);

        // Shop
        console.log("shop data is", shop);
        const lat = shop.latitude;
        const long = shop.longitude;
        console.log("shop lat long is", lat, long);
        shop.products.push(newProduct._id);
        await shop.save();

        await newProduct.save();
        // console.log(newProduct);

        const updated_product = await Product.populateMainSubcategory(
          mainSubcategoryId,
          newProduct.product_id
        );

        const new_updated_product = await Product.populateLatLong(
          lat,
          long,
          updated_product.product_id
        );

        return { data: new_updated_product, code: 716 };
      } else if (!subSubCategory) {
        return { code: 727 };
      } else {
        return { code: 723 };
      }
      // await newProduct.save();
      // console.log("new newProduct present");
      // await newProduct.save();
      // console.log(newProduct);
    } else if (!data.subcategory_id) {
      return { code: 725 };
    } else if (!data.shop_id) {
      return { code: 723 };
    } else {
      return { code: 708 };
    }
    // } catch (error) {
    //   return { code: 717 };
    // }
  }

  async productDetails(data) {
    try {
      if (data.product_id) {
        console.log("name and image present");
        const product = await Product.getProductById(data.product_id);

        if (product) {
          const {
            name,
            createdAt,
            updatedAt,
            product_id,
            main_subcategory_id,
            subcategory_id,
            latitude,
            longitude,
            quantity,
            added_by,
            user_id,
            category_id,
            brand_id,
            photos,
            thumbnail_img,
            featured_img,
            flash_deal_img,
            video_provider,
            video_link,
            tags,
            description,
            unit_price,
            purchase_price,
            choice_options,
            colors,
            variations,
            todays_deal,
            published,
            featured,
            current_stock,
            unit,
            discount,
            discount_type,
            tax,
            tax_type,
            shipping_type,
            shipping_cost,
            num_of_sale,
            meta_title,
            meta_description,
            meta_img,
            pdf,
            slug,
            rating,
          } = product;

          return {
            data: {
              name,
              createdAt,
              updatedAt,
              product_id,
              main_subcategory_id,
              subcategory_id,
              latitude,
              longitude,
              quantity,
              added_by,
              user_id,
              category_id,
              brand_id,
              photos,
              thumbnail_img,
              featured_img,
              flash_deal_img,
              video_provider,
              video_link,
              tags,
              description,
              unit_price,
              purchase_price,
              choice_options,
              colors,
              variations,
              todays_deal,
              published,
              featured,
              current_stock,
              unit,
              discount,
              discount_type,
              tax,
              tax_type,
              shipping_type,
              shipping_cost,
              num_of_sale,
              meta_title,
              meta_description,
              meta_img,
              pdf,
              slug,
              rating,
            },
            code: 664,
          };
        } else {
          return { code: 422 }; // Assuming 422 is the appropriate error code
        }
      } else {
        return { code: 718 }; // Assuming 422 is the appropriate error code
      }
    } catch (error) {
      console.error(error);
      return { code: 642 };
    }
  }

  async productsFromSubCategoryId(data) {
    const { subcategory_id } = data;
    let productsList = [];
    try {
      const productIds = await SubSubCategory.getProdutsBySubCategoryId(
        subcategory_id
      );

      const productObjects = await SubSubCategory.findProducts(productIds);
      if (productObjects && productObjects.length > 0) {
        productObjects.forEach((product) => {
          const item = {
            product_id: product.product_id,
            product_name: product.name || "",
          };
          productsList.push(item);
        });
        return { code: 684, productsList: productsList };
      } else {
        return { code: 728, productsList: productsList };
      }
    } catch (error) {
      return { code: 642, productsList: productsList };
    }
  }

  async createShop(data) {
    console.log(data);
    try {
      console.log("Create newShop api repo hit");
      console.log("name is ", data.name);
      console.log("data is ", data);
      if (data.name && data.latitude && data.longitude) {
        console.log("name and image present");
        const newShop = new Shop.Shop(data);
        console.log("new newShop present");
        await newShop.save();
        console.log(newShop);
        return { data: newShop, code: 720 };
      } else if (!data.name) {
        return { code: 708 };
      } else {
        return { code: 719 };
      }
    } catch (error) {
      return { code: 721 };
    }
  }

  async shopDetails(data) {
    try {
      if (data.shop_id) {
        console.log("name and image present");
        const shop = await Shop.getShopById(data.shop_id);

        if (shop) {
          const {
            name,
            createdAt,
            updatedAt,
            shop_id,
            latitude,
            longitude,
            products,
            // user_id,
          } = shop;

          let productsList = [];

          const productObjects = await Shop.findProducts(products);
          if (productObjects && productObjects.length > 0) {
            productObjects.forEach((product) => {
              const item = {
                product_id: product.product_id,
                product_name: product.name || "",
              };
              productsList.push(item);
            });
          }

          return {
            data: {
              name,
              createdAt,
              updatedAt,
              shop_id,
              latitude,
              longitude,
              productsList,
              // user_id,
            },
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

              console.log("distance User Product", distanceUserProduct);

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

  /******************************************** END OF FUNCTION ********************************************/
}

function calculateDistance(lat1, lon1, lat2, lon2) {
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
