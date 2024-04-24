"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const getPostsAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        userImage: true,
                    }
                },
                comments: {
                    where: {
                        parentCommentId: null
                    },
                    include: {
                        author: true, // Include comment author
                        childComments: {
                            include: {
                                childComments: true,
                                author: true // Include child comment author
                            },
                        }
                    }
                },
                postLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                // email: true,
                                userImage: true,
                                // interests: true,
                                // role: true,
                                // followedTo: true,
                                // followers: true,
                                // Post: true
                            }
                        }
                    }
                }
            }
        });
        const shuffledPosts = shuffleArray(posts);
        for (const post of shuffledPosts) {
            for (const comment of post.comments) {
                comment.childComments = yield fetchChildComments(comment);
            }
        }
        return shuffledPosts;
    }
    catch (error) {
        console.log(error);
        throw new Error('Error fetching posts');
    }
});
const fetchChildComments = (comment) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch child comments for the given comment
    const childComments = yield prisma.comment.findMany({
        where: {
            parentCommentId: comment.id
        },
        include: {
            childComments: true,
            author: true
        }
    });
    // Recursively fetch child comments for each child comment
    for (const childComment of childComments) {
        childComment.childComments = yield fetchChildComments(childComment);
    }
    return childComments;
});
exports.createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const _a = req.body, { tags } = _a, postData = __rest(_a, ["tags"]); //  'tags' is an array of tag names
        const userId = req.user.id;
        // Create or find all trail tags
        const trailTags = yield Promise.all(tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
            let trailTag = yield prisma.trailTag.findUnique({
                where: { tag },
            });
            if (!trailTag) {
                trailTag = yield prisma.trailTag.create({
                    data: { tag },
                });
            }
            return trailTag;
        })));
        const post = yield prisma.post.create({
            data: Object.assign(Object.assign({}, postData), { authorId: userId, trailTags: { connect: trailTags.map((tag) => ({ id: tag.id })) } }),
            include: {
                trailTags: true,
            },
        });
        const allPosts = yield getPostsAll();
        return res.status(200).json(allPosts);
    }
    catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllTrails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const trails = yield prisma.trailTag.findMany({ include: {
            posts: true
        } });
    return res.status(200).json(trails);
});
exports.getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield getPostsAll();
        return res.status(200).json(posts);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user.id;
        const postId = req.params.id;
        const comment = yield prisma.comment.create({
            data: Object.assign(Object.assign({}, req.body), { authorId: userId, postId: parseInt(postId) })
        });
        const posts = yield getPostsAll();
        return res.status(201).json(posts);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const comments = yield prisma.comment.findMany({
            where: {
                postId: parseInt(postId)
            }, include: {
                childComments: true
            }
        });
        return res.status(200).json(comments);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.commentTocomment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user.id;
        const commentId = req.params.parentId;
        const postId = req.params.postId;
        const reply = yield prisma.comment.create({
            data: Object.assign(Object.assign({}, req.body), { authorId: userId, postId: parseInt(postId), parentCommentId: parseInt(commentId) })
        });
        const posts = yield getPostsAll();
        return res.status(201).json(posts);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const data = content.trim();
        console.log(data);
        const posts = yield prisma.post.findMany({
            where: {
                OR: [
                    { content: { contains: data, mode: 'insensitive' } },
                    { trailTags: { some: { tag: { contains: data, mode: 'insensitive' } } } },
                    { author: { username: { contains: data, mode: 'insensitive' } } },
                ]
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        userImage: true,
                    }
                },
                comments: {
                    where: {
                        parentCommentId: null
                    },
                    include: {
                        author: true, // Include comment author
                        childComments: {
                            include: {
                                childComments: true,
                                author: true // Include child comment author
                            },
                        }
                    }
                },
                postLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                // email: true,
                                userImage: true,
                                // interests: true,
                                // role: true,
                                // followedTo: true,
                                // followers: true,
                                // Post: true
                            }
                        }
                    }
                }
            }
        });
        for (const post of posts) {
            for (const comment of post.comments) {
                comment.childComments = yield fetchChildComments(comment);
            }
        }
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error('Error searching posts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getPostLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const likes = yield prisma.postLike.findMany({
            where: {
                postId: parseInt(postId)
            },
            include: {
                user: {
                    select: { username: true, id: true }
                }
            }
        });
        return res.status(200).json(likes);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    try {
        yield prisma.comment.deleteMany({
            where: { postId },
        });
        // Delete post likes associated with the post
        yield prisma.postLike.deleteMany({
            where: { postId },
        });
        // Get the trail tags associated with the post
        const post = yield prisma.post.findUnique({
            where: { id: postId },
            include: { trailTags: true },
        });
        // Disconnect the trail tags from the post
        if ((post === null || post === void 0 ? void 0 : post.trailTags) && post.trailTags.length > 0) {
            yield prisma.post.update({
                where: { id: postId },
                data: {
                    trailTags: {
                        disconnect: post.trailTags.map((tag) => ({ id: tag.id })),
                    },
                },
            });
        }
        // Delete the post
        yield prisma.post.delete({
            where: { id: postId },
        });
        return res.status(200).json({ message: 'Post and associated data deleted' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
//# sourceMappingURL=Post.js.map