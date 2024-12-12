import { useOutletContext } from "react-router-dom";
import styled from "styled-components";

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ProfileContent = styled.div`
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProfileTitle = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ProfileInfo = styled.div`
  margin: 10px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const Profile = () => {
  const { user } = useOutletContext(); // Get user from parent route context

  if (!user) {
    return <ProfileContainer><ProfileContent><h3>No user data found.</h3></ProfileContent></ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileTitle>Profile Details</ProfileTitle>
        <ProfileInfo><strong>Username:</strong> {user.username}</ProfileInfo>
        <ProfileInfo><strong>Age:</strong> {user.age}</ProfileInfo>
        <ProfileInfo><strong>Phone Number:</strong> {user.phoneNumber}</ProfileInfo>
        <ProfileInfo><strong>Email:</strong> {user.email}</ProfileInfo>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
