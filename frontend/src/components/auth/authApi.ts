export function createUser(userData:object){
    return new Promise(async(resolve,reject)=>{
      try {
        const response=await fetch('/auth/signup',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        
        if (response.ok) {
          const data = await response.json();
          resolve({ data });
        } else {
          const data = await response.json();
          reject( data.message );
        }
      }catch(error){
        reject(error);
      }
    })
}

export function loginUser(loginInfo:object) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          body: JSON.stringify(loginInfo),
          headers: { "content-type": "application/json" },
        });
          console.log(response)
          
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          resolve({ data });
        } else {
          const error = await response.text();
          console.log(error)
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });
}

export function checkAuth() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/auth/check');
        if (response.ok) {
          const data = await response.json();
          resolve({ data });
        } else {
          const error = await response.statusText;
          reject(error);
        }
      } catch (error) {
        reject( error );
      }
    });
  }

  export function signOut() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/auth/logout');
        if (response.ok) {
          resolve({ data:'success' });
        } else {
          const error = await response.text();
          reject(error);
        }
      } catch (error) {
        // console.log(error)
        reject( error );
      }
    });
  }