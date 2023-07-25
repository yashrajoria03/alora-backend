import { isObjectIdOrHexString } from "mongoose";
import Product from "../models/Product.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import express from "express";
const router = express.Router();

//CREATE
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
// router.delete("/:id", verifyAdmin, async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.status(200).json("Product has been deleted...");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//add review

router.put("/review/:proId/:id/:token", verifyUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.proId);

    const totalRating = product.rating * product.reviews.length + req.body.star;
    const newNumReviews = product.reviews.length + 1;
    const newRating = totalRating / newNumReviews;

    // Update the product with the new values
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.proId,
      {
        $push: { reviews: req.body },
        $inc: { [`numReviews.${req.body.star}`]: 1 },
        $set: { rating: newRating },
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/?qSearch", async (req, res) => {
  const qSearch = req.query.search;
  try {
    let products;
    if (qSearch) {
      products = await Product.find({ $text: { $search: qSearch } });
    } else {
      products = await Product.find().sort({ createdAt: -1 }).limit(10);
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete", verifyAdmin, async (req, res) => {
  try {
    await Product.deleteMany({});

    res.status(200).json({ message: "All products deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
