import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_USER
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// User access middleware
export const isUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // You can perform additional checks here if needed, e.g., user status, permissions, etc.

    next(); // Allow the user to access the protected route
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in User Middleware",
    });
  }
};
