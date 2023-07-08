import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
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
    },
    shippingAddress: {
      address: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
    },
    paymentMode: { type: String, default: "" },
    paymentDetails: {
      id: { type: String },
      email_address: { type: String },
      atTime: { type: String },
    },
    paymentStatus: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveryStatus: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);
export default mongoose.model("Order", OrderSchema);
