const mongoose = require("mongoose");

// Define the schema for Advertisement
const faqSchema = new mongoose.Schema(
  {
    faq_id: String,
    question: String,
    answer: String,
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

faqSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const max = await this.constructor.findOne({}, { faq_id: 1 })
    .sort({ faq_id: -1 })
    .limit(1)
    .lean();

  
    this.faq_id = max ? max.faq_id + 1 : 1;

    next();
  } catch (error) {
    next(error);
  }
});

const getFaqById = async (faq_id) => {
  try {
    const faq = await Faq.findOne({ faq_id }).exec();
    return faq;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const Faq = mongoose.model("Faq", faqSchema);

module.exports = {
  Faq,
  getFaqById,
};
