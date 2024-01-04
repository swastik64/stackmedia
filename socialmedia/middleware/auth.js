const usermodel = require("../models/usermodel");
const Errorhandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwt = require("jsonwebtoken");

exports.isauthenticateduser = catchasyncerror(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new Errorhandler("not authenticated", 401));

  const decodeddata = await jwt.verify(token, "123456");

  req.user = await usermodel.findById(decodeddata._id);

  next();
});
