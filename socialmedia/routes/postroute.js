const express = require("express");
const { isauthenticateduser } = require("../middleware/auth.js");
const {
  createPost,
  likeAndUnlikePost,
  updateCaption,
  deletePost,
  getPostOfFollowing,
  commentOnPost,
  deleteComment,
} = require("../controllers/postcontroller.js");

const router = express.Router();

router.route("/post/upload").post(isauthenticateduser, createPost);

router
  .route("/post/:id")
  .get(isauthenticateduser, likeAndUnlikePost)
  .put(isauthenticateduser, updateCaption)
  .delete(isauthenticateduser, deletePost);

router.route("/posts").get(isauthenticateduser, getPostOfFollowing);

router
  .route("/post/comment/:id")
  .put(isauthenticateduser, commentOnPost)
  .delete(isauthenticateduser, deleteComment);

module.exports = router;
