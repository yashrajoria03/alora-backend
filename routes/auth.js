import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
// import passport from "passport";
// import gs from "passport-google-oauth20";

// const GoogleStrategy = gs.Strategy();

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
  });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
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
