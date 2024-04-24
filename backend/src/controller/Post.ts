import { PrismaClient } from '@prisma/client'
import  { Request, Response } from "express";
const prisma = new PrismaClient()
function shuffleArray(array:any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const getPostsAll=async()=>{
    try{
        
        const posts = await prisma.post.findMany({
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
                      author: true, // Include comment author
                      childComments: { // Include child comments
                        include: {
                          childComments:true,
                          author: true // Include child comment author
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
                comment.childComments = await fetchChildComments(comment);
            }
        }
        return shuffledPosts;
    }catch(error){
        console.log(error)
        throw new Error('Error fetching posts');
    }
}

const fetchChildComments = async (comment: any) => {
    // Fetch child comments for the given comment
    const childComments = await prisma.comment.findMany({
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
        childComment.childComments = await fetchChildComments(childComment);
    }

    return childComments;
};
exports.createPost = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { tags, ...postData } = req.body; //  'tags' is an array of tag names

        const userId = (req.user as any).id;
        // Create or find all trail tags
        const trailTags = await Promise.all(tags.map(async (tag: string) => {
            let trailTag = await prisma.trailTag.findUnique({
                where: { tag },
            });

            if (!trailTag) {
                trailTag = await prisma.trailTag.create({
                    data: { tag },
                });
            }

            return trailTag;
        }));
        
        const post = await prisma.post.create({
            data: {
                ...postData,
                authorId: userId,
                trailTags: { connect: trailTags.map((tag) => ({ id: tag.id })) },
            },
            include: {
                trailTags: true,
            },
        });
        const allPosts = await getPostsAll()
        return res.status(200).json(allPosts);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllTrails = async (req:Request, res:Response) => {
    const trails = await prisma.trailTag.findMany(
       { include:{
            posts:true
        }}
    );
    return res.status(200).json(trails);
};



exports.getAllPosts = async (req:Request, res:Response) => {
    try{
        const posts = await getPostsAll()
        return res.status(200).json(posts);
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
};


exports.createComment = async (req:Request, res:Response) => {
    try{
            if(!req.user){
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = (req.user as any).id;
    const postId:string = req.params.id;
    const comment = await prisma.comment.create({
        data: {
            ...req.body,
            authorId: userId,
            postId:parseInt(postId)
        }
    });
    const posts = await getPostsAll()
        return res.status(201).json(posts);
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
};

exports.getPostComments = async (req:Request, res:Response) => {
    try{
        const postId:string = req.params.id;
        const comments = await prisma.comment.findMany({
            where:{
                postId:parseInt(postId)
            },include:{
                childComments:true
            }
        });
        return res.status(200).json(comments);
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
};

exports.commentTocomment = async (req:Request, res:Response) => {
    try{
    if(!req.user){
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = (req.user as any).id;
    const commentId:string = req.params.parentId;
    const postId:string = req.params.postId;
    const reply = await prisma.comment.create({
        data: {
            ...req.body,
            authorId: userId,
            postId:parseInt(postId),
            parentCommentId:parseInt(commentId)
        }
    });
    
    const posts = await getPostsAll()
        return res.status(201).json(posts);
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
};


exports.searchPosts = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const data = content.trim();
      console.log(data)
      const posts = await prisma.post.findMany({
          where: {
              OR: [
                { content: { contains: data, mode: 'insensitive' } },
                { trailTags: { some: { tag: { contains: data as string, mode: 'insensitive' } } } },
                { author: { username: { contains: data as string, mode: 'insensitive' } } },
              ]
            },
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
                    author: true, // Include comment author
                    childComments: { // Include child comments
                      include: {
                        childComments:true,
                        author: true // Include child comment author
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
              comment.childComments = await fetchChildComments(comment);
          }
      }
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error searching posts:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
exports.getPostLike = async (req: Request, res: Response) => {
    try{
        const postId:string = req.params.id;
        const likes = await prisma.postLike.findMany({
            where: {
                postId: parseInt(postId)
            },
            include:{
                user:{
                    select:{username:true,id:true}
                }
            }
        });
        return res.status(200).json(likes);
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
};

exports.deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
  
    try {
        await prisma.comment.deleteMany({
            where: { postId },
        });

        // Delete post likes associated with the post
        await prisma.postLike.deleteMany({
            where: { postId },
        });

        // Get the trail tags associated with the post
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { trailTags: true },
        });

        // Disconnect the trail tags from the post
        if (post?.trailTags && post.trailTags.length > 0) {
            await prisma.post.update({
                where: { id: postId },
                data: {
                    trailTags: {
                        disconnect: post.trailTags.map((tag) => ({ id: tag.id })),
                    },
                },
            });
        }

        // Delete the post
        await prisma.post.delete({
            where: { id: postId },
        });
        return res.status(200).json({ message: 'Post and associated data deleted' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };