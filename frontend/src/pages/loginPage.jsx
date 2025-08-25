import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './signInPage.css'

const LoginPage = () => {
const [user,setUser]=useState({
    userName:"",
    password:""
  })
const navigate=useNavigate()
const [invalidPassword,setinvalidPassword]=useState(false)
async function createNewUser(e){
e.preventDefault();

const response=await fetch(`/api/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  },
)
  const resData = await response.json();

  if(response.status==200){
    navigate(`/${resData.data._id}/dashboard`);
    localStorage.setItem("userId",resData.data._id)
  }
  if(response.status===401){
    setUser({...user,password:""})
    setinvalidPassword(true)
  }
}

  return (
    <>
    <div className='signPageForm'>
    <h1>Log In</h1>
    <form>
      <input type="text" placeholder='Username' value={user.userName}  onChange={(e)=>setUser({...user,userName:e.target.value})}/>
      <input type="text" placeholder="Password" value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}}  />
      <div style={{display:invalidPassword ? "flex":"none",color:"red"}}>Incorrect Password!!!</div>
    </form>
    <button onClick={createNewUser}>Log in</button>
    <p>Don't have an account ? <Link to="/signUpPage">Sign Up</Link></p>
    </div>
    </>

  )
}

export default LoginPage