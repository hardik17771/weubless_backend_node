const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    file_original_name: String,
    file_name: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user2" },
    extension: String,
    type: String,
    file_size: Number,
  },
  { timestamps: true }
);

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
