import JWT from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

// Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(req.headers.authorization, process.env.JWTSECRET);
    req.admin = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const admin = await adminModel.findById(req.user._id);
    if (admin.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in Admin MiddleWare",
    });
  }
};
