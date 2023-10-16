import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import the necessary module
import multer from "multer";
import postController from "../controller/postController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Calculate the directory path

const postRoute = express.Router();

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Images/CardsImages")); // Use the calculated __dirname
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

postRoute.post("/add-post", upload.array("image"), postController.add_Post);
postRoute.get("/get-blog-posts", postController.getAllPosts);
postRoute.get(
  "/get-blog-posts/category/:category",
  postController.getCategoryPosts
);
postRoute.get("/get-blog-posts/:postId", postController.getSpecificPost);
postRoute.put(
  "/update-blogById/:id",
  upload.single("image"),
  postController.updateById
);
postRoute.delete("/delete-blogById/:id", postController.deleteById);
postRoute.get("/getauthorpost/:authorName", postController.getPostsByAuthor);
export default postRoute;
