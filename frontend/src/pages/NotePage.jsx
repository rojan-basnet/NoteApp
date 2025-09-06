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
const [multiSelectIsON,setMultiSelectIsON]=useState(false)
const [selectedNotesId,setSelectedNotesId]=useState([]);
const [geminiResponse,setGeminiResponse]=useState([]);
const [isLoading,setIsLoading]=useState(false)
const [isDeleting,setIsDeleting]=useState(false);
const navigate=useNavigate()

useEffect(()=>{
  const token=localStorage.getItem("userToken");
  setUserToken(token);
},[])

useEffect(()=>{
  if (!userToken) return
  try{
      async function fetchNotes(){
        const res=await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${id}/${noteId}/dashboard/notebody`,
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
      const res=await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${id}/${noteId}/dashboard/notebody`,
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
  setShowAddNote(false)

}
async function handlenoteDelete(NoteDelId){
    try{
        const res=await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${id}/${noteId}/${NoteDelId}`,
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

function handelGenBtnClick(){
  setMultiSelectIsON(!multiSelectIsON)
  setShowAddNote(false)
}


async function handleSelectedNotes(id) {
  setSelectedNotesId(prev=>{
    if(prev.includes(id)){
      return prev.filter(Id=>Id!==id)
    }else{
      return [...prev,id]
    }
  })
}

async function handleSelectedNoteDelete(){

  setIsDeleting(true)
  if(selectedNotesId.length>0){
    const res= await fetch(`${import.meta.env.VITE_FETCH_URL}/api/${id}/${noteId}/manydel`,{
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
  setSelectedNotesId([]);
  setNewNoteCounter(prev=>prev+1);
  setMultiSelectIsON(false)
  setIsDeleting(false)

}

function handleSelectAll(){
  const ids=subRelatedNotes.map(note=>note._id)

  if(selectedNotesId.length===ids.length) return
  setSelectedNotesId(...selectedNotesId,ids)
}

async function handleFetchGemini(){

  setIsLoading(true)
  if(selectedNotesId.length==subRelatedNotes.length){
    const res= await fetch(`${import.meta.env.VITE_FETCH_URL}/api/gemini`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body:JSON.stringify({prompt:" make question and anwer from this and Output ONLY a JSON array as a string. Do NOT add any extra text. "+JSON.stringify(subRelatedNotes)})
    })

      const data=await res.json()
      const rawResponse=data.result
      const startIndex = rawResponse.indexOf("[");
      const endIndex = rawResponse.lastIndexOf("]") + 1;

      const jsonString = rawResponse.slice(startIndex, endIndex);
      const finalData = JSON.parse(jsonString); 
      setGeminiResponse(finalData)
      navigate(`/${id}/${noteId}/dashboard/notebody/questions`,{ state: { geminiResponse: finalData } })
  }

  else{
    const notes= subRelatedNotes.filter((ele,index)=>selectedNotesId.includes(ele._id))
    const res= await fetch(`${import.meta.env.VITE_FETCH_URL}/api/gemini`,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body:JSON.stringify({prompt:" make question and anwer from this and Output ONLY a JSON array as a string. Do NOT add any extra text. "+JSON.stringify(notes)})
    })

      const data=await res.json()
      const rawResponse=data.result
      const startIndex = rawResponse.indexOf("[");
      const endIndex = rawResponse.lastIndexOf("]") + 1;

      const jsonString = rawResponse.slice(startIndex, endIndex);
      const finalData = JSON.parse(jsonString); 
      setGeminiResponse(finalData)
      navigate(`/${id}/${noteId}/dashboard/notebody/questions`,{ state: { geminiResponse: finalData } })

    
  }
  setIsLoading(false)
}
  return (
    <>
    <div className='navbarNoteBody' >

      <button className='mailIcon' onClick={handleMailBoxShow}><i className="fa-solid fa-envelope"></i></button>

      <div className='mailboxWhole' style={{display:showMailBox?"flex":"none"}}>
          <div className='mailbox'> <div><h1>Mail Box </h1> <div className='hideBtn' onClick={hideMailBox}>X</div> </div> </div>
      </div>

      <div>
        <div><NavLink to= {`/${id}/${noteId}/dashboard/notebody` } className={({ isActive }) => (isActive ? "active" : "")}>Notes</NavLink></div>
        <div><NavLink to= {`/${id}/${noteId}/dashboard/friends/notebody` } className={({ isActive }) => (isActive ? "active" : "")}>Shared</NavLink></div>
        <div><NavLink to={`/${id}/dashboard/`}>Subjects</NavLink></div>
        <button onClick={handelGenBtnClick} className='genBtn'><i className="fa-solid fa-wand-magic-sparkles"></i></button>
      </div>

       <button onClick={handleUserLogout} className='logoutBtn' ><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
    </div>

      <div className='notesContainer'>
          {subRelatedNotes.length === 0 ? (
            <div className='noNotesMessage'>
              <div className='noNotesIcon'>📝</div>
              <h3>No Notes Yet</h3>
              <p>Start by adding your first note! Click the + button below to get started.</p>
            </div>
          ) : (
            subRelatedNotes.map((ele,index)=>(
              <div key={index} className='NoteTopic' onClick={()=>{if(multiSelectIsON){handleSelectedNotes(ele._id)}}}>
                <input type="checkbox" style={{display:multiSelectIsON?"flex":"none"}} checked={selectedNotesId.includes(ele._id)} onChange={handleSelectedNotes}/>
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
    <div className='addNoteButton' onClick={()=>{setShowAddNote(prev=>!prev); setMultiSelectIsON(false);}}>+</div>

    <div className='optinsToShare' style={{display:multiSelectIsON?"flex":"none"}}>
          <button disabled={isDeleting?true:false} onClick={handleSelectedNoteDelete}> <div className={isDeleting?"loader":""}></div> <i className="fa-solid fa-trash"></i><div>Delete</div></button>
          <button onClick={handleSelectAll}><i className="fa-solid fa-check-double"></i><div>Select all</div></button>
          <button disabled={isLoading?true:false} onClick={handleFetchGemini} ><div className={isLoading?"loader":""}></div><i className="fa-solid fa-wand-magic-sparkles"></i><div style={{display:"flex"}}>Generate questons</div></button>
    </div>
    </>
  )
}

export default NotePage