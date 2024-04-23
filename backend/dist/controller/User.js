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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const { sanitizeUser, sanitizeUserProfile } = require("../common/common");
exports.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    try {
        const user = yield prisma.users.findUnique({
            where: { id: userId },
            include: {
                followers: true,
                followedTo: true,
                Post: true
            }
        });
        if (user) {
            return res.status(200).json(sanitizeUserProfile(user));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const id = req.params.id;
    const userId = parseInt(id, 10);
    try {
        const user = yield prisma.users.findUnique({
            where: { id: userId },
            include: {
                followers: {
                    include: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                followedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                Post: {
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
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        userImage: true,
                                    }
                                }, // Include comment author
                                childComments: {
                                    include: {
                                        childComments: true,
                                        author: {
                                            select: {
                                                id: true,
                                                username: true,
                                                userImage: true,
                                            }
                                        } // Include child comment author
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
                                        userImage: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (user) {
            return res.status(200).json(sanitizeUserProfile(user));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getRandomUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userId = req.user.id;
        const allUsers = yield prisma.users.findMany({
            select: { id: true },
        });
        const filteredUserFollows = yield prisma.userFollow.findMany({
            where: {
                followerId: userId,
            },
            select: {
                followedId: true,
            },
        });
        console.log(filteredUserFollows);
        const filteredFollowerIds = filteredUserFollows.map((entry) => entry.followedId);
        filteredFollowerIds.push(userId);
        console.log(filteredUserFollows);
        const filteredUsers = allUsers.filter((user) => !filteredFollowerIds.includes(user.id));
        const shuffledUserIds = filteredUsers.map((user) => user.id).sort(() => Math.random() - 0.5);
        const selectedUserIds = shuffledUserIds.slice(0, 10);
        // const user = await prisma.users.findMany({
        //     where: {
        //         id: { in: selectedUserIds },
        //     },
        //     include:{
        //       followers:true,
        //       followedTo:true,
        //       Post:true
        //     }
        // });
        const user = yield prisma.users.findMany({
            where: {
                id: { in: selectedUserIds },
            },
            include: {
                followers: {
                    include: {
                        follower: true
                    }
                },
                followedTo: {
                    include: {
                        user: true
                    }
                },
                Post: true
            }
        });
        const formattedUsers = user.map((user) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            userImage: user.userImage,
            interests: user.interests,
            role: user.role,
            followedTo: user.followers,
            followers: user.followedTo,
            posts: user.Post,
            coverImage: user.coverImage
        }));
        return res.status(200).json(formattedUsers);
    }
    catch (error) {
        console.error('Error fetching random users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    try {
        yield prisma.users.delete({
            where: { id: userId }
        });
        return res.status(200).json({ message: 'User deleted' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// Function to follow a user
exports.followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const { followedId } = req.params;
    try {
        // Check if the follower already follows the user
        const existingFollower = yield prisma.userFollow.findFirst({
            where: {
                followerId: userId,
                followedId: parseInt(followedId),
            },
        });
        if (existingFollower) {
            return res.status(400).json({ error: 'User is already being followed' });
        }
        // Create a new entry in the UserFollowers table
        yield prisma.userFollow.create({
            data: {
                followerId: userId,
                followedId: parseInt(followedId),
            },
        });
        const user = yield prisma.users.findUnique({
            where: { id: userId },
            include: {
                followers: {
                    include: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                followedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                Post: {
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
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        userImage: true,
                                    }
                                }, // Include comment author
                                childComments: {
                                    include: {
                                        childComments: true,
                                        author: {
                                            select: {
                                                id: true,
                                                username: true,
                                                userImage: true,
                                            }
                                        } // Include child comment author
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
                                        userImage: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json(sanitizeUserProfile(user));
    }
    catch (error) {
        console.error('Error following user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Function to unfollow a user
exports.unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { followedId } = req.params;
    console.log("123" + "m " + followedId);
    try {
        // Delete the entry from the UserFollowers table
        yield prisma.userFollow.deleteMany({
            where: {
                followerId: userId,
                followedId: parseInt(followedId),
            },
        });
        const user = yield prisma.users.findUnique({
            where: { id: userId },
            include: {
                followers: {
                    include: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                followedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                Post: {
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
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        userImage: true,
                                    }
                                }, // Include comment author
                                childComments: {
                                    include: {
                                        childComments: true,
                                        author: {
                                            select: {
                                                id: true,
                                                username: true,
                                                userImage: true,
                                            }
                                        } // Include child comment author
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
                                        userImage: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return res.status(201).json(sanitizeUserProfile(user));
    }
    catch (error) {
        console.error('Error unfollowing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Function to get followers of a user
exports.getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        // Find all followers of the user
        const followers = yield prisma.userFollow.findMany({
            where: {
                followedId: parseInt(userId),
            },
            select: {
                followerId: true,
            },
        });
        return res.status(200).json(followers);
    }
    catch (error) {
        console.error('Error getting followers:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Function to get users followed by a user
exports.getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.user.id;
    try {
        const following = yield prisma.userFollow.findMany({
            where: {
                followerId: parseInt(UserId),
            },
            select: {
                followedId: true,
            },
        });
        return res.status(200).json(following);
    }
    catch (error) {
        console.error('Error getting following:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const postId = req.params.postId;
    try {
        const post = yield prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const like = yield prisma.postLike.findFirst({
            where: {
                AND: {
                    userId,
                    postId: parseInt(postId)
                }
            },
            select: { id: true }
        });
        if (like) {
            return res.status(400).json({ error: 'Post already liked' });
        }
        const newLike = yield prisma.postLike.create({
            data: { userId, postId: parseInt(postId) },
        });
        const postIdList = yield getUserLikedPost(userId);
        return res.status(201).json(postIdList);
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const postId = req.params.postId;
    try {
        const postLikeWhereUniqueInput = {
            AND: {
                userId,
                postId: parseInt(postId)
            }
        };
        const like = yield prisma.postLike.findFirst({
            where: postLikeWhereUniqueInput,
            select: { id: true }
        });
        if (!like) {
            return res.status(400).json({ error: 'Post not liked' });
        }
        yield prisma.postLike.delete({
            where: {
                id: like.id
            },
        });
        const postIdList = yield getUserLikedPost(userId);
        return res.status(200).json(postIdList);
    }
    catch (error) {
        console.error('Error unliking post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    try {
        const comment = yield prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
        });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        const like = yield prisma.commentLike.findFirst({
            where: {
                AND: {
                    userId,
                    commentId: parseInt(commentId)
                }
            },
            select: { id: true }
        });
        if (like) {
            return res.status(400).json({ error: 'Comment already liked' });
        }
        const newLike = yield prisma.commentLike.create({
            data: { userId, commentId: parseInt(commentId) },
        });
        return res.status(201).json(newLike);
    }
    catch (error) {
        console.error('Error liking comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.unlikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const commentId = req.params.commentId;
    try {
        const commentLikeWhereUniqueInput = {
            AND: {
                userId,
                commentId: parseInt(commentId)
            }
        };
        const like = yield prisma.commentLike.findFirst({
            where: commentLikeWhereUniqueInput,
            select: { id: true }
        });
        if (!like) {
            return res.status(400).json({ error: 'Comment not liked' });
        }
        yield prisma.commentLike.delete({
            where: {
                id: like.id
            },
        });
        return res.status(200).json({ message: 'Comment unliked successfully' });
    }
    catch (error) {
        console.error('Error unliking comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getPostLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const likes = yield prisma.postLike.findMany({
            where: {
                postId: parseInt(postId)
            },
            include: {
                user: true
            }
        });
        return res.status(200).json({ likes });
    }
    catch (error) {
        console.error('Error getting post likes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getCommentLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const likes = yield prisma.commentLike.findMany({
            where: {
                commentId: parseInt(commentId)
            },
            select: {
                userId: true,
            }
        });
        return res.status(200).json({ likes });
    }
    catch (error) {
        console.error('Error getting comment likes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const data = content.trim();
        const users = yield prisma.users.findMany({
            where: {
                username: {
                    contains: data,
                    mode: 'insensitive'
                }
            }, select: {
                id: true,
                username: true,
                userImage: true,
                coverImage: true
            }
        });
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getLikedPostByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        const postIdList = yield getUserLikedPost(user);
        return res.status(200).json(postIdList);
    }
    catch (error) {
        console.error('Error getting post likes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
const getUserLikedPost = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postIdList = yield prisma.postLike.findMany({
            where: {
                userId: user,
            },
            select: {
                postId: true,
            },
        });
        return postIdList;
    }
    catch (error) {
        console.log(error);
        throw new Error('Error fetching Likedposts');
    }
});
exports.getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        const entry1 = yield prisma.userFollow.findMany({
            where: {
                followerId: user
            }, include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        userImage: true
                    }
                }
            }
        });
        const followerEntries = entry1.map(({ follower }) => follower);
        const entry2 = yield prisma.userFollow.findMany({
            where: {
                followedId: user
            }, include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        userImage: true
                    }
                }
            }
        });
        const followedEntries = entry2.map(({ user }) => user);
        const friends = followerEntries.concat(followedEntries);
        const uniqueFriends = friends.filter((obj, index, self) => index === self.findIndex((t) => (t.id === obj.id)));
        return res.status(200).json(uniqueFriends);
    }
    catch (error) {
        console.error('Error getting post likes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getOlderChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user.id;
        const userId = req.params.userId;
        const messages = yield prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user, receiverId: parseInt(userId) },
                    { senderId: parseInt(userId), receiverId: user }
                ]
            }
        });
        return res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error getting post likes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update the user using Prisma
        const userId = req.user.id;
        const updatedUser = yield prisma.users.update({
            where: { id: userId },
            data: Object.assign({}, req.body),
            include: {
                followers: {
                    include: {
                        follower: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                followedTo: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                userImage: true,
                            }
                        }
                    }
                },
                Post: {
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
                                author: {
                                    select: {
                                        id: true,
                                        username: true,
                                        userImage: true,
                                    }
                                }, // Include comment author
                                childComments: {
                                    include: {
                                        childComments: true,
                                        author: {
                                            select: {
                                                id: true,
                                                username: true,
                                                userImage: true,
                                            }
                                        } // Include child comment author
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
                                        userImage: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json(sanitizeUserProfile(updatedUser));
    }
    catch (error) {
        console.error('Failed to update user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=User.js.map