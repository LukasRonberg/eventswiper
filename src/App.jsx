import { styled, ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./App.css";
import theme from "./util/theme";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import facade from "./util/apiFacade";
import Admin from "./pages/Admin";

const Content = styled.div`
  display: flex;
  flex-direction: column; /* To include the navbar at the top */
  //height: 100vh;
  color: #333;
`;

const Navbar = styled.nav.attrs((props) => ({}))`
  width: 100%;
  background-color: ${(props) => props.theme.colors.appColor};
  color: white;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: hidden; /* Prevent horizontal overflow */
`;

const NavItem = styled.button`
  flex: 1; /* Distribute items evenly */
  width: 33%; /* Ensure items take up equal space */
  //max-width: 150px; /* Constrain the width of items */
  background: none;
  color: ${(props) => (props.isActive ? '#ffffff' : 'white')}; /* Highlight active item */
  font-size: 1.2rem; /* Adjust for better fit on smaller screens */
  margin: 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    color: #c8e6c9; /* Hover effect */
    background-color: rgba(255, 255, 255, 0.2); /* Light overlay effect */
  }

  ${(props) =>
    props.isActive &&
    `
    background-color: rgba(255, 255, 255, 0.4); /* Slightly highlighted background for active item */
    font-weight: bold; /* Make active item stand out */
  `}

  @media (max-width: 768px) {
    font-size: 1rem; /* Adjust font size for smaller screens */
    margin: 2px; /* Reduce margin on smaller screens */
  }
`;

const MainContent = styled.div`
  flex: 1;
  background-color: #fafafa;
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;
  overflow-y: auto; /* Allows vertical scrolling */
  overflow-x: hidden; /* Prevents horizontal scrolling */
  width: 100%; /* Ensures it spans the entire width */
  box-sizing: border-box; /* Includes padding and border in the width calculation */

  @media (max-width: 768px) {
    border-left: none; /* Remove borders for mobile views */
    border-right: none;
  }
`;


/*
const Navbar = styled.nav.attrs((props) => ({}))`
  width: 100%;
  background-color: ${(props) => props.theme.colors.appColor};
  color: white;
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled.button`
  flex: 1; /* Distribute items evenly 
  background: none;
  color: ${(props) => (props.isActive ? '#ffffff' : 'white')}; /* Highlight active item 
  font-size: 1.5rem;
  margin: 5px;
  //padding: 10px 15px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    color: #c8e6c9; /* Hover effect 
    background-color: rgba(255, 255, 255, 0.2); /* Light overlay effect 
  }

  ${(props) =>
    props.isActive &&
    `
    background-color: rgba(255, 255, 255, 0.4); /* Slightly highlighted background for active item 
    font-weight: bold; /* Make active item stand out 
  `}
`;



const MainContent = styled.div`
  flex: 1;
  //padding: 5px;
  background-color: #fafafa;
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;
  overflow-y: auto; /* Allows scrolling inside the main content 
`;*/

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
  const [user, setUser] = useState({});
  const [selectedEventGroupId, setSelectedEventGroupId] = useState();
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Check for a valid token on initial mount
  useEffect(() => {
    if (facade.loggedIn()) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    setErrorMessage(null);
  }, [location]);

  useEffect(() => {
    if (facade.loggedIn()) {
      const token = facade.getToken();
      const username = getUsernameFromToken(token);

      const isAdmin = facade.hasUserAccess("ADMIN", true);
      if (isAdmin) {
        setAdminMode(isAdmin);
        //navigate("/admin")
      }
      console.log(isAdmin);

      const fetchUser = async () => {
        try {
          const userDetails = await facade.getUserById(username);
          console.log("Fetched user details:", userDetails);
          setUser(userDetails);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUser();
    } else {
      console.log("Logged in is false");
    }
  }, [loggedIn]);

  const getUsernameFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
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
    navigate("/");
  };

  const login = (user, pass) => {
    facade.login(user, pass).then(() => {
      setLoggedIn(true);
      navigate("/");
    });
  };

  useEffect(() => {
    try {
      facade.fetchDataForAllEvents().then((data) => setEvents(data));
    } catch (error) {
      setErrorMessage("An error occurred while fetching event data." + error);
    }
  }, []);

  // Example Usage
  const NavbarComponent = ({ activeItem }) => {
    return (
      <Navbar>
        <NavItem isActive={activeItem === "/"} onClick={() => navigate("/")}>
          <strong>Home</strong>
        </NavItem>
        <NavItem isActive={activeItem === "/events"} onClick={() => navigate("/events")}>
          <strong>Matches</strong>
        </NavItem>
        <NavItem isActive={activeItem === "/profile"} onClick={() => navigate("/profile")}>
          <strong>Profile</strong>
        </NavItem>
        {/*<NavItem onClick={logout}>Logout</NavItem>*/}
      </Navbar>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      {!loggedIn ? (
        isRegistering ? (
          <Register setIsRegistering={setIsRegistering} />
        ) : (
          <LogIn login={login} setIsRegistering={setIsRegistering} />
        )
      ) : adminMode ? (
        <Admin setAdminMode={setAdminMode} />
      ) : (
        <Content>
          {NavbarComponent && (
            <NavbarComponent activeItem={location.pathname} />
          )}
          <MainContent>
            {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}
            <Outlet
              context={{
                events,
                user,
                setUser,
                selectedEventGroupId,
                setSelectedEventGroupId,
                logout,
                creatingEvent,
                setCreatingEvent,
                adminMode,
                setAdminMode,
              }}
            />
          </MainContent>
        </Content>
      )}
    </ThemeProvider>
  );
}

export default App;
