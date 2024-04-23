import { PrismaClient } from '@prisma/client'
import  { Request, Response } from "express";
const prisma = new PrismaClient()
const { sanitizeUser,sanitizeUserProfile } = require("../common/common");

exports.getUser = async (req:Request, res:Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const userId = (req.user as any).id;
  try {
    const user = await prisma.users.findUnique({
      where: { id:userId },
      include:{
        followers:true,
        followedTo:true,
        Post:true
      }
    })
    if(user){
      return res.status(200).json(sanitizeUserProfile(user))
    }
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

exports.getUserById = async (req:Request, res:Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const id = req.params.id;
  const userId = parseInt(id, 10);
  try {
    const user = await prisma.users.findUnique({
      where: { id:userId },
      include:{
        followers:{
          include:{
            follower:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        followedTo:{
          include:{
            user:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        Post:{
          include:{
            author:{
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
                  childComments: { // Include child comments
                    include: {
                      childComments:true,
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
            postLikes:{
                include:{
                    user:{
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
    })
    if(user){
      return res.status(200).json(sanitizeUserProfile(user))
    }
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

exports.getRandomUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    const userId = (req.user as any).id;
    const allUsers = await prisma.users.findMany({
      select: { id: true },
    });
    const filteredUserFollows = await prisma.userFollow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followedId: true,
      },
    });
    console.log(filteredUserFollows)
    const filteredFollowerIds = filteredUserFollows.map((entry) => entry.followedId);
    filteredFollowerIds.push(userId);
    console.log(filteredUserFollows)
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
      const user = await prisma.users.findMany({
        where: {
          id: { in: selectedUserIds },
        },
        include:{
          followers:{
            include:{
              follower:true
            }
          },
          followedTo:{
            include:{
              user:true
            }
          },
          Post:true
        }
      })
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
    coverImage:user.coverImage
  }));

  return res.status(200).json(formattedUsers);
  } catch (error) {
      console.error('Error fetching random users:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req:Request, res:Response) => {
  const { id } = req.params
  const userId = parseInt(id, 10);
  
    try {
      await prisma.users.delete({
        where:{id:userId}
      })
      return res.status(200).json({ message: 'User deleted' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  // Function to follow a user
exports.followUser = async (req:Request, res:Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  const userId = (req.user as any).id;

  const { followedId } = req.params;
  try {
    // Check if the follower already follows the user
    const existingFollower = await prisma.userFollow.findFirst({
      where: {
        followerId: userId,
        followedId: parseInt(followedId),
      },
    });

    if (existingFollower) {
      return res.status(400).json({ error: 'User is already being followed' });
    }

    // Create a new entry in the UserFollowers table
    await prisma.userFollow.create({
      data: {
        followerId: userId,
        followedId: parseInt(followedId),
      },
    });
    const user = await prisma.users.findUnique({
      where: { id:userId },
      include:{
        followers:{
          include:{
            follower:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        followedTo:{
          include:{
            user:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        Post:{
          include:{
            author:{
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
                  childComments: { // Include child comments
                    include: {
                      childComments:true,
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
            postLikes:{
                include:{
                    user:{
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
    })

    return res.status(200).json(sanitizeUserProfile(user))
  } catch (error) {
    console.error('Error following user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to unfollow a user
exports.unfollowUser = async (req:Request, res:Response) => {
  const userId = (req.user as any).id;
  const { followedId } = req.params;
  console.log("123"+"m "+followedId)
  try {
    // Delete the entry from the UserFollowers table
    await prisma.userFollow.deleteMany({
      where: {
        followerId: userId,
        followedId: parseInt(followedId),
      },
    });
    const user = await prisma.users.findUnique({
      where: { id:userId },
      include:{
        followers:{
          include:{
            follower:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        followedTo:{
          include:{
            user:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        Post:{
          include:{
            author:{
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
                  childComments: { // Include child comments
                    include: {
                      childComments:true,
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
            postLikes:{
                include:{
                    user:{
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
    })

    return res.status(201).json(sanitizeUserProfile(user))
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get followers of a user
exports.getFollowers = async (req:Request, res:Response) => {
  const userId = (req.user as any).id;

  try {
    // Find all followers of the user
    const followers = await prisma.userFollow.findMany({
      where: {
        followedId:parseInt(userId),
      },
      select: {
        followerId: true, 
      },
    });

    return res.status(200).json(followers);
  } catch (error) {
    console.error('Error getting followers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get users followed by a user
exports.getFollowing = async (req:Request, res:Response) => {
  const UserId = (req.user as any).id;
  try {
    const following = await prisma.userFollow.findMany({
      where: {
        followerId: parseInt(UserId),
      },
      select: {
        followedId: true, 
      },
    });
    return res.status(200).json(following);
  } catch (error) {
    console.error('Error getting following:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.likePost = async (req:Request, res:Response) => {
  const userId = (req.user as any).id;
  const postId = req.params.postId;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const like = await prisma.postLike.findFirst({
      where: {
        AND:{
          userId,
          postId:parseInt(postId)
        }
        
      },
      select: { id:true } 
    });
    
    if (like) {
      return res.status(400).json({ error: 'Post already liked' });
    }
    
    const newLike = await prisma.postLike.create({
      data: { userId, postId:parseInt(postId) },
    });
    const postIdList = await getUserLikedPost(userId);
    return res.status(201).json(postIdList);
  } catch (error) {
    console.error('Error liking post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unlikePost = async (req:Request, res:Response) => {
  const userId = (req.user as any).id;
  const postId = req.params.postId;
  
  try {
    const postLikeWhereUniqueInput ={
      AND:{
        userId,
        postId:parseInt(postId)
      }
    };
    
    const like = await prisma.postLike.findFirst({
      where: postLikeWhereUniqueInput,
      select: { id:true } 
    });
    
    if (!like) {
      return res.status(400).json({ error: 'Post not liked' });
    }
    
    await prisma.postLike.delete({
      where:{
        id:like.id
      },
    });
    const postIdList = await getUserLikedPost(userId);
    return res.status(200).json(postIdList);
  } catch (error) {
    console.error('Error unliking post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.likeComment = async (req:Request, res:Response) => {
  const userId = (req.user as any).id;
  const commentId = req.params.commentId;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    const like = await prisma.commentLike.findFirst({
      where: {
        AND:{
          userId,
          commentId:parseInt(commentId)
        }
        
      },
      select: { id:true } 
    });
    
    if (like) {
      return res.status(400).json({ error: 'Comment already liked' });
    }
    
    const newLike = await prisma.commentLike.create({
      data: { userId, commentId:parseInt(commentId) },
    });
    
    return res.status(201).json(newLike);
  } catch (error) {
    console.error('Error liking comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unlikeComment = async (req:Request, res:Response) => {
  const userId = (req.user as any).id;
  const commentId = req.params.commentId;
  
  try {
    const commentLikeWhereUniqueInput ={
      AND:{
        userId,
        commentId:parseInt(commentId)
      }
    };
    
    const like = await prisma.commentLike.findFirst({
      where:commentLikeWhereUniqueInput,
      select: { id:true } 
    });
    
    if (!like) {
      return res.status(400).json({ error: 'Comment not liked' });
    }
    
    await prisma.commentLike.delete({
      where:{
        id:like.id
      },
    });
    
    return res.status(200).json({ message: 'Comment unliked successfully' });
  } catch (error) {
    console.error('Error unliking comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getPostLikes = async (req:Request, res:Response) => {
  const postId = req.params.postId;
  
  try {
    const likes = await prisma.postLike.findMany({
      where:{
        postId:parseInt(postId)
      },
      include:{
        user:true
      }
    });
    
    return res.status(200).json({ likes });
  } catch (error) {
    console.error('Error getting post likes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCommentLikes = async (req:Request, res:Response) => {
  const commentId = req.params.commentId;
  
  try {
    const likes = await prisma.commentLike.findMany({
      where:{
        commentId:parseInt(commentId)
      },
      select:{
        userId:true,
      }
    });
    
    return res.status(200).json({ likes });
  } catch (error) {
    console.error('Error getting comment likes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchUsers = async (req: Request, res: Response) => {
  try {
      const { content } = req.body;
      const data=content.trim()

      const users = await prisma.users.findMany({
          where: {
              username: {
                  contains: data as string,
                  mode: 'insensitive' 
              }
          },select:{
            id:true,
            username:true,
            userImage:true,
            coverImage:true
          }
      });

      return res.status(200).json(users);
  } catch (error) {
      console.error('Error searching users:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getLikedPostByUser=async(req:Request,res:Response)=>{
  try{
    const user = (req.user as any).id;
    const postIdList =await getUserLikedPost(user);
    return res.status(200).json(postIdList);
  } catch (error) {
    console.error('Error getting post likes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getUserLikedPost=async(user:number)=>{
  try{
      
    
    const postIdList = await prisma.postLike.findMany({
      where: {
        userId: user,
      },
      select: {
        postId: true,
      },
    });
      return postIdList;
  }catch(error){
      console.log(error)
      throw new Error('Error fetching Likedposts');
  }
}

exports.getFriends=async(req:Request,res:Response)=>{
  try{
    const user = (req.user as any).id;
    const entry1 = await prisma.userFollow.findMany({
      where: {
        followerId: user
      },include:{
        follower:{
          select: {
            id: true,
            username: true,
            userImage:true
          }
        }
      }
    });
    const followerEntries = entry1.map(({ follower }) => follower);
    
    const entry2 = await prisma.userFollow.findMany({
      where: {
        followedId: user
      },include:{
        user:{
          select: {
            id: true,
            username: true,
            userImage:true
          }
        }
      }
    });
    const followedEntries = entry2.map(({ user }) => user);
    const friends = followerEntries.concat(followedEntries);
    const uniqueFriends = friends.filter((obj, index, self) =>
      index === self.findIndex((t) => (
        t.id === obj.id
      ))
    );

    
    return res.status(200).json(uniqueFriends);
  } catch (error) {
    console.error('Error getting post likes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


exports.getOlderChat=async(req:Request,res:Response)=>{
  try{
    const user = (req.user as any).id;
    const userId = req.params.userId;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user, receiverId: parseInt(userId) },
          { senderId: parseInt(userId), receiverId: user }
        ]
      }
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting post likes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

exports.updateUser = async (req:Request,res:Response) => {
  try {
    // Update the user using Prisma
    const userId = (req.user as any).id;
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...req.body,
      },
      include:{
        followers:{
          include:{
            follower:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        followedTo:{
          include:{
            user:{
              select: {
                id: true,
                username: true,
                userImage: true,
            }
            }
          }
        },
        Post:{
          include:{
            author:{
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
                  childComments: { // Include child comments
                    include: {
                      childComments:true,
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
            postLikes:{
                include:{
                    user:{
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
  } catch (error) {
    console.error('Failed to update user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};