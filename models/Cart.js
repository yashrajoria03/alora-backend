import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: {
          type: String,
        },
        name: {
          type: String,
          trim: true,
        },
        img: {
          type: String,
        },
        quantity: {
          type: Number,
          required: 1,
          min: [1, "Quantity can not be less than 1"],
          default: 1,
        },
        price: {
          type: Number,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
