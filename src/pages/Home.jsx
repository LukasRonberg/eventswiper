import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {styled, ThemeProvider } from "styled-components";
import facade from "/src/util/apiFacade.js";
import theme from "/src/util/theme";

// Styled Components

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: ${(props) => props.theme.colors.background};
  color: #333;
  height: 90%;
`;

const Title = styled.h1`
  text-align: center;
  color: #010101;
  font-size: 2.5rem;
  margin-top: 0px;
`;

const CardContainer = styled.div`
  //margin-bottom: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  position: relative;
`;

const EventCard = styled.div`
  margin-top: 0px;
  //position: absolute;
  width: 90%;
  max-width: 600px;
  height: 90%;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

const EventImage = styled.img`
  width: 100%;
  height: 50%;
  object-fit: cover;
`;

const EventTitle = styled.h2`
  margin: 10px 0;
  font-size: 2rem;
`;

const EventDescription = styled.p`
  color: #555;
  font-size: 1.2rem;
  margin: 10px;
  height: 95px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventPrice = styled.p`
  font-size: 1.5rem;
  color: #2ecc71;
  font-weight: bold;
`;

const EventTags = styled.p`
  color: #3498db;
  font-size: 1.3rem;
  margin-bottom: 5px;
`;

const EventDressCode = styled.p`
  color: #f39c12;
  font-size: 1.3rem;
`;

const EventExtras = styled.div`
  //margin-top: 100px;
`;

const ReturnButton = styled.button`
  width: 60px;
  height: 60px;
  position: absolute;
  font-size: 1.5rem;
  top: 0px;
  left: 0px;
  background-color: #ecedd4;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e5ebe5;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  height: 75px;
`;

const Button = styled.button`
  width: 200px;
  margin: 0px 20px;
  padding: 0px 0px;
  font-size: 3rem;
  //font-weight: bold;
  border: none;
  border-radius: 10%;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.like {
    color:rgb(255, 255, 255);
    background-color: ${(props) => props.theme.colors.like};
  }

  &.like:hover {
    background-color: ${(props) => props.theme.colors.likeHover};
  }

  &.dislike {
    color:rgb(255, 255, 255);
    background-color: ${(props) => props.theme.colors.dislike};
  }

  &.dislike:hover {
    background-color: ${(props) => props.theme.colors.dislikeHover};
  }
`;

const NoEvents = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
`;

const UndoUnswipedButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 90px; /* Added height for consistent sizing */
  margin: 20px auto; /* Center horizontally and add spacing */
  padding: 10px 20px; /* Add internal spacing for a polished look */
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center; /* Center text within the button */
  color: #ffffff;
  background-color:rgb(52, 124, 219);
  border: none;
  border-radius: 10px; /* Changed to pixels for smoother corners */
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #2980b9; /* Darker shade on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }

  &:active {
    background-color: #1c6a9e; /* Even darker shade on click */
    transform: translateY(0); /* Reset lift effect */
  }
`;


function Home() {
  const { events: initialEvents } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [refresh, setRefresh] = useState();

  

  useEffect(() => {
    console.log("Initial events:", initialEvents);
    // Decode username from JWT token
    const userName = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).username;

    // Fetch user data and combine event arrays
    facade.getUserById(userName).then((data) => {
      const userSwipedEvents = String(data.swipedEventsIds || "").split(",").map(Number);
      const userUnSwipedEvents = String(data.unswipedEventsIds || "").split(",").map(Number);

      // Combine the arrays and set to state
      setUser(data);
      setAllEvents([...userSwipedEvents, ...userUnSwipedEvents]);
      setLoading(false);
    });
  }, [refresh]); // Runs once on component mount

  useEffect(() => {
    if (allEvents.length > 0) {
      // Remove swiped/unswiped events from the events array
      const filteredEvents = initialEvents.filter(event => !allEvents.includes(event.id));
      setEvents(filteredEvents);

      // Reset the current index if necessary
      /*if (currentIndex >= filteredEvents.length) {
        setCurrentIndex(0);
      }*/
    } else {
      // Initialize events if allEvents is not yet loaded
      setEvents(initialEvents);
    }
  }, [allEvents, initialEvents, currentIndex, refresh]);

  const handleLike = () => {
    console.log("Liked:", events[currentIndex]);
    addEventToUser("true");
    nextEvent();
  };

  const handleDislike = () => {
    console.log("Disliked:", events[currentIndex]);
    addEventToUser("false");
    nextEvent();
  };

  const addEventToUser = (swipedOrNo) => {
    const userName = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).username;
    facade
      .addEventToUser(userName, events[currentIndex].id, swipedOrNo)
      .then(() =>
        console.log(`Event added to user: ${userName}, Event ID: ${events[currentIndex].id}, Swiped: ${swipedOrNo}`)
      );
  };

  const nextEvent = () => {
    if (currentIndex <= events.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("No more events available");
    }
  };

  const previousEvent = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const undoUnswiped = () => {
    user.unswipedEventsIds = [];
    facade.updateUser(user).then((data) => {
      console.log("Unswiped events cleared for user:", user.username);
      setCurrentIndex(0);
      setRefresh(true);
    })};

  if (loading) {
    return <NoEvents>Loading events...</NoEvents>;
  }

  const currentEvent = events[currentIndex];

  function NoMoreEvents(){
    return (
      <NoEvents>
      <h2>
        No more events available
      </h2>
      <UndoUnswipedButton onClick={undoUnswiped}>
        Check Disliked
      </UndoUnswipedButton>
    </NoEvents>
    )
  }


  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CardContainer>
          {!events || events.length === 0 ? (
            NoMoreEvents()
          ) : currentIndex < events.length ? (
            <EventCard key={currentEvent.id}>
              {/* <ReturnButton onClick={previousEvent}>←</ReturnButton> */}
              <EventTitle>{currentEvent.eventName}</EventTitle>
              <EventImage
                src={facade.readFile(currentEvent.eventName + ".jpg")}
                alt={currentEvent.eventName}
                onError={(e) => {
                  // Log the error to console for better debugging
                 // console.log(
                 //   `Image not found for ${currentEvent.eventName}, trying frontend fallback`
                //  );

                  // Attempt to load the image from the frontend assets directory
                 // e.target.src = `/assets/${currentEvent.eventName}.jpg`;

                  // If the second attempt fails, use a default fallback image
                 // e.target.onerror = () => {
                    console.log(
                      `Frontend image also not found for ${currentEvent.eventName}, using default image.`
                    );
                    e.target.src = "assets/default.jpg"; // Fallback to a default image
                 // };
                }}
              />

              <EventDescription>{currentEvent.description}</EventDescription>
              <EventExtras>
                <EventPrice>
                  Price: ~{currentEvent.estimatedPrice} Kr.
                </EventPrice>
                {/*<EventDressCode> Dress Code: {currentEvent.dressCode} </EventDressCode>*/}
                <EventTags>Tags: {currentEvent.eventType}</EventTags>
              </EventExtras>
            </EventCard>
          ) : (
            NoMoreEvents()
          )}
        </CardContainer>

        {events && events.length > 0 && currentIndex < events.length && (
          <ButtonContainer>
            <Button className="dislike" onClick={handleDislike}>
              👎
            </Button>
            <Button className="like" onClick={handleLike}>
              ❤️
            </Button>
          </ButtonContainer>
        )}
      </Container>
    </ThemeProvider>
  );
}  
export default Home;
