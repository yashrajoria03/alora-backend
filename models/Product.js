import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    brand: { type: String, required: true },
    coverImage: { type: String, required: true },
    allImage: [{ type: String }],
    categories: { type: String, default: "" },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    rating: { type: Number },
    numReviews: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    offers: [
      {
        offerType: { type: String },
        offerDesc: { type: String },
      },
    ],
    reviews: [
      {
        username: {
          type: String,
        },
        title: {
          type: String,
        },
        star: {
          type: Number,
        },
        review: {
          type: String,
        },
        profile: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Product", ProductSchema);
