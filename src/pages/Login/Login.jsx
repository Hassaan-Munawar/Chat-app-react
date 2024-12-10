import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup , login ,resetPass} from '../../config/firebase'

const Login = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const onSubmitHandler = (e)=>{
    e.preventDefault()
    if(currState === "Sign up"){
      signup(username,email,password)
    }
    else{
      login(email,password)
    }


  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currState}</h2>
        {currState === "Sign up" ? <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-input" required /> : null}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="form-input" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="form-input" required />
        <button type="submit">{currState === "Sign up" ? "Create Account" : "Login now"}</button>
        <div className="login-term">
          <input  type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {
            currState === "Sign up" ? <p className='login-toggle'>Already have an account ? <span onClick={() => setCurrState("Login")}>Login here</span></p> : <p className='login-toggle'>Create an account .. <span onClick={() => setCurrState("Sign up")}>Click here</span></p>
          }{
            currState === "Login" ? <p className='login-toggle'>Forgot Password ? <span onClick={() => resetPass(email)}>Rest here</span></p> :null
          }
        </div>
      </form>

    </div>
  )
}

export default Login