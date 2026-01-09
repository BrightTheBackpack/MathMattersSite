'use client'; // Marks this as a Client Component

import React, { useState, useEffect } from 'react';
import { fetchStudentDropdownOptions } from '@/context/firestoreUtils';
import { addStudentLogDB } from '@/context/firestoreUtils';
import { auth } from "@/context/firebase"
const PulldownMenu = () => {
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [otherValue, setOtherValue] = useState('');
    const [finalValue, setFinalValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");

    useEffect(() => {
        const getData = async () => {
                  const user = auth.currentUser;
                    if (!user) return;
            
                    // Get the ID token
                    const idToken = await user.getIdToken();
                    setToken(idToken);
            
            try {
                const data = await fetch("api/attendance/students",{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                        'Content-Type': 'application/json',
                    },
                }).then(res => res.json());
                console.log("data:", data);
                setOptions(data.students);
                console.log(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching options: ", error);
                setLoading(false);
            }
        };
        getData();
    }, []);

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    async function setStudentName() {
        try {
            if (selectedValue === 'other') {
                // student not in the DB yet, add the new student, and return ID
                const studentID = await addStudentLogDB(otherValue);
                if (studentID) {
                    alert("add student to the datebase successfully!");
                    setFinalValue(studentID);
                } else {
                    alert("Failed to add student to the database!")
                    setFinalValue(otherValue);
                }

            } else {
                setFinalValue(selectedValue);
            }
            return true;
        } catch (e) {
            console.error("Error adding document: ", e);
            return false;
        }
    }

    if (loading) {
        return <div>Loading menu options...</div>;
    }

    return (
        <div>
            <label htmlFor="item-select">Choose an Student:</label>
            <select id="item-select" value={selectedValue} onChange={handleChange}>
                <option value="">-- Select an option --</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.studentName}
                    </option>
                ))}
                <option value="other">Other</option>
            </select>
            {selectedValue === 'other' && (
                <input type="text" id="other-input" value={otherValue}
                    onChange={(e) => setOtherValue(e.target.value)}
                    placeholder="Type in student name" />
            )}
            {/* <button id="final-select" value={finalValue} onClick={setStudentName}>Set Student Name</button> */}
        </div>
    );
};

export default PulldownMenu;