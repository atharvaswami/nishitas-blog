import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [inputs, setInputs] = useState({
    userName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setInputs(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", inputs);
      alert(res.data);
      navigate("/login");
    } catch (err) {
      setError(err.response.data);
    }
  }
  return (
    <div className='auth'>
      <h1>Register</h1>
      <form>
        <input required type='text' placeholder='userName' name='userName' onChange={handleChange}/>
        <input required type='text' placeholder='email' name='email' onChange={handleChange}/>
        <input required type='password' placeholder='password' name='password' onChange={handleChange}/>
        <button onClick={handleSubmit}>Register</button>
        {error && <p>{error}</p>}
        <span>Already have an account? <Link to="/login">Login</Link></span>
      </form>
    </div>
  )
}

export default Register