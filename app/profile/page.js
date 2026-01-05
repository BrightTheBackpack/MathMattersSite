'use client'
import { useAuth } from "@/context/AuthContext"
import React, { useState, useEffect } from 'react';
import { saveUserProfileDB } from '@/context/firestoreUtils';
import { auth } from "@/context/firebase"
export default function Profile() {
    const { currentUser, isLoadingUser } = useAuth()
    const { logout } = useAuth();
    const [userType, setUserType] = useState("Guest");
    const [userSchool, setUserSchool] = useState("NA");
    const [token, setToken] = useState("");
    useEffect(() => {
    async function fetchToken() {
      const user = auth.currentUser;
        if (!user) return;

        // Get the ID token
        const idToken = await user.getIdToken();
        setToken(idToken);

        }

        fetchToken();
    }, [currentUser,isLoadingUser  ]);

    if (isLoadingUser) {
        return (
            <h6 className="text-gradient">Loading...</h6>
        )
    }

    if (!currentUser) {
        // if no user found, then boot them to the home page cause this is the profile page (for auth users only)
        window.location.href = '/'
    }

    // update user profile
    const updateUserType = (e) => {
        setUserType(e.target.value);
    }

    const updateUserSchool = (e) => {
        setUserSchool(e.target.value);
    }

    // save user settings to DB    
    async function saveUserProfile() {
        const firstName = document.getElementById("firstNameInput").value;
        const lastName = document.getElementById("lastNameInput").value;
        const school = document.getElementById("schoolInput").value;

        const profileData = {
            firstName: firstName,
            lastName: lastName,
            school: school,
            userType: userType
        }
        const response = await fetch("/api/user/saveProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });

        // const success = await saveUserProfileDB(currentUser.uid, profileData);
        if (response.status === 200) {
            alert("Profile saved successfully, switch to page of actions")
            window.location.href = '/actions'
        } else {
            alert("Failed to save user profile!")
        }
    }


    return (
        <div className="profile">
            {/* {currentUser &&
                <div className='logoutButton'>
                    <button onClick={logout}>Logout</button>
                </div>
            } */}

            <h1>Please set up your user profile</h1>
            <label id="userType">Set the User Type</label>
            <select id="userType" name="userType" value={userType} onChange={updateUserType}>
                <option value="Guest">Guest</option>
                <option value="Tutor">Tutor</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="CoDirector">CoDirector</option>
                <option value="Admin">Admin</option>
            </select>
            <div className="dynamic-content-area">
                {(userType === "Tutor" || userType === "CoDirector" || userType === "Admin") && (
                    <div className="tutor-form-group">
                        <label htmlFor="firstNameInput">First Name:</label>
                        <input type="text" id="firstNameInput" placeholder={currentUser.firstName} />

                        <label htmlFor="lastNameInput">Last Name:</label>
                        <input type="text" id="lastNameInput" placeholder={currentUser.lastName} />

                        <label htmlFor="schoolInput">School Name:</label>
                        <input type="text" id="schoolInput" placeholder={currentUser.school} />
                    </div>
                )}
                {(userType === "Student" || userType === "Parent") && (
                    // Todo: link student to existing student in the database
                    <div className="student-form-group">
                        <label htmlFor="firstNameInput">First Name:</label>
                        <input type="text" id="firstNameInput" placeholder={currentUser.firstName} />

                        <label htmlFor="lastNameInput">Last Name:</label>
                        <input type="text" id="lastNameInput" placeholder={currentUser.lastName} />

                        <label htmlFor="schoolInput">School Name:</label>
                        <input type="text" id="schoolInput" placeholder={userSchool} />
                    </div>
                )}
            </div>
            <button className='px-4 py-2 bg-red-600 text-white rounded-md' onClick={saveUserProfile}>Save User Profile</button>
        </div>
    );
}