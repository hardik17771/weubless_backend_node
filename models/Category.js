const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_id: { type: Number, unique: true },
    name: { type: String, required: true },
    banner: String,
    icon: String,
    image: { type: String, required: true },
    featured: Number,
    top: Number,
  },
  { timestamps: true }
);

// Define a pre-save middleware to handle auto-incrementing category_id
categorySchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      // If the document is not new, don't do anything
      return next();
    }

    // Find the current count of documents and use it as the next category_id
    const count = await this.constructor.countDocuments({});
    this.category_id = count + 1;
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category };
