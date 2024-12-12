const URL = "https://eventapi.lukasronberg.dk/api";

function handleHttpErrors(res) {
if (!res.ok) {
  return Promise.reject({ status: res.status, fullError: res.json() })
}
return res.json();
}

function apiFacade() {
const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
  }
const getToken = () => {
  return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // JWT has 3 parts, the header, payload and signature. Here we access the payload, which contains the expiration date
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    return payload.exp > currentTime; // Validate that token is not expired. If exp (expiration date) is higher, the user is still logged in
  } catch (error) {
    console.error('Error decoding token:', error);
    return false; // Return false if decoding fails
  }
  //const loggedIn = getToken() != null;
  //return loggedIn;
}
const logout = () => {
  localStorage.removeItem("jwtToken");
}

const login = (username, password) => { 
    console.log(username,password)
    const options = makeOptions("POST", false, {username, password });
    return fetch(`${URL}/auth/login`, options)
        .then(handleHttpErrors)
        .then(res => {setToken(res.token) })   
}

const register = (username, password, age, phone, email) => {
  const options = makeOptions("POST", false, { username, password, age, phoneNumber: phone, email });
  return fetch(`${URL}/auth/register`, options)
    .then(handleHttpErrors)
    .catch(error => {
      console.error("Registration failed:", error);
      throw error;
    });
};

const getUserRoles = () => {
    const token = getToken()
    if (token != null) {
        const payloadBase64 = getToken().split('.')[1]
        const decodedClaims = JSON.parse(window.atob(payloadBase64))
        const roles = decodedClaims.roles
        return roles
    } else return ""
}

const hasUserAccess = (neededRole, loggedIn) => {
    const roles = getUserRoles().split(',')
    return loggedIn && roles.includes(neededRole)
}

const fetchDataForAllEvents = () => { 
    const options = makeOptions("GET",true); //True add's the token
return fetch(URL + "/event", options).then(handleHttpErrors);
}

const fetchDataForSpecificEvent = (eventId) => { 
  const options = makeOptions("GET",true); //True add's the token
return fetch(`${URL}/event/${eventId}`, options).then(handleHttpErrors);
}

const getUserById = (username) => {
  const options = makeOptions("GET", true); // `true` ensures the token is added to the headers
  return fetch(`${URL}/user/${username}`, options).then(handleHttpErrors);
};

const addEventToUser = (userId, eventid, swipedOrNo) => {
  const options = makeOptions("PUT", true, { userId, eventid, swipedOrNo });
  return fetch(URL + `/user/${userId}/event/${eventid}/${swipedOrNo}`, options).then(handleHttpErrors);
};



const getDriverById = (tripId) => {
  const options = makeOptions("GET", false); // `true` ensures the token is added to the headers
  return fetch(`${URL}/drivers/${tripId}`, options).then(handleHttpErrors);
};


const makeOptions= (method,addToken,body) =>{
  var opts = {
    method: method,
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json",
    }
  }
  if (addToken && loggedIn()) {
    opts.headers["Authorization"] = `Bearer ${getToken()}`;
  }
  if (body) {
    opts.body = JSON.stringify(body);
  }
  return opts;
}
return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchDataForSpecificEvent,
    fetchDataForAllEvents,
    hasUserAccess,
    getUserById,
    getDriverById,
    register,
    addEventToUser
}
}
const facade = apiFacade();
export default facade;
