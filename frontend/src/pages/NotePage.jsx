import { useEffect } from 'react';
import { useState} from 'react'
import { useParams ,NavLink,useNavigate} from 'react-router-dom'
import './notePage.css'


const NotePage = () => {
const [notebody,setNoteBody]=useState({
    topic:"",
    content:"",
    noteId:""
})
const [subRelatedNotes,setSubRelatedNotes]=useState([]);
const [newNoteCounter,setNewNoteCounter]=useState(0);
const [isEmpty,setIsEmpty]=useState(false);
const [userToken,setUserToken]=useState("");
const {id,noteId}=useParams()
const [showAddNote,setShowAddNote]=useState(false);
const [showMailBox,setshowMailBox]=useState(false)
const navigate=useNavigate()

useEffect(()=>{
  const token=localStorage.getItem("userToken");
  setUserToken(token);
},[])

useEffect(()=>{
  if (!userToken) return
  try{
      async function fetchNotes(){
        const res=await fetch(`/api/${id}/${noteId}/dashboard/notebody`,
        {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        })
      const data=await res.json()
      setSubRelatedNotes(data.data)
      }
    fetchNotes()
  }catch(error){
    console.log(error)
  }

},[userToken,newNoteCounter])

async function handleNoteBodySubmit(){
  if(notebody.topic && notebody.content){
    setIsEmpty(false)
    try{
      const res=await fetch(`/api/${id}/${noteId}/dashboard/notebody`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body:JSON.stringify(notebody)
        },
      )
      const data = await res.json();
      setNewNoteCounter(prev=>prev+1)
      setNoteBody({topic:"",content:""})
    }catch(error){
      console.log(error)
    }
  }else{
    setIsEmpty(true)
  }

}
async function handlenoteDelete(NoteDelId){
    try{
        const res=await fetch(`/api/${id}/${noteId}/${NoteDelId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userToken}`
            },
            body: JSON.stringify(notebody),
          },
        )
        const data = await res.json();
        setNewNoteCounter(prev=>prev+1);
    }catch(error){
      console.log(error)
    }
}
function handleMailBoxShow(){
  setshowMailBox(true)
}
function hideMailBox(){
  setshowMailBox(false)
}
async function handleUserLogout(){
  const res= await fetch('/api/auth/del',{
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
  return (
    <>
    <div className='navbarNoteBody' >
      <button className='mailIcon' onClick={handleMailBoxShow}><i class="fa-solid fa-envelope"></i></button>
      <div className='mailboxWhole' style={{display:showMailBox?"flex":"none"}}>
          <div className='mailbox'> <div><h1>Mail Box </h1> <div className='hideBtn' onClick={hideMailBox}>X</div> </div> </div>
         
         </div>
      <div>
        <div><NavLink to= {`/${id}/${noteId}/dashboard/notebody` } className={({ isActive }) => (isActive ? "active" : "")}>Your notes</NavLink></div>
        <div><NavLink to= {`/${id}/${noteId}/dashboard/friends/notebody` } className={({ isActive }) => (isActive ? "active" : "")}>Friend's notes</NavLink></div>
      </div>
       <button onClick={handleUserLogout} className='logoutBtn' ><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>
      <div className='notesContainer'>
          {subRelatedNotes.length === 0 ? (
            <div className='noNotesMessage'>
              <div className='noNotesIcon'>📝</div>
              <h3>No Notes Yet</h3>
              <p>Start by adding your first note! Click the + button above to get started.</p>
            </div>
          ) : (
            subRelatedNotes.map((ele,index)=>(
              <div key={index} className='NoteTopic'>
                {ele.topic} 
                <i className="fa-solid fa-trash" onClick={()=>handlenoteDelete(ele._id)}></i> 
                <br /> 
                <div className='NoteContent'>{ele.content}</div>
              </div>
            ))
          )}
        </div>
    <div className='mainNotesContainer' style={{display:showAddNote? "block":"none"}}>

        <input type="text" placeholder='Topic' value={notebody.topic} onChange={(e)=>setNoteBody({...notebody,topic:e.target.value})}/>
        <input type="text" placeholder='Content'value={notebody.content} onChange={(e)=>setNoteBody({...notebody,content:e.target.value})} />
        <div style={{display: isEmpty? "flex":"none",color:"hsla(0, 100%, 44%, 1.00)"}}>You can't add empty notes !</div>
        <button onClick={handleNoteBodySubmit}>Add New Note</button>
        
    </div>
    <div className='addNoteButton' onClick={()=>setShowAddNote(prev=>!prev)}>+</div>
    </>
  )
}

export default NotePage