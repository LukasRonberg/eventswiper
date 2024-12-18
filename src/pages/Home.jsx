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
  height: 90vh;
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
  position: relative;
`;

const EventCard = styled.div`
margin-top: 0px;
  position: absolute;
  width: 100%;
  max-width: 800px;
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
  font-size: 2rem;
  margin-bottom: 10px;
  height: 200px;
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
  margin-top: 100px;
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

function Home() {
  const { events: initialEvents } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Decode username from JWT token
    const userName = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).username;

    // Fetch user data and combine event arrays
    facade.getUserById(userName).then((data) => {
      const userSwipedEvents = String(data.swipedEventsIds || "").split(",").map(Number);
      const userUnSwipedEvents = String(data.unswipedEventsIds || "").split(",").map(Number);

      // Combine the arrays and set to state
      setAllEvents([...userSwipedEvents, ...userUnSwipedEvents]);
      setLoading(false);
    });
  }, []); // Runs once on component mount

  useEffect(() => {
    if (allEvents.length > 0) {
      // Remove swiped/unswiped events from the events array
      const filteredEvents = initialEvents.filter(event => !allEvents.includes(event.id));
      setEvents(filteredEvents);

      // Reset the current index if necessary
      if (currentIndex >= filteredEvents.length) {
        setCurrentIndex(0);
      }
    } else {
      // Initialize events if allEvents is not yet loaded
      setEvents(initialEvents);
    }
  }, [allEvents, initialEvents, currentIndex]);

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

  if (loading) {
    return <NoEvents>Loading events...</NoEvents>;
  }

  if (!events || events.length === 0) {
    return <NoEvents>No events available</NoEvents>;
  }

  const currentEvent = events[currentIndex];

  return (
    <ThemeProvider theme={theme}>
    <Container>
      <CardContainer>
        {currentIndex < events.length ? (
          <EventCard key={currentEvent.id}>
{/*           <ReturnButton onClick={previousEvent}>←</ReturnButton> */}
            <EventTitle>{currentEvent.eventName}</EventTitle>
            <EventImage
              src={`/assets/${currentEvent.eventName}.jpg`}
              alt={currentEvent.eventName}
              onError={(e) => {
                console.log(`Image: ${currentEvent.eventName} not found`);
                e.target.src = 'assets/Party.jpg'; // Fallback image
              }}
            />
            <EventDescription>{currentEvent.description}</EventDescription>
            <EventExtras>
              <EventPrice>Price: ~{currentEvent.estimatedPrice} Kr.</EventPrice>
              <EventDressCode> Dress Code: {currentEvent.dressCode} </EventDressCode>
              <EventTags>Tags: {currentEvent.eventType}</EventTags>
            </EventExtras>
          </EventCard>
        ) : (
          <NoEvents>No more events available</NoEvents>
        )}
      </CardContainer>

      {currentIndex < events.length && (
        <ButtonContainer>
          <Button className="dislike" onClick={handleDislike}>👎</Button>
          <Button className="like" onClick={handleLike}>❤️</Button>
        </ButtonContainer>
      )}
    </Container>
    </ThemeProvider>
  );
}

export default Home;
