import './App.css'
import { Routes,Route } from 'react-router-dom'
import HomePage from './pages/homePage.jsx'
import LoginPage from './pages/loginPage.jsx'
import SignUpPage from './pages/signInPage.jsx'
import Dashboard from './pages/dashboard.jsx'
import NotePage from './pages/NotePage.jsx'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/loginPage' element={<LoginPage/>} />
        <Route path='/signUpPage' element={<SignUpPage/>} />
        <Route path='/:id/dashboard' element={<Dashboard/>} />
        <Route path='/:id/:noteId/dashboard/notebody' element={<NotePage/>} />
      </Routes>
    </>
  )
}

export default App
