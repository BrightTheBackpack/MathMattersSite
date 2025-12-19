'use client'
import { useAuth } from "@/context/AuthContext"
import Link from 'next/link';
import React, { useState, useContext } from 'react';
import PulldownMenu from '@/components/PulldownMenu';
import CheckList from '@/components/CheckList';
import { saveAttendanceLogDB } from '@/context/firestoreUtils';

export default function Actions() {
    const { currentUser, isLoadingUser } = useAuth()
    const { logout } = useAuth();

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
        const studentID = document.getElementById("final-select").value;
        const report = document.getElementById("ReportInput").value;

        const logData = {
            tutorID: currentUser.uid,
            tutorfirstName: currentUser.firstName,
            tutorlastName: currentUser.lastName,
            Date: date,
            Hours: hours,
            studentID: studentID,
            Report: report,
            Verified: "false"
        }
        const success = await saveAttendanceLogDB(logData);
        if (success) {
            alert("Attendance log saved successfully!");
            window.location.reload();
        } else {
            alert("Failed to save attendance log!")
        }

    }

    /* example of conditional rendering */
    const SharedAttendanceForm = () => (
        <div>
            <h2>Update attendance log</h2>
            <label htmlFor="DateInput">Date:</label>
            <input type="date"
                id="DateInput"
                placeholder="YYYY-MM-DD"
                title="Format: YYYY-MM-DD" />
            <label htmlFor="HoursInput">Hours:</label>
            <input type="number" id="HoursInput" placeholder="Total hours" />
            <PulldownMenu />
            <label htmlFor="ReportInput">Progress report:</label>
            <input type="text" id="ReportInput" placeholder="Type your report here" />

            <button className='px-4 py-2 bg-red-600 text-white rounded-md' onClick={saveAttendanceLog}>Save Attendance Log</button>
            <h2>Check hours</h2>
            // Todo: add database query of volunteer hours
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

            <p>{currentUser.firstName} {currentUser.lastName} has logged in as a {currentUser.userType}.</p>

            {renderContent()}
            <br></br>
            <p>To update your user profile, please go to</p>
            <div className='link'>
                <Link href="/profile">Setup User Profile</Link>
            </div>
        </div>
    );
}