import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import { createError } from "../utils/error.js";
// import passport from "passport";
import jwt from "jsonwebtoken";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import passport from "passport";
// import gs from "passport-google-oauth20";

// const GoogleStrategy = gs.Strategy();

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email,
  });
  try {
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = newUser._doc;
    res
      .cookie("access_token", token)
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "user not found."));
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword)
      return next(createError(401, "Incorrect username or password."));

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token)
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (err) {
    next(err);
  }
});

router.post("/google/register", async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomstring.generate(10), salt);
  const newUser = new User({
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email,
    image: req.body.profile,
  });
  try {
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        isAdmin: newUser.isAdmin,
      },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = newUser._doc;
    res
      .cookie("access_token", token)
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (err) {
    next(err);
  }
});

router.post("/google/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token)
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (err) {
    next(err);
  }
});

// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.status(200).json({
//       error: false,
//       message: "Successfully Loged In",
//       user: req.user,
//     });
//   } else {
//     res.status(403).json({ error: true, message: "Not Authorized" });
//   }
// });

// router.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     error: true,
//     message: "Log in failure",
//   });
// });

// router.get("/google", passport.authenticate("google", ["profile", "email"]));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: process.env.GOOGLE_CLIENT_URL,
//     failureRedirect: "/login/failed",
//   })
// );

// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect(process.env.CLIENT_URL);
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: GOOGLE_CALLBACK_URL,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       const user = {
//         id: profile.id,
//         username: profile.displayName,
//         email: profile.emails[0].value,
//       };
//       return done(null, user);
//     }
//   )
// );

export default router;
