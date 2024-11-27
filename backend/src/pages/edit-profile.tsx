// Generated with ChatGPT

import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

export default function EditProfile() {
  const [user, setUser] = useState(null) 
  const router = useRouter();
  const [formData, setFormData] = useState({
    newFirstName: user?.firstName || "",
    newLastName: user?.lastName || "",
    newEmail: user?.email || "",
    newPhoneNumber: user?.phoneNumber || "",
    newUsername: user?.username || "",
    newPassword: "",
    newPasswordConfirm: "",
    newAvatarPath: user?.avatarPath || "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  useEffect(() => {
    const userJson = window.localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (!user || !user.jwtToken) {
      router.push("/login");
    } else {
      setUser(user);
    }
  }, [router]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch("/api/users/avatars", {
          headers: {
            "Authorization": `Bearer ${user.jwtToken}`,
          },
        });
        if (response.ok) {
          const avatars: string[] = await response.json();
          setAvatarOptions(avatars);
        } else {
          setErrorMessage("Failed to fetch avatars");
        }
      } catch (error) {
        setErrorMessage("Error fetching avatars");
      }
    };

    fetchAvatars();
  }, []);

  if (!user || !user.id) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.newPasswordConfirm) {
      setPasswordError("Passwords do not match. No updates were made.");
      return;
    }

    if (formData.newPassword !== "" && !validatePassword(formData.newPassword)) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long. No updates were made.");
      return;
    }

    setPasswordError("");

    const patchData: { [key: string]: string } = {};

    if (formData.newFirstName !== user.firstName) patchData.newFirstName = formData.newFirstName;
    if (formData.newLastName !== user.lastName) patchData.newLastName = formData.newLastName;
    if (formData.newUsername !== user.username) patchData.newUsername = formData.newUsername;
    if (formData.newPhoneNumber !== user.phoneNumber) patchData.newPhoneNumber = formData.newPhoneNumber;
    if (formData.newEmail !== user.email) patchData.newEmail = formData.newEmail;
    if (formData.newPassword !== "") patchData.newPassword = formData.newPassword;
    if (formData.newAvatarPath !== user.avatarPath) patchData.newAvatarPath = formData.newAvatarPath;

    if (Object.keys(patchData).length === 0) {
      setErrorMessage("No changes detected.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.jwtToken}`,
        },
        body: JSON.stringify(patchData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setErrorMessage("");
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        setErrorMessage(`${error?.error} No updates were made.` || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const avatarUrl = `http://${formData.newAvatarPath}` || "/avatars/loggedout.png";

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <div className="form-container">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="avatar-section">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-info">
              <h2>{user.firstName} {user.lastName}</h2>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          </div>

          <div className="form-fields">
            <div className="form-field">
              <label>Username:</label>
              <input
                type="text"
                name="newUsername"
                value={formData.newUsername}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>First Name:</label>
              <input
                type="text"
                name="newFirstName"
                value={formData.newFirstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Last Name:</label>
              <input
                type="text"
                name="newLastName"
                value={formData.newLastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Email:</label>
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Phone Number:</label>
              <input
                type="text"
                name="newPhoneNumber"
                value={formData.newPhoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="password-section">
              <div className="form-field">
                <label>Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="newPasswordConfirm"
                  value={formData.newPasswordConfirm}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="submit-button">
              Save Changes
            </button>
          </div>
        </form>
        <div className="avatar-selector">
          <h3 className="bold-text">Select Avatar:</h3>
          <div className="avatar-options">
            {avatarOptions.map((avatar) => (
              <div
                key={avatar}
                className={`avatar-option ${formData.newAvatarPath === avatar ? 'selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, newAvatarPath: avatar }))}
              >
                <img
                  src={`http://${avatar}`}
                  alt="Avatar"
                  className="avatar-image"
                />
              </div>
            ))}
          </div>
          {passwordError && <div className="error-message">{passwordError}</div>}
          {errorMessage && <div className="error-text">{errorMessage}</div>} {/* Error message under avatar selection */}

        </div>
      </div>
      

<style jsx>{`
  .form-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }
  .avatar-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .user-info h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  .user-info p {
    margin: 5px 0;
  }
  .form-fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .form-field label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  .form-field input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  .password-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .error-message {
    color: red;
    margin-top: 10px;
  }
  .avatar-selector {
    margin-top: 20px;
  }
  .avatar-options {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .avatar-option {
    padding: 5px;
    cursor: pointer;
    border: 2px solid gray;
    border-radius: 50%;
    transition: transform 0.2s ease-in-out;
  }
  .avatar-option.selected {
    border-color: transparent;
    box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.8);
  }
  .avatar-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  .submit-button {
    padding: 6px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
  }
  .submit-button:hover {
    background-color: #45a049;
  }

  .error-text {
    color: red;
    margin-top: 15px;
    font-size: 14px;
  }

  @media (min-width: 768px) {
    .form-fields {
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
    }
    .password-section {
      grid-template-columns: 1fr 1fr;
    }
  }
`}</style>
    </>
  );
}
