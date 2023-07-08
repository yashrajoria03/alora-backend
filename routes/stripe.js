import stripe from "stripe";
import express from "express";

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = [];
  // console.log(items);
  // items.forEach((ele) => {
  //   lineItems.push({ price: ele.productId, quantity: ele.quantity });
  // });
  const session = await Stripe.checkout.sessions.create(
    {
      line_items: req.body.items,
      mode: "payment",
      success_url: "https://alora-store.netlify.app/success",
      cancel_url: "https://alora-store.netlify.app/cancel",
    },
    {
      // Provide your Stripe API key here
      apiKey:
        "sk_test_51LYVLbSAyvMVxYE2FaQQOpJAvIf8wTh0jl1d04EAUI4I9SKLC0daTgNqAx1HccBswTetBtl6IMyxXazlQ514tsn600vrRzuedB",
    }
  );
  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

export default router;

// import express from "express";
// import Stripe from "stripe";

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post("/checkout", async (req, res) => {
//   const items = req.body.items;
//   let lineItems = items.map((ele) => ({
//     price: ele.price,
//     quantity: ele.quantity,
//   }));

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({
//         error: "An error occurred while creating the Stripe Checkout session.",
//       });
//   }
// });

// export default router;
