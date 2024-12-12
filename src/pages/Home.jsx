import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Home.css'; // Import CSS for styling
import facade from "/src/util/apiFacade.js";

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
    if (currentIndex < events.length - 1) {
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
    return <p className="no-events">No events available</p>;
  }

  const currentEvent = events[currentIndex];

  return (
    <div>
      <div className="card-container">
        {currentIndex < events.length ? (
          <div className="event-card" key={currentEvent.id}>
            <button className="return-button" onClick={previousEvent}>
              ←
            </button>
            <h2>{currentEvent.eventName}</h2>
            <img
              src={`/assets/${currentEvent.eventName}.jpg`}
              alt={currentEvent.eventName}
              onError={(e) => {
                console.log(`Image: ${currentEvent.eventName} not found`);
                e.target.src = 'src/assets/Party.jpg'; // Fallback image
              }}
            />
            <p className="event-description">{currentEvent.description}</p>
            <br />
            <p>Price: ~{currentEvent.estimatedPrice} Kr.</p>
            <p>Tags: {currentEvent.eventType}</p>
            <p>Dress Code: {currentEvent.dressCode}</p>
          </div>
        ) : (
          <p className="no-events">No more events available</p>
        )}
      </div>

      {currentIndex < events.length && (
        <div className="button-container">
          <button className="dislike" onClick={handleDislike}>
            Dislike
          </button>
          <button className="like" onClick={handleLike}>
            Like
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
