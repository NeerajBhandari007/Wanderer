import express from 'express';
const router = express.Router();
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
.get('/random',userController.getRandomUsers)
.get('/getLikedPost',userController.getLikedPostByUser)
.get('/getFriends',userController.getFriends)
.get('/getOldChat/:userId',userController.getOlderChat)
.post('/updateUser/',userController.updateUser)

exports.router = router;
