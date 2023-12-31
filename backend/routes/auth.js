const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  checkEmail,
  updateUser,
  deleteUser,
  google,
  facebook,
} = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// router.post('/register', upload.single("avatar"), registerUser);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/google", google);
router.post("/facebook", facebook);
router.get("/logout", logout);
router.get("/check-email", checkEmail);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, upload.single("avatar"), updateProfile);
// router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile)
router.get("/admin/users", allUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser, getUserDetails ).put(isAuthenticatedUser,  updateUser).delete(isAuthenticatedUser, deleteUser)

module.exports = router;
