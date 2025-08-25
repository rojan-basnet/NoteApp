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
const [newNoteCounter,setNewNoteCounter]=useState(0)
const {id,noteId}=useParams()

useEffect(()=>{
  async function fetchNotes(){
    const res=await fetch(`/api/${id}/${noteId}/dashboard/notebody`,
    {
    method:"Get",
    headers: {
      "Content-Type": "application/json",
    },
    })
  const data=await res.json()
  setSubRelatedNotes(data.data)
  }
fetchNotes()
},[newNoteCounter])

async function handleNoteBodySubmit(){
 const res=await fetch(`/api/${id}/${noteId}/dashboard/notebody`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(notebody)
  },
 )
 const data = await res.json();
 setNewNoteCounter(prev=>prev+1)
 setNoteBody({topic:"",content:""})
}
async function handlenoteDelete(NoteDelId){
  const newId=NoteDelId
 const res=await fetch(`/api/${newId}`,
  {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notebody),
  },
 )
 const data = await res.json();
 setNewNoteCounter(prev=>prev+1);
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
        <button onClick={handleNoteBodySubmit}>Add New Note</button>
    </div>
  )
}

export default NotePage