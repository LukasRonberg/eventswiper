import {useNavigate ,useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import facade from "../util/apiFacade";
import styled from "styled-components";

/* Kode til at navigere hen til en specifik eventGroups info/chat
const navigate = useNavigate();

const handleEventGroupClick = (eventGroupId) => {
  setSelectedEventGroupId(eventGroupId); // Update state for context
  navigate(`/eventgroup/${eventGroupId}`); // Navigate to the route
};

*/ 

const ForumContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const EventGroupDetails = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
  border-bottom: 1px solid #ccc;
`;

const MessagesContainer = styled.div`
  flex: 2;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div`
  background: #f0f0f0;
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: lightseagreen;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #2e8b57;
  }
`;


function Forum() {
  const { events, creatingEvent, setCreatingEvent, user } = useOutletContext();
  const { id } = useParams();
  const [eventGroup, setEventGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const fetchEventGroupDetails = async () => {
          try {
              const eventGroupDetails = await facade.fetchDataForSpecificEventGroup(id);
              setEventGroup(eventGroupDetails);
              const eventMessages = await facade.fetchMessagesForEventGroup(id);
              setMessages(eventMessages);
          } catch (error) {
              console.error("Error fetching forum data:", error);
          }
      };

      if (id) {
          fetchEventGroupDetails();
      }
  }, [id]);

  const handleSendMessage = async (e) => {
      e.preventDefault(); // Prevent page reload
      try {
          const messageDTO = {
              message: newMessage,
              username: user.username,//JSON.parse(atob(facade.getToken().split('.')[1])).username,
              eventGroupId: parseInt(id, 10),
          };

          const createdMessage = await facade.createMessage(messageDTO);
          setMessages((prevMessages) => [...prevMessages, createdMessage]);
          setNewMessage(""); // Clear the input
      } catch (error) {
          console.error("Error sending message:", error);
      }
  };
  const handleCreateEventGroup = async (evt) => {
    evt.preventDefault(); // Prevent page reload
    try {
      var eventgroupAmount = 0;
      await facade.getAllEventGroups().then((data) => {
        console.log("Event groups:", data);
        eventgroupAmount = data.length;
      });

      const eventGroupDTO = { //TODO: FØLG OP PÅ DETTE
            eventGroupTitle: document.getElementById("eventName").value,
            eventDate: document.getElementById("eventDate").value,
            eventTime: document.getElementById("eventTime").value,
            eventGroupPrice: parseFloat(document.getElementById("eventGroupPrice").value),
            eventGroupDescription: document.getElementById("description").value,
            event: events.find(event => event.eventName === document.getElementById("event").value), // Ensure you send the full event object here
            eventGroupNumber: eventgroupAmount +1, //TODO: FIKS DETTE?
          };

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
        
          // Navigate to events or specific group
          navigate("/events");
          setCreatingEvent(false);
        } catch (error) {
          console.error("Error creating event group:", error);
        }
        
        
        
    } catch (error) {
        console.error("Error creating event group:", error);
    }
};


const handleEditMessage = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };
  
  const handleSaveEdit = async () => {
    try {
      const updatedMessageDTO = {
        id: editingMessageId,
        eventGroupId: id,
        message: editText,
        username: user.username,
      };
  
      await facade.updateMessage(updatedMessageDTO);
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editingMessageId ? { ...msg, message: editText } : msg
        )
      );
  
      setEditingMessageId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    try {
      const messageToDelete = {
        id: messageId,
        eventGroupId: id,
      };
  
      await facade.deleteMessage(messageToDelete);
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? { ...msg, message: "*Deleted message*", deleted: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  
  



  return creatingEvent ? (
      <EventGroupDetails>
        <form onSubmit={handleCreateEventGroup}>
          <h1>Event Details</h1>
          <h2>
              Name: <input id="eventName" placeholder="Event Group Name" required/>
          </h2>
          <h2>
              Event type:
              <select id="event">
                  {events.map((event) => (
                      <option key={event.id} value={event.eventName}>
                          {event.eventName}
                      </option>
                  ))}
              </select>
          </h2>
          <p>
              <strong>Date:</strong> <input type="date" min="2025-01-01" id="eventDate" defaultValue="2025-01-01" required/>
          </p>
          <p>
              <strong>Time:</strong> <input type="time" id="eventTime" defaultValue="00:00" required/>
          </p>
          <p>
              <strong>Price:</strong> <input type="number" id="eventGroupPrice" min="0" required defaultValue="100" /> Kr.
          </p>
          <p>
              <strong>Description:</strong> <input id="description" placeholder="Event description" required/>
          </p>
          <Button type="submit" /*onClick={handleCreateEventGroup}*/>Create</Button>
      </form>
      </EventGroupDetails>
  ) : (
    <ForumContainer>
      <EventGroupDetails>
        <h2>{eventGroup?.eventName}</h2>
        <p>
          <strong>Date:</strong> {eventGroup?.eventDate}
        </p>
        <p>
          <strong>Time:</strong> {eventGroup?.eventTime}
        </p>
        <p>
          <strong>Price:</strong> {eventGroup?.eventGroupPrice} Kr.
        </p>
        <p>
          <strong>Description:</strong> {eventGroup?.description || "No description available."}
        </p>
      </EventGroupDetails>
  
      <MessagesContainer>
        <h3>Messages</h3>
        {messages.length > 0 ? (
  messages.map((message) => (
    <Message key={message.id}>
      <div>
        {editingMessageId === message.id ? (
          <>
            {/* Input Field for Editing */}
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ backgroundColor: "lightgreen", cursor: "pointer" }}
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                style={{ backgroundColor: "lightgray", cursor: "pointer" }}
                onClick={() => setEditingMessageId(null)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
            <>
            {/* Display "Deleted message" for deleted messages */}
            {message.message === "*Deleted message*" ? (
              <p style={{ fontStyle: "italic", color: "gray" }}>
                <strong>{message.username}:</strong> {message.message}
              </p>
            ) : (
              <>
                {/* Default Message Display */}
                <p>
                  <strong>{message.username}:</strong> {message.message}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#555" }}>
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* Edit/Delete Buttons for the Owner */}
      {message.username === user.username && !editingMessageId && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{ backgroundColor: "lightblue", cursor: "pointer" }}
            onClick={() => handleEditMessage(message.id, message.message)}
          >
            Edit
          </button>
          <button
            style={{ backgroundColor: "lightcoral", cursor: "pointer" }}
            onClick={() => handleDeleteMessage(message.id)}
            >
            Delete
          </button>
        </div>
      )}
    </Message>
  ))
) : (
  <p>No messages yet. Be the first to post!</p>
)}

  
        {/* Message Form */}
        <MessageForm onSubmit={handleSendMessage}>
          <Input
            type="text"
            placeholder="Write your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <Button type="submit">Send Message</Button>
        </MessageForm>
      </MessagesContainer>
    </ForumContainer>
  ); 
}

export default Forum;
