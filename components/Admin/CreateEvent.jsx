/* eslint-disable react/prop-types */
import styled from "styled-components";
import { useState } from "react";
import { PrimaryButton, SecondaryButton } from "../../src/util/buttons";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 400px;
`;

const PopupTitle = styled.h3`
  margin-top: 0;
`;

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
    <PopupOverlay>
      <PopupContent>
        <PopupTitle>Create Event</PopupTitle>
        <p>Hvis fil vælges så sørg for at title matcher fil navn (-.jpg)</p>
        <p>
          <strong>Image:</strong>
          <input type="file" id="eventImage" accept="image/*" 
          name="eventImage" onChange={handleChange} /*value={formData.eventImage}*/
          />
        </p>
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
        <Select
          name="dressCode"
          value={formData.dressCode}
          onChange={handleChange}
        >
          <option value="">Select Dress Code</option>
          {["BUDGET", "STANDARD", "LUXURY", "CASUAL", "SPORTS", "FORMAL"].map(
            (dc) => (
              <option key={dc} value={dc}>
                {dc}
              </option>
            )
          )}
        </Select>
        <Select
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
        >
          <option value="">Select Event Type</option>
          {[
            "Adrenalin",
            "Chill",
            "Alcohol",
            "Educational",
            "Music",
            "Cultural",
            "Social",
            "Fitness",
            "Creative",
            "Foodie",
            "Spiritual",
            "Outdoor",
            "Sports",
            "Party",
            "Tech",
            "Charity",
          ].map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </Select>
        <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </PopupContent>
    </PopupOverlay>
  );
}

export default CreateEvent;
