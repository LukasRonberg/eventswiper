import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import facade from "../util/apiFacade";

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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

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
    const sanitizedFormData = {
        ...formData,
        password: formData.password || undefined, // Omit `password` if null
        age: parseInt(formData.age, 10), // Convert age to a number
      };
      console.log("Sanitized Form Data:", sanitizedFormData);
    facade.updateUser(sanitizedFormData)
      .then((updatedUser) => {
        alert("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to update profile.");
      });
  };

  if (!user || Object.keys(user).length === 0) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <h3>Loading...</h3>
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
              <strong>Username:</strong> {formData.username}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Age:</strong>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </ProfileInfo>
            <ProfileInfo>
              <strong>Phone Number:</strong>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </ProfileInfo>
            <ProfileInfo>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </ProfileInfo>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <ProfileInfo>
              <strong>Username:</strong> {user.username}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Age:</strong> {formData.age}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Phone Number:</strong> {formData.phoneNumber}
            </ProfileInfo>
            <ProfileInfo>
              <strong>Email:</strong> {formData.email}
            </ProfileInfo>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </ProfileContent>
    </ProfileContainer>
  );
};



export default Profile;
