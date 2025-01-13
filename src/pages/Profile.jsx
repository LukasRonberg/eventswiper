import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import facade from "../util/apiFacade";
import { PrimaryButton, SecondaryButton } from "../util/buttons";

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ProfileContent = styled.div`
  width: 850px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProfileTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 60px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ProfileInfo = styled.div`
  margin: 50px 0;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.h3`
  color: red;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

const Profile = () => {
  const { user, setUser, logout, setAdminMode } = useOutletContext(); // Get user from parent route context
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const isAdmin = facade.hasUserAccess("ADMIN", true);


  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const { password, age, ...otherDetails } = formData;

  const sanitizedFormData = {
    ...otherDetails, 
    password: password || undefined, 
    age: parseInt(age, 10), 
  };
    facade.updateUser(sanitizedFormData)
      .then((updatedUser) => {
        setUser(sanitizedFormData);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to update profile.");
      });
  };

  if (!user) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <h3>Loading...</h3>
        </ProfileContent>
      </ProfileContainer>
    );
  }
  
  if (Object.keys(user).length === 0) {
    return (
      <ProfileContainer>
        <ProfileContent>
        <ErrorMessage>Error: User data is missing!</ErrorMessage>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileTitle>Profile Details</ProfileTitle>
        {isEditing ? (
          <>
            <ProfileInfo>
              <strong>Username</strong> <br/>{formData.username}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Age</strong><br/>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </ProfileInfo>
            <ProfileInfo>
              <strong>Phone Number</strong><br/>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </ProfileInfo>
            <ProfileInfo>
              <strong>Email</strong><br/>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </ProfileInfo>
            <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
            <SecondaryButton onClick={() => setIsEditing(false)}>Cancel</SecondaryButton>
          </>
        ) : (
          <>
            <ProfileInfo>
              <strong>Username</strong> <br/>{user.username}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Age</strong> <br/>{formData.age}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Phone Number</strong> <br/>{formData.phoneNumber}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Email</strong> <br/>{formData.email}
            </ProfileInfo>
            <PrimaryButton onClick={() => setIsEditing(true)}>Edit</PrimaryButton>
            <SecondaryButton onClick={logout}>Logout</SecondaryButton>

          </>
        )}
        {isAdmin && !isEditing && <PrimaryButton onClick={() => setAdminMode(true)}>Go to Admin Page</PrimaryButton>}
      </ProfileContent>
    </ProfileContainer>
  );
};



export default Profile;
