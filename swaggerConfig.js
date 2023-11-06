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
        User: {
          type: "object",
          properties: {
            username: { type: "string" },
            name: { type: "string" },
            country_code: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            user_type: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
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
            quantity: { type: "number" },
            added_by: { type: "string" },
            category_id: { type: "number" },
            main_subcategory_id: { type: "number" },
            shop_id: { type: "number" },
            latitude: { type: "string" },
            longitude: { type: "string" },
            user_id: { type: "string" },
            num_of_sale: { type: "number" },
            brand_id: { type: "string" },
            photos: { type: "string" },
            thumbnail_img: { type: "string" },
            featured_img: { type: "string" },
            flash_deal_img: { type: "string" },
            video_provider: { type: "string" },
            video_link: { type: "string" },
            tags: { type: "string" },
            description: { type: "string" },
            unit_price: { type: "number" },
            purchase_price: { type: "number" },
            choice_options: { type: "string" },
            colors: { type: "string" },
            variations: { type: "string" },
            todays_deal: { type: "number" },
            published: { type: "number" },
            featured: { type: "number" },
            current_stock: { type: "number" },
            unit: { type: "string" },
            discount: { type: "number" },
            discount_type: { type: "string" },
            tax: { type: "number" },
            tax_type: { type: "string" },
            shipping_type: { type: "string" },
            shipping_cost: { type: "number" },
            meta_title: { type: "string" },
            meta_description: { type: "string" },
            meta_img: { type: "string" },
            pdf: { type: "string" },
            slug: { type: "string" },
            rating: { type: "number" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Update with the path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
