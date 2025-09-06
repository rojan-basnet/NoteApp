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
  const [loading,setLoading]=useState(false);
  const [multiSelectIsON,setMultiSelectIsON]=useState(false)
  const [selectedNotesId,setSelectedNotesId]=useState([])
  

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
    const res= await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${userId}/dashboard`,
      {
        method:"GET",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
      }
    )
    if(res.status===403){
      console.log("token expired")

    }
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
    setLoading(true)
    setIsEmpty(false)
    try{
      const response=await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${userId}/addNewNote`,
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
      setLoading(false)
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

async function handleUserLogout(){
  const res= await fetch(`${import.meta.env.VITE_FETCH_URL}/api/auth/del`,{
    method:"DELETE",
    headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userToken}`
    },
    body:JSON.stringify({refreshToken:localStorage.getItem("refreshToken")})
  })
  if(res.ok){
    navigate('/loginPage')
  }
  const data= await res.json()
}

function handleMultitSelect(){
  setMultiSelectIsON(!multiSelectIsON)
}

function handleSelectedNotes(ele){
   setSelectedNotesId(prev => {
    if (prev.includes(ele._id)) {
      return prev.filter(id => id !== ele._id);
    } else {
      return [...prev, ele._id];
    }
  });
}


async function handleSelectedNoteDelete(){

  if(selectedNotesId.length>0){
    const res= await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${userId}/deleteNotes`,{
      method:"DELETE",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body:JSON.stringify({ids:selectedNotesId})
    }
    )
    const data= await res.json()
    
  }
  setNoteSubmitCounter(prev=>prev+1)
  setSelectedNotesId([])
  setMultiSelectIsON(false)
}
  return (
    <>
    <div className='navbarNoteBody'>
      <h1>NOTES</h1>
      <div>
        <button onClick={handleUserLogout} className='logoutBtn' ><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
        <button onClick={handleMultitSelect}><i className="fa-solid fa-list-check"></i></button>
      </div>
    </div>

    <div className='dashboardContainer'>
        <div className='newSubInput'>
          <input type="text" className='subjectInput'  placeholder={isEmpty? "You must enter a subject !":"Add new subject"} style={{"--placeholder-color": isEmpty?"hsla(0, 100%, 42%, 1.00)":"grey"}} value={note.subject}  onChange={(e)=>{setNote({...note,subject:e.target.value})}}/>
          <button onClick={handleNoteSubmit} disabled={loading}>{ loading? <div className="loader"></div>:"Add Subject" }</button>
        </div>

        <div className='showNoteSub'>
          {
            userNotes.length==0?<div>You have no notes..</div>:userNotes.map(
              (ele,index)=>(
                <div key={ele._id} className='subjectContainer'>
                  
                  <input type="checkbox"
                    checked={selectedNotesId.includes(ele._id)}
                    style={{display:multiSelectIsON?"block":"none"}}
                    onChange={() => handleSelectedNotes(ele)} 
                     className='checkbox'/>

                  <button onClick={()=>{
                    if(multiSelectIsON){
                      handleSelectedNotes(ele);
                    }else{
                      handleSubjectClick(ele);
                    }
                    }
                  }> {ele.subject}
                </button> 

              </div>))
          }
        </div>
    </div>

    <div className='optinsToShare' style={{display:multiSelectIsON?"flex":"none"}}>
          <button onClick={handleSelectedNoteDelete}><i className="fa-solid fa-trash"></i></button>
          <button><i className="fa-solid fa-share"></i></button>
    </div>
    </>

  )
}

export default Dashboard