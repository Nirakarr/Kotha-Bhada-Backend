import express from "express";
import commentController from "../controller/commentController.js";

const commentRoute = express.Router();

// Create a new comment
commentRoute.post("/post", commentController.createComment);

// Get all comments
commentRoute.get("/comments", commentController.getAllComments);

// Get a single comment by ID
commentRoute.get("/comments/:id", commentController.getCommentById);

// Update a comment by ID
commentRoute.put("/comments/:id", commentController.updateComment);

// Delete a comment by ID
commentRoute.delete("/comments/:id", commentController.deleteComment);

export default commentRoute;
