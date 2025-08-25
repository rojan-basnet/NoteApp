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

useEffect(()=>{
  const id=localStorage.getItem("userId");
  setUserId(id);
},[])

useEffect(()=>{
  async function handleNotesFetch(){
    if(userId){
    try{
    const res= await fetch(`${process.env.FETCH_URL}/api/${userId}/dashboard`,
      {
        method:"GET",
        headers:{
          "Content-Type": "application/json",
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
  const response=await fetch(`${process.env.FETCH_URL}/api/${userId}/addNewNote`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  },
)
  const res = await response.json();
  setNoteSubmitCounter(NC=>NC+1)
}
function handleSubjectClick(e){
const noteId=e._id
navigate(`/${userId}/${noteId}/dashboard/notebody`)
}
  return (
    <>
    <div className='dashboardContainer'>
    <div className='newSubInput'>
      <input type="text" placeholder='Add New Subject' value={note.subject} onChange={(e)=>{setNote({...note,subject:e.target.value})}}/>
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