/* eslint-disable react/prop-types */
import { useRef } from "react";
import Popup from "./Popup";
import { PrimaryButton, SecondaryButton } from "../../src/util/buttons";
import {styled} from "styled-components"

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

function CreateEventEksempel({ onClose, onCreate, error }) {
  const eventNameRef = useRef();
  const estimatedPriceRef = useRef();
  const descriptionRef = useRef();
  const dressCodeRef = useRef();
  const eventTypeRef = useRef();
  const eventImageRef = useRef();

  const handleCreate = () => {
    const formData = {
      eventName: eventNameRef.current.value,
      estimatedPrice: estimatedPriceRef.current.value,
      description: descriptionRef.current.value,
      dressCode: dressCodeRef.current.value,
      eventType: eventTypeRef.current.value,
      eventImage: eventImageRef.current.files[0], // File input
    };
    onCreate(formData);
  };

  return (
    <Popup onClose={onClose}>
      <h3>Create Event</h3>
      <p><strong>Image:</strong> <input type="file" ref={eventImageRef} accept="image/*" /></p>
      <input placeholder="Event Name" ref={eventNameRef} />
      <input type="number" min="0" placeholder="Estimated Price" ref={estimatedPriceRef} />
      <input placeholder="Description" ref={descriptionRef} />
      <select ref={dressCodeRef}>
        <option value="">Select Dress Code</option>
        {['BUDGET', 'STANDARD', 'LUXURY'].map(dc => <option key={dc} value={dc}>{dc}</option>)}
      </select>
      <select ref={eventTypeRef}>
        <option value="">Select Event Type</option>
        {['Adrenalin', 'Chill', 'Music'].map(et => <option key={et} value={et}>{et}</option>)}
      </select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
      <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
    </Popup>
  );
}

export default CreateEventEksempel;
