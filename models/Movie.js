const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    genres: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);