import { useContext } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { AppContext } from './context/AppContext'
import './index.css'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Home from './pages/Home'
import Task from './pages/Tasks/task.component'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const { user } = useContext(AppContext) as any;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={user ? <Home /> : <Navigate to="/login" />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/tasks" element={<Task />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
