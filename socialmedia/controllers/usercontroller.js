const User = require("../models/usermodel.js");
const catchasyncerror = require("../middleware/catchasyncerror.js");
const Errorhandler = require("../utils/errorhandler.js");
const sendtoken = require("../utils/sendtoken.js");
const Post = require("../models/postmodel.js");
const sendEmail = require("../utils/sendmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.register = catchasyncerror(async (req, res, next) => {
  const { name, email, password ,avatar } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new Errorhandler("User already exist", 400));
  }
   const mycloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars" });
  user = await User.create({
    name,
    email,
    password,
    avatar : {public_id: mycloud.public_id, url: mycloud.secure_url}
  });

  sendtoken(user, 201, res);
});

exports.login = catchasyncerror(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email })
    .select("+password")
    .populate("posts  followers following");

  if (!user) return next(new Errorhandler("User doesn't exist", 401));

  const ismatch = await user.comparePassword(password);

  if (!ismatch)
    return next(new Errorhandler("invalid email or password", 401));

  sendtoken(user, 200, res);
});

exports.logout = catchasyncerror(async (req, res, next) => {
  const token = null;
  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "logged out",
    });
});

exports.followUser = catchasyncerror(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!userToFollow) {
    return next(new Errorhandler("User not found", 404));
  }

  if (loggedInUser.following.includes(userToFollow._id)) {
    const indexOfFollowing = loggedInUser.following.indexOf(userToFollow._id);
    const indexOfFollower = userToFollow.followers.indexOf(loggedInUser._id);

    loggedInUser.following.slice(indexOfFollowing, 1);
    userToFollow.followers.slice(indexOfFollower, 1);

    await loggedInUser.save();
    await userToFollow.save();

    res
      .status(200)
      .json({ success: true, message: "user unfollowed successfully" });
  } else {
    loggedInUser.following.push(userToFollow._id);
    userToFollow.followers.push(loggedInUser._id);

    await userToFollow.save();
    await loggedInUser.save();

    res
      .status(200)
      .json({ success: true, message: "user follows successfully" });
  }
});

exports.updatePassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new Errorhandler("please provide new and old password", 400));
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    return next(new Errorhandler("incorrect password", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

exports.updateprofile = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { name, email , avatar } = req.body;

  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  if(avatar)
  {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    const mycloud = await cloudinary.v2.uploader.upload(avatar , {folder : "avatars"});

    user.avatar.public_id = mycloud.public_id;
    user.avatar.url = mycloud.secure_url;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated",
  });
});

exports.deleteMyProfile = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const posts = user.posts;
  const followers = user.followers;
  const following = user.following;
  const userId = user._id;

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
   await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  for (let i = 0; i < posts.length; i++) {
    const post = await Post.findById(posts[i]);
    await cloudinary.v2.uploader.destroy(post.imageUrl.public_id);
    await post.remove();
  }

  for (let i = 0; i < followers.length; i++) {
    const follower = await User.findById(followers[i]);

    const index = follower.following.indexOf(userId);
    follower.following.splice(index, 1);
    await follower.save();
  }

  for (let i = 0; i < following.length; i++) {
    const follows = await User.findById(following[i]);

    const index = follows.followers.indexOf(userId);
    follows.followers.splice(index, 1);
    await follows.save();
  }

  const allPosts = await Post.find();

  for (let i = 0; i < allPosts.length; i++) {
    const post = await Post.findById(allPosts[i]._id);

    for (let j = 0; j < post.comments.length; j++) {
      if (post.comments[j].user === userId) {
        post.comments.splice(j, 1);
      }
    }
    await post.save();
  }
  // removing all likes of the user from all posts

  for (let i = 0; i < allPosts.length; i++) {
    const post = await Post.findById(allPosts[i]._id);

    for (let j = 0; j < post.likes.length; j++) {
      if (post.likes[j] === userId) {
        post.likes.splice(j, 1);
      }
    }
    await post.save();
  }

  res.status(200).json({
    success: true,
    message: "Profile Deleted",
  });
});

exports.myProfile = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate(
    "posts followers following"
  );

  res.status(200).json({
    success: true,
    user,
  });
});

exports.getUserProfile = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate(
    "posts followers following"
  );

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.getAllUsers = catchasyncerror(async (req, res, next) => {
  const users = await User.find({
    name: { $regex: req.query.name, $options: "i" },
  });

  res.status(200).json({
    success: true,
    users,
  });
});

exports.forgotPassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }

  const resetPasswordToken = user.getResetPasswordToken();

  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetPasswordToken}`;

  const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.resetPassword = catchasyncerror(async (req, res, next) => {
  const resetpasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetpasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired",
    });
  }

  user.password = req.body.password;

  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated",
  });
});

exports.getMyPosts = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const posts = [];

  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user owner"
    );
    posts.push(post);
  }

  res.status(200).json({
    success: true,
    posts,
  });
});

exports.getMyPosts = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const posts = [];

  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user owner"
    );
    posts.push(post);
  }

  res.status(200).json({
    success: true,
    posts,
  });
});
exports.getUserPosts = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const posts = [];

  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user owner"
    );
    posts.push(post);
  }

  res.status(200).json({
    success: true,
    posts,
  });
});

exports.getCompleteUsers = catchasyncerror(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});