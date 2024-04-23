"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
exports.isAuth = (req, res, done) => {
    return passport.authenticate("jwt");
};
exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role, username: user.username, userImage: user.userImage, coverImage: user.coverImage };
};
exports.sanitizeUserProfile = (user) => {
    return { id: user.id,
        username: user.username,
        email: user.email,
        userImage: user.userImage,
        coverImage: user.coverImage,
        interests: user.interests,
        role: user.role,
        followedTo: user.followers,
        followers: user.followedTo,
        posts: user.Post
    };
};
exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"];
    }
    return token;
};
//# sourceMappingURL=common.js.map