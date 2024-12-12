import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components'; // Import styled-components
import facade from "/src/util/apiFacade.js";

// Styled Components

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
  color: #333;
`;

const Title = styled.h1`
  text-align: center;
  color: #010101;
  font-size: 2.5rem;
  margin-top: 0px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  position: relative;
`;

const EventCard = styled.div`
  position: absolute;
  width: 100%;
  max-width: 500px;
  height: 100%;
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
  margin: 10px 20px;
  height: 20%;
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
  margin-top: 10px;
  display: flex;
  justify-content: center;
  height: 75px;
`;

const Button = styled.button`
  margin: 10px 20px;
  padding: 10px 30px;
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  border-radius: 10%;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.like {
    color: #2c8d30;
    background-color: #e5ebe5;
  }

  &.like:hover {
    background-color: #c0c9c0;
  }

  &.dislike {
    color: #c0291e;
    background-color: #e5ebe5;
  }

  &.dislike:hover {
    background-color: #c0c9c0;
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

  useEffect(() => {
    // Decode username from JWT token
    const userName = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).username;

    // Fetch user data and combine event arrays
    facade.getUserById(userName).then((data) => {
      const userSwipedEvents = String(data.swipedEventsIds || "").split(",").map(Number);
      const userUnSwipedEvents = String(data.unswipedEventsIds || "").split(",").map(Number);

      // Combine the arrays and set to state
      setAllEvents([...userSwipedEvents, ...userUnSwipedEvents]);
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

  if (!events || events.length === 0) {
    return <NoEvents>No events available</NoEvents>;
  }

  const currentEvent = events[currentIndex];

  return (
    <Container>
      <CardContainer>
        {currentIndex < events.length ? (
          <EventCard key={currentEvent.id}>
            <ReturnButton onClick={previousEvent}>←</ReturnButton>
            <EventTitle>{currentEvent.eventName}</EventTitle>
            <EventImage
              src={`/assets/${currentEvent.eventName}.jpg`}
              alt={currentEvent.eventName}
              onError={(e) => {
                console.log(`Image: ${currentEvent.eventName} not found`);
                e.target.src = 'src/assets/Party.jpg'; // Fallback image
              }}
            />
            <EventDescription>{currentEvent.description}</EventDescription>
            <p>Price: ~{currentEvent.estimatedPrice} Kr.</p>
            <p>Tags: {currentEvent.eventType}</p>
            <p>Dress Code: {currentEvent.dressCode}</p>
          </EventCard>
        ) : (
          <NoEvents>No more events available</NoEvents>
        )}
      </CardContainer>

      {currentIndex < events.length && (
        <ButtonContainer>
          <Button className="dislike" onClick={handleDislike}>Dislike</Button>
          <Button className="like" onClick={handleLike}>Like</Button>
        </ButtonContainer>
      )}
    </Container>
  );
}

export default Home;
