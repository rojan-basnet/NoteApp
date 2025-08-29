import { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './dashboard.css'

const Dashboard = () => {
const navigate=useNavigate()

  const [note,setNote]=useState({
    subject:""
  });
  const [userNotes,setUserNotes]=useState([])
  const [notesubmitCounter,setNoteSubmitCounter]=useState(0);
  const [userId,setUserId]=useState("");
  const [userToken,setUserToken]=useState("")
  const [isEmpty,setIsEmpty]=useState(false);

useEffect(()=>{
  const token=localStorage.getItem("userToken");
  const id=localStorage.getItem("userId")
  setUserToken(token);
  setUserId(id)
},[])

useEffect(()=>{
  async function handleNotesFetch(){
    if(userId){
    try{
    const res= await fetch(`/api/${userId}/dashboard`,
      {
        method:"GET",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
      }
    )
    const notes=await res.json()
    setUserNotes(notes.data)
    setNote({subject:""})
    }catch(error){
      console.log("error while fetching notes",error)
    }

  }
    }
handleNotesFetch()
},
[userId,notesubmitCounter])

async function handleNoteSubmit(){
  if(note.subject){
    setIsEmpty(false)
    try{
      const response=await fetch(`/api/${userId}/addNewNote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(note),
      },
    )
      const res = await response.json();
      setNoteSubmitCounter(NC=>NC+1)
    }catch(error){
      console.log(error)
    }
  }else{
    setIsEmpty(true)
  }

}
function handleSubjectClick(e){
const noteId=e._id
navigate(`/${userId}/${noteId}/dashboard/notebody`)
}
  return (
    <>
    <div className='dashboardContainer'>
    <div className='newSubInput'>
      <input type="text" className='subjectInput'  placeholder={isEmpty? "You must enter a subject !":"Add new subject"} style={{"--placeholder-color": isEmpty?"hsla(0, 100%, 42%, 1.00)":"grey"}} value={note.subject}  onChange={(e)=>{setNote({...note,subject:e.target.value})}}/>
      <button onClick={handleNoteSubmit}>Add Subject</button>
    </div>
    <div className='showNoteSub'>
      {
        userNotes.length==0?<div>You have no notes..</div>:userNotes.map((ele,index)=>(<button key={index} onClick={()=>handleSubjectClick(ele)}>{ele.subject}</button> ))
      }
    </div>
    </div>

    
    </>

  )
}

export default Dashboard