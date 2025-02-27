const isLocalhost = window.location.hostname.includes("localhost");
const URL = isLocalhost
  ? "http://localhost:7070/api"
  : "https://eventapi.lukasronberg.dk/api";


function handleHttpErrors(response) {
if (!response.ok) {
  return Promise.reject({ status: response.status, fullError: response.json() })
}

if (response.status === 204) {
  return Promise.resolve();
}

return response.json();
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
  console.log(username, password);

  const options = makeOptions("POST", false, { username, password });
  return fetch(`${URL}/auth/login`, options)
      .then(handleHttpErrors)
      .then(data => {
          setToken(data.token);
          if (loggedIn()) {     // Check if logged in after setting the token
              console.log("Login successful, token is valid.");
          } else {
              console.log("Login failed or token is invalid.");
          }
      });
};


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

const uploadFile = (file) => {

  const formData = new FormData();
  formData.append("file", file);
  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getToken()}`, // Include the authorization header if needed
    },
    body: formData,  // Pass formData directly as the body
  };

  return fetch(`${URL}/images/`, options).then(handleHttpErrors);
}

const readFile = (filename) => {
  return `${URL}/images/${filename}`; 
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

const addEventGroupToUser = (userId, eventgroupid) => {
  const options = makeOptions("PUT", true, { userId, eventid: eventgroupid });
  return fetch(URL + `/user/${userId}/event/${eventgroupid}`, options).then(handleHttpErrors);
};

const getAllEventGroups = () => {
  const options = makeOptions("GET", true);
  return fetch(URL + "/eventgroup", options).then(handleHttpErrors);
}

const removeEventGroupFromUser = (userId, eventid) => {
  const options = makeOptions("DELETE", true);
  return fetch(URL + `/user/${userId}/event/${eventid}`, options).then(handleHttpErrors);
}

const createEventGroup = (eventGroupDTO) => {
  const options = makeOptions("POST", true, eventGroupDTO);
  return fetch(URL + "/eventgroup/", options).then(handleHttpErrors);
}



const updateUser = (userData) => {
  const options = makeOptions("PUT", true, userData); // `true` ensures token inclusion
  return fetch(`${URL}/user/${userData.username}`, options)
    .then(handleHttpErrors)
    .catch((error) => {
      console.error("Failed to update user:", error);
      throw error;
    });
};


const fetchDataForSpecificEventGroup = (eventGroupId) => {
  const options = makeOptions("GET", true);
  return fetch(`${URL}/eventgroup/${eventGroupId}`, options).then(handleHttpErrors);
};

const fetchMessagesForEventGroup = (eventGroupId) => {
  const options = makeOptions("GET", true);
  return fetch(`${URL}/eventgroup/${eventGroupId}/message`, options).then(handleHttpErrors);
};

const createMessage = (messageDTO) => {
  const options = makeOptions("POST", true, messageDTO);
  return fetch(`${URL}/eventgroup/${messageDTO.eventGroupId}/message`, options).then(handleHttpErrors);
};

const updateMessage = (messageDTO) => {
  const options = makeOptions("PUT", true, messageDTO);
  return fetch(`${URL}/eventgroup/${messageDTO.eventGroupId}/message/${messageDTO.id}`, options)
    .then(handleHttpErrors);
};

const deleteMessage = (messageDTO) => {
  const options = makeOptions("DELETE", true);
  return fetch(`${URL}/eventgroup/${messageDTO.eventGroupId}/message/${messageDTO.id}`, options)
    .then(handleHttpErrors);
};

const createEvent = (eventDTO) => {
  const options = makeOptions("POST", true, eventDTO);
  return fetch(`${URL}/event`, options)
    .then(handleHttpErrors);
}

const updateEvent = (id, eventDTO) => {
  const options = makeOptions("PUT", true, eventDTO);
  return fetch(`${URL}/event/${id}`, options)
    .then(handleHttpErrors);
}

const deleteEvent = (id) => {
  const options = makeOptions("DELETE", true);
  return fetch(`${URL}/event/${id}`, options)
    .then(handleHttpErrors);
}



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
    fetchDataForSpecificEventGroup,
    fetchMessagesForEventGroup,
    register,
    addEventToUser,
    updateUser,
    addEventGroupToUser,
    removeEventGroupFromUser,
    createMessage,
    updateMessage,
    deleteMessage,
    createEventGroup,
    getAllEventGroups,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadFile,
    readFile,
}
}
const facade = apiFacade();
export default facade;
