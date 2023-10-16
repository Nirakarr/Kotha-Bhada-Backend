import userValidation from "../Validations/userValidation.js";
import hashPassword, { comparePassword } from "../helpers/authuserHelpers.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import Token from "../models/token.js";
export const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the request body against the userValidation schema
    const validation = userValidation.validate(req.body);

    if (validation.error) {
      return res.status(400).send({ error: validation.error.message });
    }

    // Check if model already exists
    const existingModel = await userModel.findOne({ email });

    if (existingModel) {
      return res.status(409).send({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create and save the model using the create method
    const newModel = await userModel.create({
      email,
      password: hashedPassword,
      retypePassword: hashedPassword,
    });

    // Generate a JWT token for the newly registered user
    const token = await JWT.sign(
      { _id: newModel._id },
      process.env.JWT_SECRET_USER,
      {
        expiresIn: "120d",
      }
    );

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      model: newModel,
      token, // Include the token in the response
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
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare the provided password with the hashed password from the database
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate access token
    const accessToken = JWT.sign(
      { _id: user._id },
      process.env.ACCESS_SECRET_KEY_USER,
      { expiresIn: "15m" }
    );

    // Generate refresh token
    const refreshToken = JWT.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET_KEY_USER
    );

    // Save the refresh token to the database
    const newToken = new Token({ token: refreshToken });
    await newToken.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      name: user.name,
      email: user.email,
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

export const allUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};
