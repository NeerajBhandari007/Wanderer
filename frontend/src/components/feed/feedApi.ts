export function fetchAllPost() {
    return new Promise(async (resolve) => {
      const response = await fetch("/posts/");
      const data = await response.json();
      resolve({ data });
    });
}

export function createPost(postData:object){
  return new Promise(async(resolve)=>{
      const response=await fetch('/posts/',{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      })
      const data = await response.json();
      resolve({data});
  })
}

export function createComment(commentData:{obj:{content:string},postId:string }){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/posts/${commentData.postId}/comments/`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentData.obj)
      })
      const data = await response.json();
      resolve({data});
  })
}
export function createCommentToComment(commentData:{obj:{content:string},postId:number,parentId:number }){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/posts/${commentData.postId}/comments/${commentData.parentId}`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentData.obj)
      })
      const data = await response.json();
      resolve({data});
  })
}

export function fetchPostLikeById(id:number) {
    return new Promise(async (resolve) => {
      const response = await fetch(`/posts/postLikeById/${id}`);
      const data = await response.json();
      resolve({ data });
    });
}

export function deletePost(id:any) {
    return new Promise(async (resolve) => {
      const response = await fetch(`/posts/deletePost/${id}`);
      const data = await response.json();
      resolve({ data });
    });
}

