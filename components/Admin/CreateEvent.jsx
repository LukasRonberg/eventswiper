/* eslint-disable react/prop-types */
import styled from "styled-components";
import Popup from "../Popup";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../src/util/buttons";

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

function CreateEvent({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    eventName: "",
    estimatedPrice: "",
    description: "",
    dressCode: "",
    eventType: "",
    eventImage: null,
  });

  const handleChange = (e) => {
        // Handle file input separately
        if (e.target.type === "file") {
          setFormData({ ...formData, [e.target.name]: e.target.files[0] }); // Store the selected File object
        } else {
          setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    //setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    onCreate(formData);
  };



  return (
    <Popup onClose={onClose}>  
      <h3>Create Event</h3>
      <Input 
        placeholder="Event Name" 
        name="eventName" 
        value={formData.eventName} 
        onChange={handleChange}
      />
      <Input 
        type="number"
        min="0"
        placeholder="Estimated Price" 
        name="estimatedPrice" 
        value={formData.estimatedPrice} 
        onChange={handleChange}
      />
      <Input 
        placeholder="Description" 
        name="description" 
        value={formData.description} 
        onChange={handleChange}
      />
      <Select name="dressCode" value={formData.dressCode} onChange={handleChange}>
        <option value="">Select Dress Code</option>
        {['BUDGET', 'STANDARD', 'LUXURY', 'CASUAL', 'SPORTS', 'FORMAL'].map(dc => (
          <option key={dc} value={dc}>{dc}</option>
        ))}
      </Select>
      <Select name="eventType" value={formData.eventType} onChange={handleChange}>
        <option value="">Select Event Type</option>
        {[
          'Adrenalin', 'Chill', 'Alcohol', 'Educational', 'Music', 'Cultural',
          'Social', 'Fitness', 'Creative', 'Foodie', 'Spiritual', 'Outdoor',
          'Sports', 'Party', 'Tech', 'Charity'
        ].map(et => (
          <option key={et} value={et}>{et}</option>
        ))}
      </Select>
      <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
      <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
    </Popup>
  );
}


export default CreateEvent;
