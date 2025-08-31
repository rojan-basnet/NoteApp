import React from 'react'
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import './signInPage.css'

const SignUpPage = () => {

const [user,setUser]=useState({
  userName:"",
  password:""
})
const navigate=useNavigate()
const [invalidPassword,setinvalidPassword]=useState(false);
const [userNameAvailble,setuserNameAvailble]=useState(true);
const [useNameAvailableMsg,setuseNameAvailableMsg]=useState("");

async function createNewUser(e){
  setinvalidPassword(false)
  setuserNameAvailble(true)
  setuseNameAvailableMsg("")

  e.preventDefault();
  if(user.password.length>=8 && user.userName.length>0){
    try{
      const response=await fetch(`/api/createNewUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        },
        
      )
      const res = await response.json();

          if(response.status==201){ 
            setUser({userName:"",password:""});
            navigate(`/${res.data._id}/dashboard`);
            location.setItem("userId",res.data._id)
            localStorage.setItem("userToken",res.accessToken)
            localStorage.setItem("refreshToken",res.refreshToken);

          }
          else if(response.status==409){
            setuserNameAvailble(false)
            setuseNameAvailableMsg("Username already exists !")
    }
    }catch(error){
      console.log(error,"there is an error")
    }

  }
  if(user.userName.length==0){
    setuserNameAvailble(false)
    setuseNameAvailableMsg("You must enter your username !")
  }
  if(user.password.length<8){
    setinvalidPassword(true)
  }

}
  return (
    <>
    <div className='signPageForm'>
    <h1>Create an account</h1>
    <form>
      <input type="text" placeholder='Username' value={user.userName}  onChange={(e)=>setUser({...user,userName:e.target.value})}/>
      <div style={{display:userNameAvailble ? "none":"flex",color:"red"}}> {useNameAvailableMsg}</div>
      <input type="text" placeholder='Password' value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}}  />
      <div style={{display:invalidPassword ? "flex":"none",color:"red"}}>Password must be at least 8 letters !!!</div>
    </form>
    <button onClick={createNewUser}>Create account</button>
    <p>Already have an account ? <Link to="/loginpage">Log in</Link></p>
    </div>
    </>
  )
}

export default SignUpPage