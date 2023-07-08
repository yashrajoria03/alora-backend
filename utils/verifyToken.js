import jwt from "jsonwebtoken";
// import { createError } from "./error.js";

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.token;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.JWT, (err, user) => {
//       if (err) res.status(403).json("Token is not valid!");
//       req.user = user;
//       next();
//     });
//   } else {
//     return next(createError(401, "you are not authenticated."));
//   }
// };

// export const verifyAdmin = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else return next(createError(403, "forbidden action."));
//   });
// };

// export const verifyUser = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       return next(createError(403, "you are not authenticated."));
//     }
//   });
// };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log("auth headers:", authHeader);
  // console.log("auth:", req.cookies);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log(token);
    // console.log(jwt.decode(token));
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      console.log("user verified!");
      next();
    } else {
      return res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You are not alowed to do that!");
    }
  });
};
