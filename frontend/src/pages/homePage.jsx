import {Link} from 'react-router-dom';
import mainImg from '../assets/notebodypage.png'
import image2 from '../assets/notesPage.png'

const HomePage = () => {
  return (
    <>
    <div className='navbar'>
      <h1>NOTES</h1>
      <div>
      <Link to="/signUpPage"><button>Sign Up</button></Link>
      <Link to="/loginPage" ><button>Log In</button></Link>
      </div>
    </div>
    <div className='heroSection'>

      
      <h1>Welcome Users</h1>
      <p>I present to you  the result of 3 months of learning web development</p>
      <h2>Notes App</h2>
      <p>A full stack to note app to store all your notes..</p>
      <div className='imageContainer'>
        <img src={image2} alt="second Image" />
        <img src={mainImg} alt="Main image" />
      </div>
      <div className='featuresTable'>
        <h1>Notes App Features </h1>
        <ul>
          <li> <b>Secure Auth:</b>  Signup/Login with bcrypt</li>
          <li> <b>Notes CRUD:</b> Add, delete, view notes (update feature comming soon) </li>
          <li> <b>Responsive UI:</b> Built with React</li>
          <li> <b>Backend:</b> Node.js, Express, MongoDB</li>
        </ul>
      </div>
    </div>
    </>

  )
}

export default HomePage