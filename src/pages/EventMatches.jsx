import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { styled, ThemeProvider } from "styled-components";
import facade from "/src/util/apiFacade.js";
import theme from "/src/util/theme";

// Styled Components

const Container = styled.div`
  font-family: "Arial", sans-serif;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  min-height: 100vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const CreateButton = styled.button`
padding: 20px 50px;
margin-top: 20px;
  font-size: 5rem;
  color: #fff;
  background-color: ${(props) => props.theme.colors.like};
  border: none;
  border-radius: 100%;
  cursor: pointer;
  transition: background-color 0.3s ease;
 &:hover {
    background-color: ${(props) => props.theme.colors.likeHover};
  }
`;

const FilterButton = styled.button.attrs((props) => ({
    // Prevent `isJoined` from being passed to the DOM
    isActive: undefined,
  }))`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: ${(props) => (props.$isActive ? props.theme.colors.like : props.theme.colors.dislike)};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.colors.likeHover : props.theme.colors.dislike)};
  }
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

const JoinButton = styled.button.attrs((props) => ({
  // Prevent `isJoined` from being passed to the DOM
  isJoined: undefined,
}))`
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background-color: ${(props) =>
    props.$isJoined ? props.theme.colors.dislike : props.theme.colors.like};
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.$isJoined ? props.theme.colors.dislikeHover : props.theme.colors.likeHover};
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
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [user, setUser] = useState({});
  const [viewMode, setViewMode] = useState("all"); // "all" or "joined"

  useEffect(() => {
    const userName = JSON.parse(
      atob(localStorage.getItem("jwtToken").split(".")[1])
    ).username;

    facade
      .getUserById(userName)
      .then((data) => {
        //console.log("User data:", data); // Log the data to inspect its structure
        const userSwipedEvents = String(data.swipedEventsIds || "")
          .split(",")
          .map(Number);
        let userJoinedEvents = []; /*String(data.joinedEventsIds || "").split(",").map(Number)*/

        for (const eventgroup of data.eventGroups) {
          //console.log("User groups:", eventgroup);
          userJoinedEvents.push(eventgroup.eventGroupId);
        }

        console.log("User joined events:", userJoinedEvents);

        setAllEvents([...userSwipedEvents]);
        setJoinedEvents(userJoinedEvents);
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    if (viewMode === "all") {
      setFilteredEvents(
        initialEvents.filter((event) => allEvents.includes(event.id))
      );
    } else if (viewMode === "joined") {
      setFilteredEvents(
        initialEvents.filter((event) => joinedEvents.includes(event.id))
      );
    }
  }, [viewMode, allEvents, joinedEvents, initialEvents]);

  const handleJoin = (eventId) => {
    console.log("Joined:", eventId);
    addEventGroupToUser(eventId);
  };

  const addEventGroupToUser = (eventId) => {
    facade.addEventGroupToUser(user.username, eventId).then(() => {
      setJoinedEvents([...joinedEvents, eventId]);
      console.log(
        `Event group added to user: ${user.username}, Event ID: ${eventId}`
      );
    });
  };

  const handleLeave = (eventId) => {
    console.log("Left:", eventId);
    removeEventGroupFromUser(eventId);
  };

  const removeEventGroupFromUser = (eventId) => {
    facade
      .removeEventGroupFromUser(user.username, eventId)
      .then(() => {
        setJoinedEvents(joinedEvents.filter((id) => id !== eventId));
        console.log(
          `Event group removed from user: ${user.username}, Event ID: ${eventId}`
        );
      })
      .catch((error) => {
        console.error("Error removing event group:", error);
      });
  };

  if (!initialEvents || initialEvents.length === 0) {
    return <NoEventsMessage>No events available</NoEventsMessage>;
  }

  return (
    <ThemeProvider theme={theme}>
    <Container>
      <ButtonContainer>
        <FilterButton
          $isActive={viewMode === "all"}
          onClick={() => setViewMode("all")}
        >
          Explore All Liked Event Groups
        </FilterButton>
        <FilterButton
          $isActive={viewMode === "joined"}
          onClick={() => setViewMode("joined")}
        >
          Explore Joined Event Groups
        </FilterButton>
      </ButtonContainer>

      <CardContainer>
        {filteredEvents.map((currentEvent) => (
          <EventCard key={currentEvent.id}>
            <EventImage
              src={`/assets/${currentEvent.eventName}.jpg`}
              alt={currentEvent.eventName}
              onError={(e) => {
                e.target.src = "src/assets/Party.jpg"; // Fallback image
              }}
            />
            <EventDetails>
              <EventTitle>{currentEvent.eventName}</EventTitle>
              <EventDescription>{currentEvent.description}</EventDescription>
              <EventPrice>Price: ~{currentEvent.estimatedPrice} Kr.</EventPrice>
              <EventTags>Tags: {currentEvent.eventType}</EventTags>
              <EventDressCode>
                Dress Code: {currentEvent.dressCode}
              </EventDressCode>
              <JoinButton
                $isJoined={joinedEvents.includes(currentEvent.id)} // Pass as $isJoined
                onClick={() =>
                  joinedEvents.includes(currentEvent.id)
                    ? handleLeave(currentEvent.id)
                    : handleJoin(currentEvent.id)
                }
              >
                {joinedEvents.includes(currentEvent.id) ? "Leave" : "Join"}
              </JoinButton>
            </EventDetails>
          </EventCard>
        ))}
      </CardContainer>
      <ButtonContainer>
        <CreateButton>
          +
        </CreateButton>
      </ButtonContainer>
    </Container>
    </ThemeProvider>
  );
}

export default EventMatches;
