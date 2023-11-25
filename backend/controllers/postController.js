const Post = require("../models/post");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newPost = async (req, res, next) => {
  let images = [];
  // console.log(req.body);
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      let imageDataUri = images[i]; //tanggalin yung .path pag front end na
      try {
        const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
          folder: "eventTickets/posts",
          width: 150,
          crop: "scale",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.error(`Error uploading image to Cloudinary: ${error}`);
      }
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const post = await Post.create(req.body);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not created",
      });
    }

    res.status(201).json({
      success: true,
      post,
    });
};
exports.getPosts = async (req, res, next) => {
  try {
    const resPerPage = 6;
    const postsCount = await Post.countDocuments();
    const apiFeatures = new APIFeatures(Post.find(), req.query)
      .search()
      .filter()
      .category()
      .pagination(resPerPage);

    apiFeatures.pagination(resPerPage);
    const posts = await apiFeatures.query;
    const filteredPostsCount = posts.length;

    if (!posts) {
      return res.status(404).json({
        success: false,
        message: "Posts not found",
      });
    }

    res.status(200).json({
      success: true,
      filteredPostsCount,
      postsCount,
      posts,
      resPerPage,
    });
  } catch (error) {
    console.error(`Error fetching posts: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res.status(500).json({
      success: false,
      error: `Error fetching posts: ${error.message}`,
    });
  }
};
exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(`Error fetching single post: ${error.message}`);
    // You can choose to handle the error in a more detailed manner or send a specific error response.
    res
      .status(500)
      .json({ error: `Error fetching single post: ${error.message}` });
  }
};
exports.getAdminPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

        // Deleting images associated with the event
        if (images !== undefined) {
          for (let i = 0; i < post.images.length; i++) {
            try {
              const result = await cloudinary.v2.uploader.destroy(
                post.images[i].public_id
              );
            } catch (error) {
              console.log(`Error deleting image from Cloudinary: ${error}`);
            }
          }
        }
    

        let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "eventTickets/posts",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.log(`Error uploading image to Cloudinary: ${error}`);
        // Handle the error as needed
        // You can choose to send an error response or take other actions
        return res.status(500).json({
          success: false,
          error: `Error uploading image to Cloudinary: ${error.message}`,
        });
      }
    }
    req.body.images = imagesLinks;
    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not updated",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(`Error updating post: ${error.message}`);
    res.status(500).json({ error: `Error updating post: ${error.message}` });
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.error(`Error deleting post: ${error.message}`);
    res.status(500).json({ error: `Error deleting post: ${error.message}` });
  }
};
