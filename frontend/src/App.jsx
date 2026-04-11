import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LandingPage from './pages/landing'
import Authentication from './pages/authentication'
import { AuthProvider } from './contexts/AuthContext'
import VideoMeet from './pages/videoMeet'
import HomeComponent from './pages/home'
import History from './pages/history'

function App() {
  

  return (
    <>
      <Router>
        <AuthProvider>
        <Routes>
          {/* <Route path='/home' element={<h1>Home</h1>} /> */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<Authentication />} />
          <Route path='/home' element={<HomeComponent />} />
          <Route path='/history' element={<History/>} />
          <Route path='/:url' element={<VideoMeet/>} />
        </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
