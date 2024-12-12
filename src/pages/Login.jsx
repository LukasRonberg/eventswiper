/* eslint-disable react/prop-types */
import { styled } from "styled-components";
import { useState } from "react";

const LoginContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginMainContent = styled.div`
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LoginTitle = styled.h2`
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
  margin: 0;
  font-size: 14px;
`;

function LogIn({ login, setIsRegistering }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
  const [error, setError] = useState("");


  const performLogin = (evt) => {
    evt.preventDefault();

    const isValid = login(loginCredentials.username, loginCredentials.password);
    
    if (!isValid) {
      setError("Invalid username or password. Please try again.");
      return;
    }

    // Clear error and proceed
    setError("");
    setIsRegistering(false);
    //login(loginCredentials.username, loginCredentials.password);
    //setIsRegistering(false);
  };

  const onSwitchToRegister = () =>{
    setIsRegistering(true);
  }

  const onChange = (evt) => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value,
    });
  };

  return (
    <LoginContent>
      <LoginMainContent>
        <LoginTitle>Login</LoginTitle>
        <StyledForm onSubmit={performLogin}>
          <Input
            placeholder="User Name"
            id="username"
            onChange={onChange}
            value={loginCredentials.username}
          />
          <Input
            type="password"
            placeholder="Password"
            id="password"
            onChange={onChange}
            value={loginCredentials.password}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Login</Button>
        </StyledForm>
        <SwitchButton onClick={onSwitchToRegister}>
          Don't have an account? Register
        </SwitchButton>
      </LoginMainContent>
    </LoginContent>
  );
}

export default LogIn;
