export function searchUser(userData:any){
    return new Promise(async(resolve)=>{
        const response=await fetch(`/users/searchUsers/`,{
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
export function searchPost(postData:any){
    return new Promise(async(resolve)=>{
        const response=await fetch(`/posts/searchPost/`,{
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