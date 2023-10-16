import postValidation from "../Validations/postValidations.js";
import Post from "../models/postModels.js";

const add_Post = async (req, res) => {
  try {
    if (!Array.isArray(req.files)) {
      throw new Error("No files were uploaded.");
    }

    const arrImages = req.files.map((file) => file.filename);

    // Validate the request body using the Joi schema
    const { error } = postValidation.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ success: false, msg: error.details[0].message });
    }

    const newPost = new Post({
      post_id: req.body.post_id,
      username: req.body.username,
      location: req.body.location,
      contactno: req.body.contactno,
      description: req.body.description,
      category: req.body.category,
      image: arrImages,
    });

    const savedPost = await newPost.save();
    res
      .status(200)
      .json({ success: true, msg: "Post added successfully", data: savedPost });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

/**
 * Getting all post
 * @param {} req
 * @param {} res
 */
const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.status(200).json({ success: true, data: allPosts });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

/**
 * Getting Specific Post from params.id
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getSpecificPost = async (req, res) => {
  try {
    const postId = req.params.postId; // Get the post ID from the URL parameter
    const getByID = await Post.findById(postId); // Use findById to fetch the post by its ID
    if (!getByID) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }
    res.status(200).json({ success: true, data: getByID });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

/**
 * Getting Category Api from /category
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getCategoryPosts = async (req, res) => {
  try {
    const category = req.params.category; // Get the category name from the URL parameter

    // Query for posts based on category
    const postsByCategory = await Post.find({
      category: { $regex: new RegExp(category, "i") }, // Case-insensitive query
    });

    if (!postsByCategory || postsByCategory.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "No posts found in this category" });
    }

    res.status(200).json({ success: true, data: postsByCategory });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

/**
 * update specific post by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateById = async (req, res) => {
  try {
    const updateId = req.params.id; // Get the card ID from the URL parameter

    // Check if the card exists by ID
    const existingPost = await Post.findById(updateId);

    if (!existingPost) {
      return res.status(404).json({ success: false, msg: "Card is not found" });
    }

    // Access form data from req.fields
    const formData = req.body;

    // Create an update object based on the form data
    const updateObject = {
      location: formData.location || existingPost.location,
      contactno: formData.contactno || existingPost.contactno,
      description: formData.description || existingPost.description,
      category: formData.category || existingPost.category,
    };

    // Handle image updates
    if (req.file && req.file.filename) {
      // Assuming the image field is named "image"
      const newImage = req.file.filename;
      updateObject.image = newImage; // Replace existing image with the new one
    }

    // Set the updatedDate to the current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    updateObject.updatedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // Use findByIdAndUpdate to update the card document
    const updatedPost = await Post.findByIdAndUpdate(updateId, updateObject, {
      new: true,
    });

    res.status(200).json({
      success: true,
      msg: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ success: false, msg: error.message });
  }
};

/**
 * Delete Specific Post by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const deleteById = async (req, res) => {
  const deleteId = req.params.id;
  try {
    const deletedPost = await Post.findByIdAndDelete(deleteId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not Found" });
    }
    res.json({ message: "Item deleted successfully", deletedPost });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostsByAuthor = async (req, res) => {
  try {
    const authorName = req.params.authorName.trim().toLowerCase(); // Convert to lowercase and trim

    // Query for posts by author (case-insensitive)
    const postsByAuthor = await Post.find({
      author: { $regex: new RegExp("^" + authorName + "$", "i") },
    });

    if (!postsByAuthor || postsByAuthor.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "No posts found by this author" });
    }

    res.status(200).json({ success: true, data: postsByAuthor });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

export default {
  add_Post,
  getAllPosts,
  getSpecificPost,
  getCategoryPosts,
  updateById,
  deleteById,
  getPostsByAuthor,
};
