/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import facade from "../util/apiFacade";
import { styled } from "styled-components";
import CreateEvent from "../../components/Admin/CreateEvent";
import UpdateEvent from "../../components/Admin/UpdateEvent";
import { PrimaryButton, SecondaryButton } from "../util/buttons";

const AdminContainer = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  color: #333;
`;

const AdminHeader = styled.div`
  display:flex;
  align-items:center;
  justify-content: space-between;
  margin-bottom:20px;
`;
const AdminTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const AdminTitle = styled.h1`
  margin:0;
  color: ${({ theme }) => theme.colors.primary};
`;

const SearchInput = styled.input`
  border: 1px solid #ccc;
  border-radius:4px;
  padding: 5px 10px;
  font-size:16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;

  thead {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  th,
  td {
    padding: 10px;
    border-bottom: 3px solid #888;
    text-align: left;
  }

  tr:last-child td {
    border-bottom: none;
  }

  button {
    margin-right: 10px;
    margin-top: 3px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  button.delete-button {
    background-color: red;

    &:hover {
      background-color: darkred;
    }
  }
`;





function Admin({setAdminMode}) {
  const [allEvents, setAllEvents] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateEventId, setUpdateEventId] = useState(null);
  const [updateEventData, setUpdateEventData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
      facade.fetchDataForAllEvents().then(setAllEvents);
    }, []);
    
    const handleDelete = (id) => {
      facade.deleteEvent(id).then(() => {
        setAllEvents(prev => prev.filter(event => event.id !== id));
      });
    };

    const uploadImage = async (evt) => {
      const file = evt;
  
      if (!file) {
        console.log("No file selected.");
        return;
      }
  
      console.log("File selected:", file);
  
      try {
        await facade.uploadFile(file).then((data) => {
          console.log("File uploaded:", data);
        });
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    };
    
    const handleCreate = (eventData) => {
        const eventDataWithoutImage = ({
          eventName: eventData.eventName,
          estimatedPrice: eventData.estimatedPrice,
          description: eventData.description,
          dressCode: eventData.dressCode,
          eventType: eventData.eventType,
        }) //TODO: gør dette på en pænere måde????

        facade.createEvent(eventDataWithoutImage).then(created => {
          setAllEvents(prev => [...prev, created]);
          setShowCreatePopup(false);
        });
        uploadImage(eventData.eventImage);
      };
    
    const handleUpdate = (newData) => {
        facade.updateEvent(updateEventId, newData).then(updated => {
          setAllEvents(prev => prev.map(event => event.id === updateEventId ? updated : event));
          setShowUpdatePopup(false);
          setUpdateEventId(null);
          setUpdateEventData({});
        });
      };

    const filteredEvents = allEvents.filter(event => 
      event
        //event.eventName.toLowerCase().includes(searchQuery.toLowerCase()
      //)
      ); 

    return (
        <AdminContainer>
          <AdminHeader>
        <AdminTitleRow>
          <AdminTitle>Admin Page</AdminTitle>
          <PrimaryButton onClick={() => setShowCreatePopup(true)}>Create Event</PrimaryButton>
          <SecondaryButton onClick={() => setAdminMode(false)}>Set Admin Mode to false</SecondaryButton>
        </AdminTitleRow>
        <SearchInput 
          type="text" 
          placeholder="Search events..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
        />
      </AdminHeader>
    
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Estimated Price</th>
                <th>Description</th>
                <th>Dress Code</th>
                <th>Event Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.eventName}</td>
                  <td>{event.estimatedPrice}</td>
                  <td>{event.description}</td>
                  <td>{event.dressCode}</td>
                  <td>{event.eventType}</td>
                  <td>
                  <button onClick={() => {
                      setUpdateEventId(event.id);
                      setUpdateEventData({
                        eventName: event.eventName,
                        estimatedPrice: event.estimatedPrice,
                        description: event.description,
                        dressCode: event.dressCode,
                        eventType: event.eventType
                      });
                      setShowUpdatePopup(true);
                    }}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(event.id)}>Delete</button>      
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
    
          {showCreatePopup && (
            <CreateEvent 
              onClose={() => setShowCreatePopup(false)} 
              onCreate={handleCreate} 
            />
          )}
    
          {showUpdatePopup && (
            <UpdateEvent 
              onClose={() => {
                setShowUpdatePopup(false);
                setUpdateEventId(null);
              }} 
              onUpdate={handleUpdate} 
              existingData={updateEventData}
            />
          )}
        </AdminContainer>
      );
    };
    
    export default Admin;