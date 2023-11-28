const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    is_deleted: Boolean,
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
    versionKey: false,
  }
);

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = { ContactUs };
