import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import './Home.css'; // Import CSS for styling
import facade from "/src/util/apiFacade.js";


function Home() {
  const { events } = useOutletContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLike = () => {
    console.log("Liked:", events[currentIndex]);
    //TODO: det skal ikke være hardcoded at det er Bob der swiper men skal være den bruger der er logget ind
    addEventToUser("Bob", "true");
    nextEvent();
  };

  const addEventToUser = (user, swipedOrNo) => {
    facade.addEventToUser(user, events[currentIndex].id, swipedOrNo).then(() => console.log("Event added to user: " + user + ":", events[currentIndex] + ", swiped: " + swipedOrNo));
  };




  const handleDislike = () => {
    console.log("Disliked:", events[currentIndex]);
    addEventToUser("Bob", "false");
    nextEvent();
  };

  const nextEvent = () => {
    if (currentIndex <= events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("No more events available");
    }
  };

  const previousEvent = () => {
    if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
    }
    }

  if (!events || events.length === 0) {
    return <p className="no-events">No events available</p>;
  }

  const currentEvent = events[currentIndex];

  return (
    <div>
      <div className="card-container">
        {currentIndex < events.length ? (
            <div className="event-card" key={currentEvent.id}>
              <button className="return-button" onClick={previousEvent}> ← </button>
            <h2>{currentEvent.eventName}</h2>
            <img src={`src/assets/${currentEvent.eventName}.jpg`}
                alt={currentEvent.eventName}
                onError={(e) => e.target.src = 'src/assets/Party.jpg'}  // Fallback image
            />

            <p className="event-description"> {currentEvent.description}</p>
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
          <button className="dislike" onClick={handleDislike}> Dislike </button>
          <button className="like" onClick={handleLike}> Like </button>
        </div>
      )}
    </div>
  );
}

export default Home;
