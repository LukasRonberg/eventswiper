import { styled, ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./App.css";
import theme from "./util/theme";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import facade from "./util/apiFacade";

const Content = styled.div`
  display: flex;
  margin-top: 20px;
  height: calc(100vh - 160px); /* Adjust for header and footer height */
  color: #333;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #fafafa;
  border-left: 2px solid #ccc;
  /* Allows scrolling inside the main content if needed */
`;

const ErrorBanner = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
`;

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [showRenderError, setShowRenderError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [events, setEvents] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Reset error message on route change
  useEffect(() => {
    setErrorMessage(null);
    setShowRenderError(false);
    
  }, [location]);

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };

  const login = (user, pass) => {
    facade.login(user, pass).then(() => setLoggedIn(true));
  };

  
  useEffect(() => {
    try{
      facade.fetchDataForAllEvents().then(data => setEvents(data));

    }catch(error){
      setErrorMessage("An error occurred while fetching event data." + error);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {!loggedIn ? (
        isRegistering ? (
          <Register onSwitchToLogin={() => setIsRegistering(false)} setIsRegistering={setIsRegistering} />
        ) : (
          <LogIn login={login} onSwitchToRegister={() => setIsRegistering(true)} setIsRegistering={setIsRegistering} />
        )
      ) : (
        <Content>
          <MainContent>
            {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}
            <Outlet context={{events}}/>
          </MainContent>
        </Content>
      )}
    </ThemeProvider>
  );
}

export default App;
