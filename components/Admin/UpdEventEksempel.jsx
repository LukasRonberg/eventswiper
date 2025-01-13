/* eslint-disable react/prop-types */
import { Component } from "react";
import styled from "styled-components";
import { PrimaryButton, SecondaryButton } from "../../src/util/buttons";
import Popup from "./Popup";

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

class UpdateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.existingData,
    };
  }

  handleChange = (e) => {
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [e.target.name]: e.target.value },
    }));
  };

  handleUpdate = () => {
    this.props.onUpdate(this.state.formData);
  };

  render() {
    const { formData } = this.state;
    const { onClose } = this.props;

    return (
      <Popup onClose={onClose}>
        <h3>Update Event</h3>
        <Input
          placeholder="Event Name"
          name="eventName"
          value={formData.eventName}
          onChange={this.handleChange}
        />
        <Input
          type="number"
          min="0"
          placeholder="Estimated Price"
          name="estimatedPrice"
          value={formData.estimatedPrice}
          onChange={this.handleChange}
        />
        <Input
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={this.handleChange}
        />
        <Select name="dressCode" value={formData.dressCode} onChange={this.handleChange}>
          <option value="">Select Dress Code</option>
          {["BUDGET", "STANDARD", "LUXURY", "CASUAL", "SPORTS", "FORMAL"].map((dc) => (
            <option key={dc} value={dc}>
              {dc}
            </option>
          ))}
        </Select>
        <Select name="eventType" value={formData.eventType} onChange={this.handleChange}>
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
        <PrimaryButton onClick={this.handleUpdate}>Update</PrimaryButton>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </Popup>
    );
  }
}

export default UpdateEvent;
