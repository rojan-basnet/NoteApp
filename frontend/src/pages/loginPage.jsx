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
const [invalidPassword,setInvalidPassword]=useState(false)
async function createNewUser(e){
e.preventDefault();

const response=await fetch('https://noteapp-3ep8.onrender.com/api/login',
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
    setInvalidPassword(true)
  }
}
function handleRetryClick(){
  setInvalidPassword(false)
}
  return (
    <>
    <div className='signPageForm'>
    <h1>Log In</h1>
    <form>
      <input type="text" placeholder='Username' value={user.userName}  onChange={(e)=>setUser({...user,userName:e.target.value})}/>
      <input type="text" placeholder="Password" value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}}  />
    </form>
    <button onClick={createNewUser}>Log in</button>
    <p>Don't have an account ? <Link to="/signUpPage">Sign Up</Link></p>
    <div style={{display:invalidPassword ? "flex":"none"}}>Incorrect Password!!! <button onClick={handleRetryClick}>Retry</button></div>
    </div>
    </>

  )
}

export default LoginPage