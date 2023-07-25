import Cart from "../models/Cart.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

//get cart
router.get("/find/:id/:token", verifyUser, async (req, res, next) => {
  const userId = req.params.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      res.status(201).json(cart);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("something went wrong");
  }
});

//add to cart
router.post("/:id/:token", verifyUser, async (req, res, next) => {
  const userId = req.params.id;
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    const product = await Product.findOne({ _id: productId });
    if (!product) res.status(404).json("product not found!");
    const price = product.price;
    const name = product.title;
    const img = product.coverImage;
    if (cart) {
      //cart exist
      const itemIndex = cart.items.findIndex((p) => p.productId === productId);
      if (itemIndex > -1) {
        const productItem = cart.items[itemIndex];
        productItem.quantity += Number(quantity);
        cart.items[itemIndex] = productItem;
      } else {
        cart.items.push({ productId, name, img, quantity, price });
      }
      cart.total += quantity * price;
      await cart.save();
      res.status(201).json(cart);
    } else {
      // no cart exists, create one
      const newCart = await Cart.create({
        userId,
        items: [{ productId, name, img, quantity, price }],
        total: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
  }
});

//delete item

router.delete("/:id/:itemId/:token", verifyUser, async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.itemId;
  try {
    const cart = await Cart.findOne({ userId });
    const itemIndex = cart.items.findIndex((p) => p.productId === productId);
    if (itemIndex > -1) {
      const productItem = cart.items[itemIndex];
      if (productItem.quantity >= 1) {
        cart.total -= productItem.quantity * productItem.price;
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      res.status(201).json(cart);
    }
    await cart.save();
    res.status(201).json(Cart);
  } catch (err) {
    console.log(err);
  }
});
router.delete("/:id/:token", verifyUser, async (req, res) => {
  const userId = req.params.userId;
  try {
    const cart = await Cart.findOne({ userId });
    const cartId = cart._id;
    // console.log(userId, cartId);
    await Cart.findByIdAndDelete(cartId);
    res.status(200).json({ message: "Cart deleted" });
  } catch (err) {
    console.log(err);
  }
});
export default router;
