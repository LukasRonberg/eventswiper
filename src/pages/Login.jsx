/* eslint-disable react/prop-types */
import { useState } from "react"


function LogIn({ login, onSwitchToRegister, setIsRegistering }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    
    login(loginCredentials.username, loginCredentials.password);
    setIsRegistering(false);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={performLogin}>
        <input placeholder="User Name" id="username" onChange={onChange} value={loginCredentials.username} />
        <input placeholder="Password" id="password" onChange={onChange} value={loginCredentials.password} />
        <button type="submit">Login</button>
      </form>
      <button onClick={onSwitchToRegister}>Don't have an account? Register</button>
    </div>
  )
}

export default LogIn;
