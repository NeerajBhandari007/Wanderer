"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const postController = require('../controller/Post');
router.post('/', postController.createPost)
    .get('/', postController.getAllPosts)
    .post('/:id/comments', postController.createComment)
    .get('/:id/comments', postController.getPostComments)
    .get('/deletePost/:id/', postController.deletePost)
    .post('/:postId/comments/:parentId', postController.commentTocomment)
    .post('/searchPost', postController.searchPosts)
    .get('/getAllTrails', postController.getAllTrails)
    .get('/postLikeById/:id', postController.getPostLike);
exports.router = router;
//# sourceMappingURL=post.js.map