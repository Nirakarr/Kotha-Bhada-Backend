import hashPassword, { comparePassword } from "../helpers/authadminHelpers.js";
import adminModel from "../models/adminModel.js";
import JWT from "jsonwebtoken";
import Token from "../models/token.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, retypePassword, phone, address } = req.body;

    if (!name || !email || !password || !retypePassword || !phone || !address) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Check if model already exists
    const existingModel = await adminModel.findOne({ email });

    if (existingModel) {
      return res.status(409).send({
        success: false,
        message: "Admin already registered. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    // Create and save the model using the create method
    const newModel = await adminModel.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      retypePassword: hashedPassword,
    });
    res.status(201).send({
      success: true,
      message: "Admin Registered Successfully",
      model: newModel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};

// POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Check if the email is registered
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare the provided password with the hashed password from the database
    const match = await comparePassword(password, admin.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate access token
    const accessToken = JWT.sign(
      { _id: admin._id },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "10m" }
    );

    // Generate refresh token
    const refreshToken = JWT.sign(
      { _id: admin._id },
      process.env.REFRESH_SECRET_KEY
    );

    // Save the refresh token to the database
    const newToken = new Token({ token: refreshToken });
    await newToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      name: admin.name,
      email: admin.email,
      // Add other user data you want to include in the response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Login",
      error: error.message,
    });
  }
};

export const testController = (req, res) => {
  res.send("Protected Route");
};
export const getAllAdmin = async (req, res) => {
  try {
    const allAdmin = await adminModel.find();
    res.status(200).json({ success: true, data: allAdmin });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};
