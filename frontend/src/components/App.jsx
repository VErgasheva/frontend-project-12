import './App.css'
import HomePage from './HomePage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import NotFound from './NotFound.jsx'
import Signup from './Signup.jsx'
import Header from './Header.jsx'
import { ToastContainer } from 'react-toastify'
import PrivateRoute from './PrivateRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Header />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <ToastContainer pauseOnFocusLoss={false} position="top-right" />
      </div>
    </BrowserRouter>
  )
}

export default App