import { useEffect } from 'react';
import { useState} from 'react'
import { useParams } from 'react-router-dom'
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
  return (
    <div className='mainNotesContainer'>
        <div>
          {
            subRelatedNotes.map((ele,index)=>( <div key={index} className='NoteTopic'>{ele.topic} <i className="fa-solid fa-trash"onClick={()=>handlenoteDelete(ele._id)}></i> <br /> <div className='NoteContent'>{ele.content}</div></div>))
          }
        </div>
        <input type="text" placeholder='Topic' value={notebody.topic} onChange={(e)=>setNoteBody({...notebody,topic:e.target.value})}/>
        <input type="text" placeholder='Content'value={notebody.content} onChange={(e)=>setNoteBody({...notebody,content:e.target.value})} />
        <div style={{display: isEmpty? "flex":"none",color:"hsla(0, 100%, 44%, 1.00)"}}>You can't add empty notes !</div>
        <button onClick={handleNoteBodySubmit}>Add New Note</button>
    </div>
  )
}

export default NotePage