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
  flex-direction: column; /* To include the navbar at the top */
  height: 100vh;
  color: #333;
`;

const Navbar = styled.nav`
  background-color: lightseagreen;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
`;

const NavItem = styled.button`
  width: 200px;
  background: none;
  color: white;
  font-size: 1.2rem;
  margin: 0 40px;
  cursor: pointer;
  transition: color 0.3s ease;
  border: none;

  &:hover {
    color: #c8e6c9;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 5px;
  background-color: #fafafa;
  border-left: 2px solid #ccc;
  overflow-y: auto; /* Allows scrolling inside the main content */
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [events, setEvents] = useState([]);
  const [user,setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage(null);
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      if (facade.loggedIn()) {
        setLoggedIn(true);
        const token = facade.getToken();
        const username = getUsernameFromToken(token);

        try {
          const userDetails = await facade.getUserById(username);
          setUser(userDetails);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        logout();
      }
      setIsLoading(false); // Stop loading after fetch
    };

    fetchUser();
  }, []);

  const getUsernameFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username;
    } catch (error) {
      console.error("Failed to decode the token or extract username:", error);
      return null;
    }
  };
  
  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    setUser({});
  };

  const login = async (user, pass) => {
    try {
      await facade.login(user, pass);
      setLoggedIn(true);
      setIsLoading(true); // Reset loading state to fetch user data again
      const token = facade.getToken();
      const username = getUsernameFromToken(token);

      const userDetails = await facade.getUserById(username);
      setUser(userDetails);
      setIsLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    try {
      facade.fetchDataForAllEvents().then((data) => setEvents(data));
    } catch (error) {
      setErrorMessage("An error occurred while fetching event data." + error);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return (
    <ThemeProvider theme={theme}>
      {!loggedIn ? (
        isRegistering ? (
          <Register setIsRegistering={setIsRegistering} />
        ) : (
          <LogIn login={login} setIsRegistering={setIsRegistering} />
        )
      ) : (
        <Content>
          <Navbar>
            <div>
              <NavItem onClick={() => navigate("/")}>Home</NavItem>
              <NavItem onClick={() => navigate("/events")}>Matches</NavItem>
              <NavItem onClick={() => navigate("/profile")}>Profile</NavItem>
            </div>
            <NavItem onClick={logout}>Logout</NavItem>
          </Navbar>
          <MainContent>
            {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}
            <Outlet context={{events, user}}/>
          </MainContent>
        </Content>
      )}
    </ThemeProvider>
  );
}

export default App;
