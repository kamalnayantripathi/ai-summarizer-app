import { AuthProvider } from './context/AuthContext.jsx'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { SignUp } from './pages/SignUp.jsx'
import { Login } from './pages/Login.jsx'
import { Summarize } from './pages/Summarize.jsx'
import { History } from './pages/History.jsx'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer position="top-center" autoClose={3000} />
          <div className='pb-[60px]'>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/history" element={<History />} />
              <Route path="/summarize" element={<Summarize />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
