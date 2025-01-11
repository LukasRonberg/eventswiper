import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { styled, ThemeProvider } from "styled-components";
import facade from "/src/util/apiFacade.js";
import theme from "/src/util/theme";
import CreateEventMatch from "../../components/EventsMatchesStuff/CreateEventMatch";
import ForumPopup from "../../components/EventsMatchesStuff/ForumPopup";
import { default as ReactSelect, components } from "react-select";
import FilterInputsExport from "../../components/EventsMatchesStuff/FilteringInputs";
// Styled Components

const Container = styled.div`
  font-family: "Arial", sans-serif;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  min-height: 90vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  max-height: 50px;
`;

const CreateButton = styled.button`
  width: 33%;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color:rgb(163, 47, 192);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color:rgb(119, 21, 122);
  }
`;

const FilterButton = styled.button.attrs((props) => ({
  // Prevent `isJoined` from being passed to the DOM
  isActive: undefined,
}))`
  padding: 10px 20px;
  width: 33%;
  font-size: 1rem;
  color: #fff;
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.like : props.theme.colors.dislike};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.$isActive
        ? props.theme.colors.likeHover
        : props.theme.colors.dislikeHover};
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
  margin-top: 0px;
`;

const EventTypeTitle = styled.h1`
  justify-content: center;
  text-align: center;
  width: 100%;
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
  height: 175px;
  object-fit: cover;
  border-bottom: 2px solid #eee;
`;

const EventDetails = styled.div`
  padding-bottom: 10px;
  text-align: center;
`;

const EventTitle = styled.h2`
  font-size: 1.5rem;
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
  font-size: 1rem;
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

const CheckoutButton = styled.button.attrs((props) => ({
  // Prevent `isJoined` from being passed to the DOM
}))`
  width: 90%;
  padding: 12px;
  margin-top: 15px;
  background-color: ${(props) => props.theme.colors.appColor}; // Correctly access theme property
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(24, 128, 122);
  }
`;


const JoinButton = styled.button.attrs((props) => ({
  // Prevent `isJoined` from being passed to the DOM
  isJoined: undefined,
}))`
  width: 90%;
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
      props.$isJoined
        ? props.theme.colors.dislikeHover
        : props.theme.colors.likeHover};
  }
`;

const NoEventsMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #888;
  margin-top: 50px;
`;


