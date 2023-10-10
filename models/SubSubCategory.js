const mongoose = require("mongoose");

const subSubCategorySchema = new mongoose.Schema(
  {
    subcategory_id: { type: Number, unique: true },
    name: { type: String, required: true },
    brands: String,
    main_subcategory_id: {
      type: Number,
      ref: "SubCategory",
      required: true,
    },
  },
  { timestamps: true }
);

subSubCategorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.subcategory_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = { SubSubCategory };
