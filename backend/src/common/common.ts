const passport = require("passport");
import { Request, Response } from "express";
exports.isAuth = (req:Request, res:Response, done:any) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user:any) => {
  return { id: user.id, role: user.role,username:user.username,userImage:user.userImage,coverImage:user.coverImage };
};

exports.sanitizeUserProfile = (user:any) => {
  return {id:user.id,
    username:user.username,
    email:user.email,
    userImage:user.userImage,
    coverImage:user.coverImage,
    interests:user.interests,
    role:user.role,
    followedTo:user.followers,
    followers:user.followedTo,
    posts:user.Post
  };
};

exports.cookieExtractor = function (req:Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
