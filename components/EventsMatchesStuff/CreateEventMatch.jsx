/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styled from "styled-components";
import facade from "../../src/util/apiFacade";
import { useOutletContext } from "react-router-dom";
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display:flex;
  justify-content: center;
  align-items: center;
  z-index:999;
`;

const PopupContent = styled.div`
  background: white;
  padding: 40px;
  border-radius:8px;
  width:400px;
`;

const CloseButton = styled.button`
  background-color: lightcoral;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
`;

function CreateEventMatch({ onClose, user, onEventGroupCreated }) {
  const [eventgroupAmount, setEventgroupAmount] = useState(0);
  const {events} = useOutletContext();

  useEffect(() => {
    facade.getAllEventGroups().then((data) => {
      setEventgroupAmount(data.length);
    });
  }, []);

  const handleCreateEventGroup = async (evt) => {
    evt.preventDefault(); // Prevent page reload
    try {
      var eventgroupAmount = 0;
      await facade.getAllEventGroups().then((data) => {
        console.log("Event groups:", data);
        eventgroupAmount = data.length;
      });

      const fileInput = document.getElementById("eventImage");
      const file = fileInput.files[0];

      if (!file) {
        console.log("No file selected.");
        return;
      }

      console.log("File selected:", file);

      const eventGroupDTO = {
        //TODO: FØLG OP PÅ DETTE
        eventGroupTitle: document.getElementById("eventName").value,
        eventDate: document.getElementById("eventDate").value,
        eventTime: document.getElementById("eventTime").value,
        eventGroupPrice: parseFloat(document.getElementById("eventGroupPrice").value),
        eventGroupDescription: document.getElementById("description").value,
        event: events.find((event) => event.eventName === document.getElementById("event").value), // Ensure you send the full event object here
        eventGroupNumber: eventgroupAmount + 1, //TODO: FIKS DETTE?
      };

      try
      {
      await facade.uploadFile(file).then((data) => {
        console.log("File uploaded:", data);
      });
    } catch (error) {
      console.log("Error uploading file:", error);
    }


      /*UploadedFile file = ctx.uploadedFi  le("image");
          if (file != null) {
              Path targetPath = Paths.get("uploads/" + file.getFilename());
              Files.copy(file.getContent(), targetPath, StandardCopyOption.REPLACE_EXISTING);
          }*/

      //console.log("Event group DTO:", eventGroupDTO);
      // Ensure the event object has all the required properties (id, eventName, etc.)
      if (!eventGroupDTO.event) {
        throw new Error("Event not selected or invalid");
      }

      try {
        const response = await facade.createEventGroup(eventGroupDTO);
        //console.log("Raw Response:", response); // The response is already an object

        // Use the response data directly
        await facade.addEventGroupToUser(
          JSON.parse(atob(facade.getToken().split(".")[1])).username,
          response.eventGroupNumber
        );

        //console.log("Event group created successfully:", response);

        
      } catch (error) {
        console.error("Error creating event group:", error);
      }
    } catch (error) {
      console.error("Error creating event group:", error);
    }
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Create Event Group</h2>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </div>
        <form onSubmit={handleCreateEventGroup}>
          <p>
            <strong>Image:</strong><br/>
            <input type="file" id="eventImage" accept="image/*" />
          </p>
          <p>
            <strong>Name:</strong><br/>
            <input id="eventName" placeholder="Event Group Name" required />
          </p>
          <p>
            <strong>Event type:</strong><br/>
            <select id="event">
              {events.map((event) => (
                <option key={event.id} value={event.eventName}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </p>
          <p>
            <strong>Date:</strong><br/>
            <input
              type="date"
              min="2025-01-01"
              id="eventDate"
              defaultValue="2025-01-01"
              required
            />
          </p>
          <p>
            <strong>Time:</strong><br/>
            <input type="time" id="eventTime" defaultValue="00:00" required />
          </p>
          <p>
            <strong>Price:</strong><br/>
            <input
              type="number"
              id="eventGroupPrice"
              min="0"
              required
              defaultValue="100"
            />{" "}
            Kr.
          </p>
          <p>
            <strong>Description:</strong><br/>
            <input id="description" placeholder="Event description" required />
          </p>
          <button type="submit">
            Create
          </button>
        </form>
      </PopupContent>
    </PopupOverlay>
  );
}

export default CreateEventMatch;
