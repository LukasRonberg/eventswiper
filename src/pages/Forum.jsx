import { useOutletContext } from "react-router-dom";
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
    const { selectedEventGroupId } = useOutletContext();
    const [eventGroup, setEventGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchEventGroupDetails = async () => {
          try {
            const eventGroupDetails = await facade.fetchDataForSpecificEventGroup(selectedEventGroupId);
            setEventGroup(eventGroupDetails);
    
            const eventMessages = await facade.fetchMessagesForEventGroup(selectedEventGroupId);
            setMessages(eventMessages);
          } catch (error) {
            console.error("Error fetching forum data:", error);
          }
        };
    
        fetchEventGroupDetails();
      }, [selectedEventGroupId]);
    
      const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
          const messageDTO = {
            message: newMessage,
            username: JSON.parse(atob(facade.getToken().split('.')[1])).username,
            eventGroupId: parseInt(selectedEventGroupId, 10),
          };
    
          const createdMessage = await facade.createMessage(messageDTO);
          setMessages((prevMessages) => [...prevMessages, createdMessage]);
          setNewMessage(""); // Clear the input
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

     return (
    <ForumContainer>
      <EventGroupDetails>
        <h2>{eventGroup?.eventName}</h2>
        <p><strong>Date:</strong> {eventGroup?.eventDate}</p>
        <p><strong>Time:</strong> {eventGroup?.eventTime}</p>
        <p><strong>Price:</strong> ${eventGroup?.eventGroupPrice}</p>
        <p><strong>Description:</strong> {eventGroup?.description || "No description available."}</p>
      </EventGroupDetails>
      <MessagesContainer>
        <h3>Messages</h3>
        {messages.length > 0 ? (
          messages.map((message) => (
            <Message key={message.id}>
              <p><strong>{message.username}:</strong> {message.message}</p>
              <p style={{ fontSize: "0.8rem", color: "#555" }}>
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </Message>
          ))
        ) : (
          <p>No messages yet. Be the first to post!</p>
        )}
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
};

export default Forum;