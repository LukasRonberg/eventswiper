/* eslint-disable react/prop-types */
import { useState } from "react";
import facade from "../util/apiFacade";
import { styled } from "styled-components";

const RegisterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const RegisterMainContent = styled.div`
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const RegisterTitle = styled.h1`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SwitchButton = styled.button`
  margin-top: 10px;
  background: none;
  color: ${({ theme }) => theme.colors.link};
  border: none;
  cursor: pointer;
  text-decoration: underline;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const WarningMessage = styled.span`
  color: red;
  font-size: 0.9em;
  margin-top: -10px;
`;

function Register({ setIsRegistering }) {
  const init = { username: "", confirmPassword: "", age: "", phone: "", email: "", password: "" };
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
      setIsRegistering(false);
    } catch (err) {
      const errorMessage = err.fullError ? await err.fullError.message : "An error occurred during registration.";
      setError(errorMessage);
    }
  };

  const onSwitchToLogin = () => {
    setIsRegistering(false);
  }

  const onChange = (evt) => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value,
    });
  };

  return (
    <RegisterContent>
      <RegisterMainContent>
        <RegisterTitle>Register User</RegisterTitle>
        <StyledForm onSubmit={performRegister}>
          <Input
            placeholder="User Name"
            id="username"
            onChange={onChange}
            value={loginCredentials.username}
          />
          <Input
            placeholder="Age"
            id="age"
            type="number"
            onChange={onChange}
            value={loginCredentials.age}
          />
          <Input
            placeholder="Phone Number"
            id="phone"
            type="tel"
            onChange={onChange}
            value={loginCredentials.phone}
          />
          <Input
            placeholder="Email"
            id="email"
            type="email"
            onChange={onChange}
            value={loginCredentials.email}
          />
          <Input
            placeholder="Password"
            id="password"
            type="password"
            onChange={onChange}
            value={loginCredentials.password}
          />
          <Input
            placeholder="Confirm Password"
            id="confirmPassword"
            type="password"
            onChange={onChange}
            value={loginCredentials.confirmPassword}
          />
          {loginCredentials.password && loginCredentials.confirmPassword && 
            loginCredentials.password !== loginCredentials.confirmPassword && (
              <WarningMessage>Passwords do not match!</WarningMessage>
          )}
          
          <Button type="submit">Register</Button>
        </StyledForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SwitchButton onClick={onSwitchToLogin}>Already have an account? Log In</SwitchButton>
      </RegisterMainContent>
    </RegisterContent>
  );
}

export default Register;
