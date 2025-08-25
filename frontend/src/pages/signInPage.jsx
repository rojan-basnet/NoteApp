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

async function createNewUser(e){
  e.preventDefault();
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
  setUser({userName:"",password:""});

  if(response.status==201){
    navigate(`/${res.data._id}/dashboard`);
    localStorage.setItem("userId",res.data._id)
  }
}
  return (
    <>
    <div className='signPageForm'>
    <h1>Create an account</h1>
    <form>
      <input type="text" placeholder='Username' value={user.userName}  onChange={(e)=>setUser({...user,userName:e.target.value})}/>
      <input type="text" placeholder='Password' value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}}  />
    </form>
    <button onClick={createNewUser}>Create account</button>
    <p>Already have an account ? <Link to="/loginpage">Log in</Link></p>
    </div>
    </>
  )
}

export default SignUpPage