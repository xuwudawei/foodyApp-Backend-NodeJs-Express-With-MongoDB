const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 2, maxlength: 255 },
  email: {
    type: String,
    minlength: 2,
    maxlength: 255,
    unique: true,
    },
    phone: { type: String, minlength: 10, maxlength: 10, unique: true, },
    address:{ type: String, minlength: 2, maxlength: 255, },
  password: { type: String, minlength: 8, maxlength: 1024 },
    contactsVerified: Boolean,
    verified: Boolean,
    uniqueID: { type: String, minlength: 2, maxlength: 255 },
    stage: { type: Number },
    status: { type: String, minlength: 2, maxlength: 255 },
    pic: { type: String, minlength: 2, maxlength: 255 },
    logged: Boolean,
    token: { type: String},
    isAdmin:Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required(),
      phone: Joi.string().min(5).max(255).required(),
      address: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(8).max(255).required(),
      uniqueID: Joi.string().min(5).max(255).required(),
      pic: Joi.string().min(5).max(255).required(),
     
  });
  // return Joi.validate(user, schema);
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