function EventMatches() {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showForumPopup, setShowForumPopup] = useState(false);

  const { initialEvents, setInitialEvents } = useState([]);
  const { selectedEventGroupId, setSelectedEventGroupId, setCreatingEvent } = useOutletContext();
  const [allEvents, setAllEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [user, setUser] = useState({});
  const [viewMode, setViewMode] = useState("all"); // "all" or "joined"
  const navigate = useNavigate();
  const [userSwipedEvents, setUserSwipedEvents] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    tag: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showStandardEvents, setShowStandardEvents] = useState(true);
  const [showCustomEvents, setShowCustomEvents] = useState(true);

  useEffect(() => {
    const userName = JSON.parse(
      atob(localStorage.getItem("jwtToken").split(".")[1])
    ).username;

    let userJoinedEvents = [];
    let userSwipedEvents2 = [];
    let allAllEvents = [];

    facade
      .getUserById(userName)
      .then((userData) => {
        const userSwipedEventNumbers = String(userData.swipedEventsIds || "")
          .split(",")
          .map(Number);

        return facade.getAllEventGroups().then((eventData) => {
          eventData.forEach((eventGroup) => {
            allAllEvents.push(eventGroup);

            // Check if the event group matches swiped events
            if (userSwipedEventNumbers.includes(eventGroup.eventGroupNumber)) {
              //if (!userJoinedEvents.includes(eventGroup.eventGroupId)) {
              userSwipedEvents2.push(eventGroup.eventGroupNumber);
              //}
            }

            // Add user's joined event groups
            userData.eventGroups.forEach((userEventGroup) => {
              if (!userJoinedEvents.includes(userEventGroup.eventGroupId)) {
                userJoinedEvents.push(userEventGroup.eventGroupId);
              }
            });
          });

          // Update state after processing all data
          setJoinedEvents(userJoinedEvents);
          setAllEvents(allAllEvents);
          setUserSwipedEvents(userSwipedEvents2);
          setUser(userData);

          //console.log("User joined events:", userJoinedEvents);
          //console.log("All events:", allAllEvents);
        });
      })
      .catch((error) => {
        console.error("Error fetching user or event data:", error);
      });
  }, []);

  useEffect(() => {
    if (viewMode === "all") {
      setFilteredEvents(
        //allEvents
        allEvents.filter(
          (event) =>
            userSwipedEvents.includes(event.event.id) ||
            joinedEvents.includes(event.eventGroupNumber)
        )
      );
    } else if (viewMode === "joined") {
      setFilteredEvents(
        allEvents.filter((event) =>
          joinedEvents.includes(event.eventGroupNumber)
        )
      );
    }
  }, [viewMode, allEvents, joinedEvents]);

  const handleJoin = (eventId) => {
    console.log("Joined:", eventId);
    addEventGroupToUser(eventId);
  };

  const addEventGroupToUser = (eventgroupid) => {
    facade.addEventGroupToUser(user.username, eventgroupid).then(() => {
      setJoinedEvents([...joinedEvents, eventgroupid]);
      console.log(
        "Event group added to user:" +
          user.username +
          " Event ID: " +
          eventgroupid
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
          " Event group removed from user: " +
            user.username +
            " Event ID: " +
            eventId
        );
      })
      .catch((error) => {
        console.error("Error removing event group:", error);
      });
  };

  const filteredByCriteria = (events) =>
    events.filter((event) => {
      const matchesName = filters.name
      ? event.event.eventName.toLowerCase().includes(filters.name.toLowerCase()) ||
        event.eventGroupTitle?.toLowerCase().includes(filters.name.toLowerCase())
      : true;

      // Adjust this part to check if any of the selected tags match
      const matchesTag =
        filters.tag && filters.tag.length
          ? filters.tag.some((selectedTag) =>
              event.event.eventType
                .toLowerCase()
                .includes(selectedTag.toLowerCase())
            )
          : true;

      const matchesPrice =
        (!filters.minPrice ||
          event.event.estimatedPrice >= Number(filters.minPrice)) &&
        (!filters.maxPrice ||
          event.event.estimatedPrice <= Number(filters.maxPrice));

      return matchesName && matchesTag && matchesPrice;
    });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* Filter Buttons */}
        <FilterInputsExport filters={filters} setFilters={setFilters} />
        <ButtonContainer>
          <FilterButton
            $isActive={viewMode === "all"}
            onClick={() => setViewMode("all")}
          >
            Explore
          </FilterButton>
          <FilterButton
            $isActive={viewMode === "joined"}
            onClick={() => setViewMode("joined")}
          >
            Joined
          </FilterButton>
          {/* Create Button */}
          <CreateButton onClick={() => {setShowCreatePopup(true);}}>
            Create
          </CreateButton>
        </ButtonContainer>

        {/* Standard Events */}
        <EventTypeTitle
          onClick={() => setShowStandardEvents(!showStandardEvents)}
        >
          Standard Events {showStandardEvents ? "▼" : "▶"}
        </EventTypeTitle>
        {showStandardEvents && (
          <CardContainer>
            {filteredByCriteria(filteredEvents)
              .filter(
                (event) =>
                  !event.eventGroupDescription &&
                  event.eventGroupPrice === event.event.estimatedPrice
              )
              .map((currentEvent) => (
                <EventCard key={currentEvent?.eventGroupNumber}>
                  {/* Event Card Content */}
                  <EventImage
                    src={facade.readFile(currentEvent.event.eventName + ".jpg")}
                    alt={currentEvent.event.eventName}
                    onError={(e) => {
                      // Log the error to console for better debugging
                      /*console.log(
                        `Image not found for ${currentEvent.event.eventName}, trying frontend fallback`
                      );

                      // Attempt to load the image from the frontend assets directory
                      e.target.src = `/assets/${currentEvent.event.eventName}.jpg`;*/

                      // If the second attempt fails, use a default fallback image
                     // e.target.onerror = () => {
                        console.log(
                          `Frontend image also not found for ${currentEvent.event.eventName}, using default image.`
                        );
                        e.target.src = "assets/default.jpg"; // Fallback to a default image
                      //};
                    }}
                  />

                  <EventDetails>
                    <EventTitle>{currentEvent?.event.eventName}</EventTitle>
                    <EventDescription>
                      {currentEvent?.event.description}
                    </EventDescription>
                    <EventPrice>
                      Estimated Price: ~{currentEvent?.event.estimatedPrice} Kr.
                    </EventPrice>
                    <EventTags>Tags: {currentEvent?.event.eventType}</EventTags>
                    <CheckoutButton
                      onClick={() => {
                        setSelectedEventGroupId(currentEvent?.eventGroupNumber);
                        setShowForumPopup(true);
                      }}
                    >
                      Checkout
                    </CheckoutButton>
                    <JoinButton
                      $isJoined={joinedEvents.includes(
                        currentEvent?.eventGroupNumber
                      )} // Pass as $isJoined
                      onClick={() =>
                        joinedEvents.includes(currentEvent?.eventGroupNumber)
                          ? handleLeave(currentEvent?.eventGroupNumber)
                          : handleJoin(currentEvent?.eventGroupNumber)
                      }
                    >
                      {joinedEvents.includes(currentEvent?.eventGroupNumber)
                        ? "Leave"
                        : "Join"}
                    </JoinButton>
                  </EventDetails>
                </EventCard>
              ))}
          </CardContainer>
        )}

        {/* Custom Events */}
        <EventTypeTitle onClick={() => setShowCustomEvents(!showCustomEvents)}>
          Custom Events {showCustomEvents ? "▼" : "▶"}
        </EventTypeTitle>
        {showCustomEvents && (
          <CardContainer>
            {filteredByCriteria(filteredEvents)
              .filter(
                (event) =>
                  event.eventGroupDescription ||
                  event.eventGroupPrice !== event.event.estimatedPrice
              )
              .map((currentEvent) => (
                <EventCard key={currentEvent?.eventGroupNumber}>
                  {/* Event Card Content */}
                  <EventImage
                    src={facade.readFile(currentEvent.event.eventName + ".jpg")}
                    alt={currentEvent.event.eventName}
                    onError={(e) => {
                      // Log the error to console for better debugging
                      //console.log(
                      //  `Image not found for ${currentEvent.event.eventName}, trying frontend fallback`
                     // );

                      // Attempt to load the image from the frontend assets directory
                     // e.target.src = `/assets/${currentEvent.event.eventName}.jpg`;

                      // If the second attempt fails, use a default fallback image
                     // e.target.onerror = () => {
                        console.log(
                          `Frontend image also not found for ${currentEvent.event.eventName}, using default image.`
                        );
                        e.target.src = "assets/Party.jpg"; // Fallback to a default image
                      //};
                    }}
                  />

                  <EventDetails>
                    <EventTitle>{currentEvent?.eventGroupTitle}</EventTitle>
                    <p>({currentEvent?.event.eventName} - Custom)</p>
                    <EventDescription>
                      {currentEvent?.eventGroupDescription}
                    </EventDescription>
                    <EventPrice>
                      Estimated Price: ~{currentEvent?.event.estimatedPrice} Kr.
                    </EventPrice>
                    <EventPrice>
                      Price per person: ~{currentEvent?.eventGroupPrice} Kr.
                    </EventPrice>
                    <EventTags>
                      Date: {currentEvent?.eventDate?.toString() || "N/A"},
                      Time: {currentEvent?.eventTime || "N/A"}
                    </EventTags>
                    <EventTags>Tags: {currentEvent?.event.eventType}</EventTags>
                    <CheckoutButton
                      onClick={() => {
                        setSelectedEventGroupId(currentEvent?.eventGroupNumber);
                        setShowForumPopup(true);
                        {
                          /*navigate("/eventgroup/" + currentEvent?.eventGroupNumber);*/
                        }
                      }}
                    >
                      Checkout
                    </CheckoutButton>
                    <JoinButton
                      $isJoined={joinedEvents.includes(
                        currentEvent?.eventGroupNumber
                      )} // Pass as $isJoined
                      onClick={() =>
                        joinedEvents.includes(currentEvent?.eventGroupNumber)
                          ? handleLeave(currentEvent?.eventGroupNumber)
                          : handleJoin(currentEvent?.eventGroupNumber)
                      }
                    >
                      {joinedEvents.includes(currentEvent?.eventGroupNumber)
                        ? "Leave"
                        : "Join"}
                    </JoinButton>
                  </EventDetails>
                </EventCard>
              ))}
          </CardContainer>
        )}
      </Container>

      {showForumPopup && (
        <ForumPopup
          onClose={() => setShowForumPopup(false)}
          eventGroupId={selectedEventGroupId}
          user={user}
        />
      )}

      {showCreatePopup && (
        <CreateEventMatch
          onClose={() => setShowCreatePopup(false)}
          user={user}
          onEventGroupCreated={() => {
            setShowCreatePopup(false);
            // Possibly refresh or setAllEvents(...) if needed
          }}
        />
      )}
    </ThemeProvider>
  );
}

export default EventMatches;
