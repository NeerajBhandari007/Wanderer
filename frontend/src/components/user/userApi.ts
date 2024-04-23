export function fetchLoggedInUser(){
    return new Promise(async(resolve)=>{
        const response=await fetch('/users/profile')
        const data = await response.json();
        resolve({data});
    })
}
export function fetchRandomnUser(){
    return new Promise(async(resolve)=>{
        const response=await fetch('/users/random')
        const data = await response.json();
        resolve({data});
    })
}

export function fetchFollowUserId(id:any) {
    return new Promise(async (resolve) =>{
      //TODO: we will not hard-code server URL here
      const response = await fetch('/users/follow/'+id, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
      ) 
      const data = await response.json()
      resolve({data})
    }
    );
}

export function unFollowUserId(id:any) {
    return new Promise(async (resolve) =>{
      const response = await fetch('/users/unfollow/'+id, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
      ) 
      const data = await response.json()
      resolve({data})
    }
    );
}
export function fetchLikedPost(){
    return new Promise(async(resolve)=>{
        const response=await fetch('/users/getLikedPost')
        const data = await response.json();
        resolve({data});
    })
}

export function likePost(postId:number){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/users/like/${postId}`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
      })
      const data = await response.json();
      resolve({data});
  })
}
export function unlikePost(postId:number){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/users/unlike/${postId}`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
      })
      const data = await response.json();
      resolve({data});
  })
}
export function likeComment(commentId:number){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/users/likeComment/${commentId}`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
      })
      const data = await response.json();
      resolve({data});
  })
}
export function unlikeComment(commentId:number){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/users/unlikeComment/${commentId}`,{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
      })
      const data = await response.json();
      resolve({data});
  })
}

export function totalCommentLike(commentId:number){
  return new Promise(async(resolve)=>{
      const response=await fetch(`/users/totalCommentLikes/${commentId}`)
      const data = await response.json();
      resolve({data});
  })
}

export function fetchUserInfoById(id:number){
    return new Promise(async(resolve)=>{
        const response=await fetch(`/users/profile/${id}`)
        const data = await response.json();
        resolve({data});
    })
  }
export function fetchUserFreinds(){
    return new Promise(async(resolve)=>{
        const response=await fetch(`/users/getFriends/`)
        const data = await response.json();
        resolve({data});
    })
  }
export function fetchOldChat(userId:any){
    return new Promise(async(resolve)=>{
        const response=await fetch(`/users/getOldChat/${userId}`)
        const data = await response.json();
        resolve({data});
    })
}
export function updateUser(userData:any){
    return new Promise(async(resolve)=>{
        const response=await fetch(`/users/updateUser/`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        const data = await response.json();
        resolve({data});
    })
  }

  