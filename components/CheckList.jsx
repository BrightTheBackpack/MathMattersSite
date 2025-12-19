'use client'; // Marks this as a Client Component

import React, { useState, useEffect } from 'react';
import { fetchAttendanceOptions } from '@/context/firestoreUtils';
import { updateAttendanceLogs } from '@/context/firestoreUtils';

const CheckList = () => {
    const [users, setUsers] = useState([]);
    const [checkedUsers, setCheckedUsers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchAttendanceOptions();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching options: ", error);
                setLoading(false);
            }
        };
        getData();
    }, []);

    const handleCheckboxChange = (userId) => {
        setCheckedUsers(prevCheckedUsers => ({
            ...prevCheckedUsers,
            [userId]: !prevCheckedUsers[userId],
        }));
    };

    if (loading) {
        return <div>Loading menu options...</div>;
    }

    async function handleSubmit() {
        try {
            const selectedUsers = users.filter((user) => checkedUsers[user.id]);

            for (const user of selectedUsers) {
                const success = await updateAttendanceLogs(user.id);
                if (success) {
                    alert("Attendance log verified successfully!");
                } else {
                    alert("Failed to verify attendance log!")
                }                
            };
            // refresh to update the log to verify
            window.location.reload();
        }
        catch (e) {
            console.error("Error adding document: ", e);
            return false;
        }
        // Perform actions with selectedUsers (e.g., update Firebase, call API)
    };

    return (
        <div>
            <label htmlFor="log-select">Click on the log to verify:</label>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <input
                            type="checkbox"
                            checked={!!checkedUsers[user.id]}
                            onChange={() => handleCheckboxChange(user.id)}
                        />
                        {user.Date} {user.tutorfirstName} {user.tutorlastName} ({user.Hours})
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit}>Verify Selected Log</button>
        </div>
    );
};

export default CheckList;