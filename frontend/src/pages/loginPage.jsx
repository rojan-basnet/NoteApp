import  { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './signInPage.css'
import {toast,Toaster} from 'sonner'

const LoginPage = () => {
const [user,setUser]=useState({
    userName:"",
    password:""
  })
const navigate=useNavigate()
const [invalidPassword,setinvalidPassword]=useState(false)
const [userNameAvailble,setuserNameAvailble]=useState(true);
const [passwordValidMsg,setpasswordValidMsg]=useState("");
const [userExistsMsg,setUserExistsMsg]=useState("");

useEffect(()=>{
  function handleBackClick(){
    navigate('/',{replace:true})
  }
    window.addEventListener("popstate",handleBackClick)
  return ()=>{
    window.removeEventListener("popstate",addEventListener)
  }
},[navigate])
async function loginUser(e){
e.preventDefault();
    setuserNameAvailble(true)
    setinvalidPassword(false)
  if(user.password.length>=8 && user.userName.length>0){
    const toastId=toast.loading("Logging In")
    try{
      const response=await fetch(`${import.meta.env.VITE_FETCH_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        },
      )
        
        if(response.status==200){
          const resData = await response.json();
          localStorage.setItem("userId",resData.data._id);
          localStorage.setItem("userToken",resData.accessToken);
          localStorage.setItem("refreshToken",resData.refreshToken);
          toast.success("Success",{id:toastId})
          navigate(`/${resData.data._id}/dashboard`);
        }
        else if(response.status===401){
          setUser({...user,password:""})
          setinvalidPassword(true)
          setpasswordValidMsg("Incorrect Password!!!")
          toast.warning("Incorret password",{id:toastId})
        }
        else if(response.status==404){
          setuserNameAvailble(false)
          setUserExistsMsg("User doesn't exist !")
        }
    }catch(error){
      console.log(error)
    }
  }
  if(user.userName.length==0){
    setuserNameAvailble(false)
    setUserExistsMsg("You must enter your username !")
  }
  if(user.password.length<8){
    setinvalidPassword(true)
    setpasswordValidMsg("Password must be at least 8 letters !")
  }
}

  return (
    <>
    <div className="stars"></div>
    <div className='wholePageOfForm'>
      <div className='signPageForm'>
          <h1>Log In</h1>
          <form>
            <input type="text" placeholder='Username' value={user.userName}  onChange={(e)=>setUser({...user,userName:e.target.value})}/>
            <div style={{display:userNameAvailble ? "none":"flex",color:"red"}}> {userExistsMsg}</div>
            <input type="text" placeholder="Password" value={user.password} onChange={(e)=>{setUser({...user,password:e.target.value})}}  />
            <div style={{display:invalidPassword ? "flex":"none",color:"red"}}>{passwordValidMsg}</div>
          </form>
          <button onClick={loginUser}>Log in</button>
          <p>Don't have an account ? <Link to="/signUpPage">Sign Up</Link></p>
      </div>
    </div>
    <Toaster richColors />
    </>

  )
}

export default LoginPage