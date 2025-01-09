/* eslint-disable react/prop-types */
import styled from "styled-components";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
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

const CloseButton = styled.button`
  background-color: lightcoral;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  float: right;
`;

function Popup({ onClose, children }) {
  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>X</CloseButton>
        {children}
      </PopupContent>
    </PopupOverlay>
  );
}

export default Popup;
