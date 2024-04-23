"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController = require('../controller/User');
router.get('/profile', userController.getUser)
    .get('/profile/:id', userController.getUserById)
    .delete('/:id', userController.deleteUser)
    .post('/follow/:followedId', userController.followUser)
    .post('/unfollow/:followedId', userController.unfollowUser)
    .get('/followers', userController.getFollowers)
    .get('/following', userController.getFollowing)
    .post('/like/:postId', userController.likePost)
    .post('/unlike/:postId', userController.unlikePost)
    .post('/likeComment/:commentId', userController.likeComment)
    .post('/unlikeComment/:commentId', userController.unlikeComment)
    .get('/totalPostLikes/:postId', userController.getPostLikes)
    .get('/totalCommentLikes/:commentId', userController.getCommentLikes)
    .post('/searchUsers/', userController.searchUsers)
    .get('/random', userController.getRandomUsers)
    .get('/getLikedPost', userController.getLikedPostByUser)
    .get('/getFriends', userController.getFriends)
    .get('/getOldChat/:userId', userController.getOlderChat)
    .post('/updateUser/', userController.updateUser);
exports.router = router;
//# sourceMappingURL=user.js.map