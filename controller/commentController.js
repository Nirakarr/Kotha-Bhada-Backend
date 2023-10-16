import Comment from "../models/commentModel.js";
// Create a new comment
const createComment = async (req, res) => {
  try {
    const { name, email, comment } = req.body;
    const newComment = new Comment({ name, email, comment });
    await newComment.save();
    res.status(200).json({
      success: true,
      msg: "Card added successfully",
      data: newComment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single comment by ID
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment by ID
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndRemove(id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export default {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
