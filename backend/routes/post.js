const express = require('express');
const upload = require('../utils/multer');
const router = express.Router();

const { newPost, 
    getPosts, 
    updatePost, 
    deletePost, 
    getSinglePost, 
    getAdminPosts} = require('../controllers/postController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.post('/admin/post/new', upload.array('images', 10), isAuthenticatedUser, newPost);
router.get('/admin/posts', isAuthenticatedUser, authorizeRoles('admin'), getAdminPosts);
// // router.route('/admin/post/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updatePost).delete(deletePost);
router.route('/admin/post/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updatePost).delete(deletePost);
// router.route('/post/:id').put(updatePost).delete(deletePost);


// Other routes
router.get('/posts', getPosts);
// router.post('/post/new', newPost);
router.get('/post/:id', getSinglePost);


module.exports = router;
