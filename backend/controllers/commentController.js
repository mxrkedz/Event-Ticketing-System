const Comment = require("../models/comment");
const APIFeatures = require("../utils/apiFeatures");

exports.newComment = async (req, res, next) => {
  try {
    const { user, email, subject, content } = req.body;

    const comment = await Comment.create(req.body);
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment not created",
      });
    }

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.log(`Unexpected error in newComment: ${error}`);
    return res.status(500).json({
      success: false,
      error: `Unexpected error: ${req.body}`,
    });
  }
};
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(`Error fetching all orders: ${error.message}`);
    res
      .status(500)
      .json({ error: `Error fetching all orders: ${error.message}` });
  }
};

exports.getSingleComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error(`Error fetching single comment: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res
      .status(500)
      .json({ error: `Error fetching single comment: ${error.message}` });
  }
};

exports.getAdminComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not updated",
      });
    }

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error(`Error updating comment: ${error.message}`);
    res.status(500).json({ error: `Error updating comment: ${error.message}` });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.error(`Error deleting comment: ${error.message}`);
    res.status(500).json({ error: `Error deleting comment: ${error.message}` });
  }
};
