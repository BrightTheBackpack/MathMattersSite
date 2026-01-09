'use client'
import { useAuth } from "@/context/AuthContext"
import { auth } from "@/context/firebase"

import Link from 'next/link';
import React, { useState, useContext, useEffect } from 'react';
import PulldownMenu from '@/components/PulldownMenu';
import CheckList from '@/components/CheckList';
import { saveAttendanceLogDB } from '@/context/firestoreUtils';

export default function Actions() {
    const { currentUser, isLoadingUser } = useAuth()
    const { logout } = useAuth();
    const [token, setToken] = useState("");

    useEffect(() => {
    async function fetchTokenAndData() {
      const user = auth.currentUser;
        if (!user) return;

        // Get the ID token
        const idToken = await user.getIdToken();
        setToken(idToken);

        // Call your API
        }

        fetchTokenAndData();
    }, [currentUser,isLoadingUser  ]);


    if (isLoadingUser) {
        return (
            <h6 className="text-gradient">Loading...</h6>
        )
    }
    

    if (!currentUser) {
        // if no user found, then boot them to the home page cause this is the action page (for auth users only)
        window.location.href = '/'
    }

    // ToDo: date format
    // ToDo: pulldown block size
    // save attendance log to DB    
    async function saveAttendanceLog() {
        const date = document.getElementById("DateInput").value;
        console.log(date)
        const hours = document.getElementById("HoursInput").value;
        console.log(hours)
        let studentName = document.getElementById("item-select").value;
        if (studentName === 'other') {
            studentName = document.getElementById("other-input").value;
            fetch("/api/attendance/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ studentName })
            });
        }
        const report = document.getElementById("ReportInput").value;

        const logData = {
            tutorID: currentUser.uid,
            tutorfirstName: currentUser.firstName,
            tutorlastName: currentUser.lastName,
            date: date,
            hours: hours,
            studentName: studentName,
            report: report,
            verified: "false"
        }
        const res = await fetch("/api/attendance/attendanceLog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(logData)
        });
        if (res.ok) {
            alert("Attendance log saved successfully!");
            window.location.reload();
        } else {
            alert("Failed to save attendance log!")
        }

    }

    const SharedAttendanceForm = () => (
        <div>
            <h2>Update attendance log</h2>
            <label htmlFor="DateInput">Date:</label>
            <input type="date"
                id="DateInput"
                placeholder="YYYY-MM-DD"
                title="Format: YYYY-MM-DD" />
            <label htmlFor="HoursInput">Hours:</label>
            <input type="number" id="HoursInput" placeholder="Total hours" defaultValue="2" />
            <PulldownMenu />
            <label htmlFor="ReportInput">Progress report:</label>
            <input type="text" id="ReportInput" placeholder="Type your report here" />

            <button className='px-4 py-2 bg-red-600 text-white rounded-md' onClick={saveAttendanceLog}>Save Attendance Log</button>
        </div>
    );

    const renderContent = () => {
        switch (currentUser.userType) {
            case 'Guest':
                return (
                    <div>
                        <p>Please setup the user profile first</p>
                    </div>
                );
            case 'Tutor':
                return (
                    <div>
                        <SharedAttendanceForm />
                    </div>
                );
            case 'Admin':
            case 'CoDirector':
                return (
                    <div>
                        <SharedAttendanceForm />
                        <h2>Verify hours</h2>
                        <CheckList />
                    </div>
                );
            case 'Student':
            case 'Parent':
                return <p>Read progress report</p>;
            default:
                return <p>Unknown status.</p>;
        }
    };

    return (
        <div className="actions">
            {currentUser &&
                <div className='logoutButton'>
                    <button onClick={logout}>Logout</button>
                </div>
            }

            {/* <p>{currentUser.firstName} {currentUser.lastName} has logged in as a {currentUser.userType}.</p> */}

            {renderContent()}
            <br></br>
        </div>
    );
}