const Post = require("../models/post");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newPost = async (req, res, next) => {
    	// console.log(req.body);
    	try {
    		if(req.files){
    			req.body.images = req.files
    		}
    	  if (!req.body.images) {
    		return res.status(400).json({
    		  success: false,
    		  message: 'Images are required for creating a new post',
    		});
    	  }
    
    	  let imagesLinks = [];
    
    	  for (let i = 0; i < req.body.images.length; i++) {
    		let imageDataUri = req.body.images[i].path; //tanggalin yung .path pag front end na
    		try {
    		  const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
    			folder: 'eventTickets/posts',
    			width: 150,
    			crop: 'scale',
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
    
    	//   const post = await Post.create(req.body);
    	const { title,
    		location,
    		content} = req.body;
    
    		const post = await Post.create({
    			title,
    			location,
    			content,
    			images: imagesLinks
    		})
    	  if (!post) {
    		return res.status(400).json({
    		  success: false,
    		  message: 'Post not created',
    		});
    	  }
    
    	  res.status(201).json({
    		success: true,
    		post,
    	  });
    	} catch (error) {
    	  console.error(`Error creating a new post: ${error}`);
    	  // You can choose to handle the error in a more detailed manner or send a specific error response.
    	  res.status(500).json({
    		success: false,
    		error: `Error creating a new post: ${error}`,
    	  });
    	}
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
      
          post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
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


