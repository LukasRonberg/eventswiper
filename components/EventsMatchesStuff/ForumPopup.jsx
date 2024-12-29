/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styled from "styled-components";
import facade from "../../src/util/apiFacade";
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
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background-color: lightcoral;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
`;

const MessageContainer = styled.div`
  background: #f0f0f0;
  margin: 10px 0;
  padding: 15px;
  border-radius: 5px;
`;

function ForumPopup({ onClose, eventGroupId, user }) {
  const [eventGroup, setEventGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (eventGroupId && user) {
      (async () => {
        try {
          const eventGroupDetails = await facade.fetchDataForSpecificEventGroup(eventGroupId);
          setEventGroup(eventGroupDetails);
          const eventMessages = await facade.fetchMessagesForEventGroup(eventGroupId);
          setMessages(eventMessages);
        } catch (error) {
          console.error("Error fetching forum data:", error);
        }
      })();
    }
  }, [eventGroupId, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageDTO = {
        message: newMessage,
        username: user.username,
        eventGroupId: parseInt(eventGroupId, 10),
      };
      const createdMessage = await facade.createMessage(messageDTO);
      setMessages([...messages, createdMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
        eventGroupId,
        message: editText,
        username: user.username,
      };
      await facade.updateMessage(updatedMessageDTO);
      setMessages((prev) =>
        prev.map((msg) =>
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
      const messageToDelete = { id: messageId, eventGroupId };
      await facade.deleteMessage(messageToDelete);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, message: "*Deleted message*", deleted: true }
            : msg
        )
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Forum</h2>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </div>

        {eventGroup && (
          <div>
            <h3>{eventGroup.eventName}</h3>
            <p><strong>Date:</strong> {eventGroup.eventDate}</p>
            <p><strong>Time:</strong> {eventGroup.eventTime}</p>
            <p><strong>Price:</strong> {eventGroup.eventGroupPrice} Kr.</p>
            <p>
              <strong>Description:</strong>{" "}
              {eventGroup.description || "No description available."}
            </p>
          </div>
        )}

        <div>
          <h4>Messages</h4>
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageContainer key={message.id}>
                {editingMessageId === message.id ? (
                  <>
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
                    {message.message === "*Deleted message*" ? (
                      <p style={{ fontStyle: "italic", color: "gray" }}>
                        <strong>{message.username}:</strong> {message.message}
                      </p>
                    ) : (
                      <>
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
              </MessageContainer>
            ))
          ) : (
            <p>No messages yet. Be the first to post!</p>
          )}

          <form onSubmit={handleSendMessage} style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Write your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button style={{ padding: "8px 16px" }} type="submit">
              Send
            </button>
          </form>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
}

export default ForumPopup;
