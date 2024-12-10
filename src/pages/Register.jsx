/* eslint-disable react/prop-types */
import { useState } from "react";
import facade from "../util/apiFacade";

function Register({onSwitchToLogin}) {
    const init = { username: "", password: "", confirmPassword: "", age: "", phone: "", email: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);
    const [error, setError] = useState("");

    const performRegister = async (evt) => {
        evt.preventDefault();
        if (loginCredentials.password !== loginCredentials.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            await facade.register(
                loginCredentials.username,
                loginCredentials.password,
                loginCredentials.age,
                loginCredentials.phone,
                loginCredentials.email
            );
            setError(""); // Clear any previous error
            alert("User successfully registered!");
        } catch (err) {
            const errorMessage = err.fullError ? await err.fullError.message : "An error occurred during registration.";
            setError(errorMessage);
        }
    };
    

    const onChange = (evt) => {
        setLoginCredentials({
            ...loginCredentials,
            [evt.target.id]: evt.target.value,
        });
    };

    return (
        <>
            <h1>Register User</h1>
            <form onSubmit={performRegister}>
                <input
                    placeholder="User Name"
                    id="username"
                    onChange={onChange}
                    value={loginCredentials.username}
                />
                <input
                    placeholder="Password"
                    id="password"
                    type="password"
                    onChange={onChange}
                    value={loginCredentials.password}
                />
                <input
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    onChange={onChange}
                    value={loginCredentials.confirmPassword}
                />
                <input
                    placeholder="Age"
                    id="age"
                    type="number"
                    onChange={onChange}
                    value={loginCredentials.age}
                />
                <input
                    placeholder="Phone Number"
                    id="phone"
                    type="tel"
                    onChange={onChange}
                    value={loginCredentials.phone}
                />
                <input
                    placeholder="Email"
                    id="email"
                    type="email"
                    onChange={onChange}
                    value={loginCredentials.email}
                />
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={onSwitchToLogin}>Already have an account? Log In</button>

        </>
    );
}

export default Register;
