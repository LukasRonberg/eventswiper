import { useOutletContext } from 'react-router-dom';
import { styled } from 'styled-components';
import { useState } from 'react';

const MainTitle = styled.h1`
  text-align: center;
`;

function Home() {
  const { events } = useOutletContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLike = () => {
    console.log("Liked:", events[currentIndex]);
    nextEvent();
  };

  const handleDislike = () => {
    console.log("Disliked:", events[currentIndex]);
    nextEvent();
  };

  const nextEvent = () => {
    if (currentIndex <= events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("No more events available");
    }
  };

  if (!events || events.length === 0) {
    return <p>No events available</p>;
  }

  const currentEvent = events[currentIndex];

  return (
    <div>
      <MainTitle>Welcome to the Event App</MainTitle>
      <p>Discover, connect, and plan events with ease!</p>
  
      {currentIndex < events.length ? (
        <div key={currentEvent.id}>
          <h2>{currentEvent.eventName}</h2>
          <p>{currentEvent.description}</p>
          <p>Estimated Price: {currentEvent.estimatedPrice} Kr.</p>
          <p>Dress Code: {currentEvent.dressCode}</p>
          <p>Tags: {currentEvent.eventType}</p>
          <br />
          <button onClick={handleLike}>Like</button>
          <button onClick={handleDislike}>Dislike</button>
        </div>
      ) : (
        <p>No more events available</p>
      )}
    </div>
  );
  
}

export default Home;
