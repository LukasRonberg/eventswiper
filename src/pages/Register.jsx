import { useState } from "react";
import facade from "../util/apiFacade";

function Register() {
    const init = { username: "", password: "" };

    const [loginCredentials, setLoginCredentials] = useState(init);

const performRegister = () => {
    //facade.register();
}

 
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }

    return (  
        <>
        <h1>Register User</h1>
        <form onSubmit={performRegister}>
        <input placeholder="User Name" id="username" onChange={onChange} value={loginCredentials.username} />
        <input placeholder="Password" id="password" onChange={onChange} value={loginCredentials.password} />
        <button type="submit">Register</button>
      </form>
      </>
    );
}

export default Register;