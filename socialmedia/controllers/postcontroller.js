const catchasyncerror = require("../middleware/catchasyncerror.js");
const Post = require("../models/postmodel.js");
const User = require("../models/usermodel.js");
const Errorhandler = require("../utils/errorhandler.js");
const cloudinary = require("cloudinary");

exports.createPost = catchasyncerror(async (req, res, next) => {
  console.log(req.body.image);
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  const myCloud = await cloudinary.uploader.upload(req.body.image, 
    options);
  console.log(myCloud);
  const newPostData = {
    caption: req.body.caption,
    imageUrl: {public_id: myCloud.public_id,
               url: myCloud.secure_url},
    owner: req.user._id,
  };
  
  
  const post = await Post.create(newPostData);
  console.log(post);
 
  const user = await User.findById(req.user._id);

  user.posts.unshift(post._id);

  await user.save();
  res.status(201).json({
    success: true,
    message: "Post created",
  });
});

exports.deletePost = catchasyncerror(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new Errorhandler("No post found", 404));
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return next(new Errorhandler("Unauthorized", 401));
  }
  await cloudinary.v2.uploader.destroy(post.imageUrl.public_id);
  await post.deleteOne();

  const user = await User.findById(req.user._id);

  const index = user.posts.indexOf(req.params.id);
  user.posts.splice(index, 1);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Post deleted",
  });
});

exports.likeAndUnlikePost = catchasyncerror(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new Errorhandler("No post found", 404));
  }

  if (post.likes.includes(req.user._id)) {
    const index = post.likes.indexOf(req.user._id);

    post.likes.splice(index, 1);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post Unliked",
    });
  } else {
    post.likes.push(req.user._id);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post Liked",
    });
  }
});
exports.getPostOfFollowing = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const posts = await Post.find({
    owner: {
      $in: user.following,
    },
  }).populate("owner likes comments.user");

  res.status(200).json({
    success: true,
    posts: posts
    
  });
});

exports.updateCaption = catchasyncerror(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new Errorhandler("No post found", 404));
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    return next(new Errorhandler("Unauthorized", 401));
  }

  post.caption = req.body.caption;
  await post.save();
  res.status(200).json({
    success: true,
    message: "Post updated",
  });
});

exports.commentOnPost = catchasyncerror(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new Errorhandler("post not found", 404));
  }

  let commentIndex = -1;

  post.comments.forEach((item, index) => {
    if (item.user.toString() === req.user._id.toString()) {
      commentIndex = index;
    }
  });

  if (commentIndex !== -1) {
    post.comments[commentIndex].comment = req.body.comment;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment Updated",
    });
  } else {
    post.comments.push({
      user: req.user._id,
      comment: req.body.comment,
    });

    await post.save();
    return res.status(200).json({
      success: true,
      message: "Comment added",
    });
  }
});

exports.deleteComment = catchasyncerror(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  if (post.owner.toString() === req.user._id.toString()) {
    if (req.body.commentId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Comment Id is required",
      });
    }

    post.comments.forEach((item, index) => {
      if (item._id.toString() === req.body.commentId.toString()) {
        return post.comments.splice(index, 1);
      }
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Selected Comment has deleted",
    });
  } else {
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        return post.comments.splice(index, 1);
      }
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Your Comment has deleted",
    });
  }
});
