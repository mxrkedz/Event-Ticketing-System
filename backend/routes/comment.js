const express = require('express');

const router = express.Router();

const { newComment, 
    getComments, 
    updateComment, 
    deleteComment, 
    getSingleComment, 
    getAdminComments} = require('../controllers/commentController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.post('/comment/new', newComment);
// router.comment('/admin/comment/new', isAuthenticatedUser, newComment);
router.get('/admin/comments', isAuthenticatedUser, authorizeRoles('admin'), getAdminComments);
// // router.route('/admin/comment/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updatePost).delete(deletePost);
// router.route('/admin/comment/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateComment).delete(deleteComment);
router.route('/comment/:id').put(updateComment).delete(deleteComment);


// Other routes
router.get('/comments', getComments);
// router.comment('/comment/new', newComment);
router.get('/comment/:id', getSingleComment);


module.exports = router;
