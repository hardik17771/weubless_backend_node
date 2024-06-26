const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    // servers: [
    //   {
    //     url: 'http://localhost:3000', // Update with your server URL
    //   },
    // ],
    components: {
      schemas: {
        Address: {
          type: "object",
          properties: {
            address_id: { type: "number" },
            user_id: { type: "number" },
            userUid: { type: "string" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            country: { type: "string" },
            state: { type: "string" },
            city: { type: "string" },
            pincode: { type: "string" },
            address: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            user_id: { type: "number" },
            username: { type: "string" },
            name: { type: "string" },
            userUid: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            user_type: { type: "number" },
            is_deleted: { type: "number" },
            dob: { type: "string", format: "date" },
            deviceToken: { type: "string" },
            profileImage: { type: "string" },
            products_bought: { type: "array", items: { type: "string" } },
            primary_address_index: { type: "number" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            country: { type: "string" },
            state: { type: "string" },
            city: { type: "string" },
            pincode: { type: "string" },
            address: { type: "string" },
            addresses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  latitude: { type: "string" },
                  longitude: { type: "string" },
                  country: { type: "string" },
                  state: { type: "string" },
                  city: { type: "string" },
                  pincode: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            category_id: { type: "number" },
            name: { type: "string" },
            banner: { type: "string" },
            icon: { type: "string" },
            feature: { type: "number" },
            subCategories: { type: "array" },
          },
        },
        SubCategory: {
          type: "object",
          properties: {
            main_subcategory_id: { type: "number" },
            name: { type: "string" },
            category_id: { type: "number" },
            products: { type: "array" },
          },
        },
        Product: {
          type: "object",
          properties: {
            product_id: { type: "number" },
            name: { type: "string" },
            added_by: { type: "string" },
            category_id: { type: "number" },
            main_subcategory_id: { type: "number" },
            shops: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  shop_id: { type: "number" },
                  quantity: { type: "number" },
                  shop_price: { type: "number" }
                },
                required: ["shop_id"]
              }
            },
            user_id: { type: "string" },
            total_quantity: { type: "number" },
            num_of_sale: { type: "number" },
            brand_id: { type: "string" },
            photos: { type: "string" },
            thumbnail_img: { type: "string" },
            unit_price: { type: "number" },
            mrp_price: { type: "number" }
            
          },
          required: ["product_id", "name", "main_subcategory_id"]
        },
        Shop: {
          type: "object",
          properties: {
            user_id: { "type": "string" },
            shop_id: { type: "number" },
            name: { type: "string" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "number" },
                  quantity: { type: "number" },
                  shop_price: { type: "number" }
                },
                required: ["product_id"]
              }
            },
            logo: { type: "string" },
            address: { type: "string" },
            facebook: { type: "string" },
            google: { type: "string" },
            twitter: { type: "string" },
            youtube: { type: "string" },
            instagram: { type: "string" },
            slug: { type: "string" }
            // ... (other fields)
          },
          required: ["shop_id", "name", "latitude", "longitude"]
        },
        Seller: {
          type: "object",
          properties: {
            seller_id: { type: "number" },
            name: { type: "string" },
            userUid: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            dob: { type: "string" },
            deviceToken: { type: "string" },
            profileImage: { type: "string" },
            shops_owned: { type: "array", items: { type: "object", properties: { shop_id: { type: "number" } } } },
            primary_address_index: { type: "number" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            country: { type: "string" },
            state: { type: "string" },
            city: { type: "string" },
            pincode: { type: "string" },
            address: { type: "string" },
            addresses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  latitude: { type: "string" },
                  longitude: { type: "string" },
                  country: { type: "string" },
                  state: { type: "string" },
                  city: { type: "string" },
                  pincode: { type: "string" },
                  address: { type: "string" },
                },
              },
            },
          },
          required: ["seller_id", "name", "userUid", "phone", "email", "dob", "deviceToken", "primary_address_index", "latitude", "longitude", "country", "state", "city", "pincode", "address"]
        },
        Cart: {
          type: "object",
          properties: {
            cart_id: { type: "number" },
            product_id: { type: "number" },
            user_id: { type: "number" },
            userUid: { type: "string" },
            category_id: { type: "number" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "number" },
                  quantity: { type: "number", default: 0 },
                  shop_id: { type: "number" },
                },
              },
            },
            price: { type: "number", default: 0 },
            tax: { type: "number", default: 0 },
            quantity: { type: "number", default: 0 },
            amount: { type: "number", default: 0 },
          },
        },
        Order: {
          type: "object",
          properties: {
            order_id: { type: "number" },
            user_id: { type: "number" },
            userUid: { type: "string" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "number" },
                  quantity: { type: "number", default: 0 },
                  shop_id: { type: "number" },
                },
              },
            },
            cart_id: { type: "number" },
            total_amount: { type: "number", default: 0 },
            status: { type: "string" },
          },
        },
        ContactUs: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            message: { type: "string" },
            is_deleted: { type: "boolean" },
          },
        },
        Advertisement: {
          type: "object",
          properties: {
            ad_id: { type: "string" },
            category_id: { type: "string" },
            name: { type: "string" },
            date_range: { type: "string" },
            amount: { type: "string" },
          },
        },
        Faq: {
          type: "object",
          properties: {
            faq_id: { type: "string" },
            question: { type: "string" },
            answer: { type: "string" },
          },
        },        
      },
    },
  },
  apis: ["./routes/*.js"], // Update with the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
