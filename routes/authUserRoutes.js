import express from "express";
import {
  registerController,
  loginController,
  testController,
  allUsers,
} from "../controller/userController.js";
import { isUser, requireSignIn } from "../middleware/userMiddleware.js";

//regular object
const router = express.Router();

//routing
//Register || Method Post
router.post("/signup", registerController);
// LOGIN POST
router.post("/login", loginController);
// Token Authorization
router.post("/auth/test", requireSignIn, isUser, testController);
// All Users
router.get("/getAllUsers", allUsers);
export default router;
