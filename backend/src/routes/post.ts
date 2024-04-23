import express from 'express';
const router = express.Router();
const postController = require('../controller/Post');

router.post('/', postController.createPost)
.get('/', postController.getAllPosts)
.post('/:id/comments', postController.createComment)
.get('/:id/comments', postController.getPostComments)
.get('/deletePost/:id/', postController.deletePost)
.post('/:postId/comments/:parentId', postController.commentTocomment)
.post('/searchPost', postController.searchPosts)
.get('/getAllTrails', postController.getAllTrails)
.get('/postLikeById/:id', postController.getPostLike)


exports.router = router;