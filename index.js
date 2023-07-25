import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";
import productRoute from "./routes/product.js";
import stripe from "./routes/stripe.js";
// import passport from "passport";
// import cookieSession from "cookie-session";
// import "./passport.js";
// import path from "path";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
// app.use(
//   cookieSession({
//     name: "session",
//     key: ["FBC44C16861FC4CE5D64B4A5DFCD3"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//       scope: ["profile", "email"],
//     },
//     function (accessToken, refreshToken, profile, callback) {
//       callback(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

mongoose.connection.on("diconnected", () => {
  console.log("disconnected from DB.");
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to db.");
  } catch (err) {
    console.log(err);
  }
};

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/stripe", stripe);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong.";
  return res.status(errorStatus).json({
    success: false,
    message: errorMessage,
    status: errorStatus,
    stack: err.stack,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(process.env.PORT || 8000, () => {
  connectDB();
  console.log("connected to server.");
});
