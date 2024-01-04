const express = require("express");
const {
  register,
  login,
  logout,
  followUser,
  updatePassword,
  updateprofile,
  deleteMyProfile,
  myProfile,
  getMyPosts,
  getUserPosts,
  getUserProfile,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getCompleteUsers,
} = require("../controllers/usercontroller");
const { isauthenticateduser } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/follow/:id").get(isauthenticateduser, followUser);
router.route("/update/password").put(isauthenticateduser, updatePassword);
router.route("/update/profile").put(isauthenticateduser, updateprofile);
router.route("/delete/me").delete(isauthenticateduser, deleteMyProfile);
router.route("/me").get(isauthenticateduser, myProfile);
router.route("/my/posts").get(isauthenticateduser, getMyPosts);
router.route("/userposts/:id").get(isauthenticateduser, getUserPosts);
router.route("/user/:id").get(isauthenticateduser, getUserProfile);
router.route("/users").get(isauthenticateduser, getAllUsers);
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/allusers").get(isauthenticateduser, getCompleteUsers);

module.exports = router;
