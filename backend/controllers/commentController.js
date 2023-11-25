const Comment = require("../models/comment");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.newComment = async (req, res, next) => {
    	// console.log(req.body);
    	try {
    
    	//   const comment = await Comment.create(req.body);
    	const { event,
            user,
            remark
                } = req.body;
    
    		const comment = await Comment.create({
    			event,
                user,
                remark
    		})
    	  if (!comment) {
    		return res.status(400).json({
    		  success: false,
    		  message: 'Comment not created',
    		});
    	  }
    
    	  res.status(201).json({
    		success: true,
    		comment,
    	  });
    	} catch (error) {
    	  console.error(`Error creating a new comment: ${error}`);
    	  // You can choose to handle the error in a more detailed manner or send a specific error response.
    	  res.status(500).json({
    		success: false,
    		error: `Error creating a new comment: ${error}`,
    	  });
    	}
};

exports.getComments = async (req, res, next) => {
        try {
          const resPerPage = 6;
          const commentsCount = await Comment.countDocuments();
          const apiFeatures = new APIFeatures(Comment.find(), req.query)
            .search()
            .filter()
            .category()
            .pagination(resPerPage);
      
          apiFeatures.pagination(resPerPage);
          const comments = await apiFeatures.query;
          const filteredCommentsCount = comments.length;
      
          if (!comments) {
            return res.status(404).json({
              success: false,
              message: "Comments not found",
            });
          }
      
          res.status(200).json({
            success: true,
            filteredCommentsCount,
            commentsCount,
            comments,
            resPerPage,
          });
        } catch (error) {
          console.error(`Error fetching comments: ${error.message}`);
          // You can choose to handle the error in a more detailed manner or send a specific error response.
          res.status(500).json({
            success: false,
            error: `Error fetching comments: ${error.message}`,
          });
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


