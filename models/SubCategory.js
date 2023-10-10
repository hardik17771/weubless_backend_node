const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    main_subcategory_id: { type: Number, unique: true },
    name: String,
    category_id: {
      type: Number,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

subCategorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const count = await this.constructor.countDocuments({});
    this.main_subcategory_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = { SubCategory };
