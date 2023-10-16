import express from "express";
import {
  registerController,
  loginController,
  getAllAdmin,
} from "../controller/adminController.js";
// import { isAdmin, requireSignIn } from "../middleware/adminMiddleware.js";

//regular object
const router = express.Router();

//routing
//Register || Method Post
router.post("/signup", registerController);
// LOGIN POST
router.post("/login", loginController);
// Token Authorization

// router.get("/blog", requireSignIn, isAdmin, testController);
// router.post("/addProducts", requireSignIn, isAdmin, testController);
router.get("/getAllAdmins", getAllAdmin);

export default router;
