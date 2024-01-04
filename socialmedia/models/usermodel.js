const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");



const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true , "please enter a name"],
  },
  avatar : {
    public_id : String ,
    url: String,

  },
  email : {
    type : String,
    required : [true , "please enter an email"],
    unique: [true,"email already exists"],
  },
  password : {
    type : String,
    required : [true , "please enter a passworf"],
    minlength: [6,"password must be at least 6 characters"],
    select : false,
  },
  posts : [
     {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
     }
  ],
  followers : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
  ],
  following : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
  ],

  resetpasswordtoken : String,
  resettokenexpire : Date,


});

userSchema.pre("save",async function(next){
  if(!this.isModified("password"))
  {
    next();
  }
  this.password = await bcrypt.hash(this.password , 10);
  
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, "123456", {
    expiresIn: 720000000,
  });
};


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


userSchema.methods.getResetPasswordToken = function () {
  
  const resetToken = crypto.randomBytes(20).toString("hex");

 
  this.resetpasswordtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resettokenexpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};




module.exports = mongoose.model("User",userSchema);
 