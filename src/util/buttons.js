import { styled } from "styled-components";

export const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 16px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const SecondaryButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #bbb;
  }
`;
