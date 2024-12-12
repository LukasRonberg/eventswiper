import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import facade from "/src/util/apiFacade.js";

// Styled Components

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  min-height: 100vh;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
`;

const EventCard = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 2px solid #eee;
`;

const EventDetails = styled.div`
  padding: 20px;
  text-align: center;
`;

const EventTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
`;

const EventDescription = styled.p`
  color: #555;
  font-size: 1rem;
  margin-bottom: 10px;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventPrice = styled.p`
  font-size: 1.2rem;
  color: #2ecc71;
  font-weight: bold;
`;

const EventTags = styled.p`
  color: #3498db;
  font-size: 1rem;
  margin-bottom: 5px;
`;

const EventDressCode = styled.p`
  color: #f39c12;
  font-size: 1rem;
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: #e67e22;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d35400;
  }
`;

const NoEventsMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #888;
  margin-top: 50px;
`;

function EventMatches() {
  const { events: initialEvents } = useOutletContext();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setfilteredEvents] = useState([]);

  useEffect(() => {
    const userName = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).username;

    facade.getUserById(userName).then((data) => {
      const userSwipedEvents = String(data.swipedEventsIds || "").split(",").map(Number);
      const userUnSwipedEvents = String(data.unswipedEventsIds || "").split(",").map(Number);
      setAllEvents([...userSwipedEvents/*, ...userUnSwipedEvents*/]);
    });
  }, []);

    useEffect(() => {
    if (allEvents.length > 0) {
      // Remove swiped/unswiped events from the events array
      const filteredEvents = initialEvents.filter(event => allEvents.includes(event.id));
      setfilteredEvents(filteredEvents);
    } else {
      // Initialize events if allEvents is not yet loaded
      setfilteredEvents(initialEvents);
    }
  }, [allEvents, initialEvents]);

  const handleJoin = (eventId) => {
    console.log("Joined:", eventId);
    addEventGroupToUser("true", eventId);
  };

  const addEventGroupToUser = (swipedOrNo, eventId) => {
    const userName = JSON.parse(atob(localStorage.getItem("jwtToken").split('.')[1])).username;
    /*facade
      .addEventToUser(userName, eventId, swipedOrNo)
      .then(() =>
        console.log(`Event added to user: ${userName}, Event ID: ${eventId}, Swiped: ${swipedOrNo}`)
      );*/
  };

  if (!initialEvents || initialEvents.length === 0) {
    return <NoEventsMessage>No events available</NoEventsMessage>;
  }

  return (
    <Container>
      <CardContainer>
        {filteredEvents.map((currentEvent) => (
          <EventCard key={currentEvent.id}>
            <EventImage
              src={`/assets/${currentEvent.eventName}.jpg`}
              alt={currentEvent.eventName}
              onError={(e) => {
                e.target.src = 'src/assets/Party.jpg'; // Fallback image
              }}
            />
            <EventDetails>
              <EventTitle>{currentEvent.eventName}</EventTitle>
              <EventDescription>{currentEvent.description}</EventDescription>
              <EventPrice>Price: ~{currentEvent.estimatedPrice} Kr.</EventPrice>
              <EventTags>Tags: {currentEvent.eventType}</EventTags>
              <EventDressCode>Dress Code: {currentEvent.dressCode}</EventDressCode>
              <JoinButton onClick={() => handleJoin(currentEvent.id)}>Join</JoinButton>
            </EventDetails>
          </EventCard>
        ))}
      </CardContainer>
    </Container>
  );
}

export default EventMatches;
