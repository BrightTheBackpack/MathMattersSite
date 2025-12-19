'use client'; // Marks this as a Client Component

import React, { useState, useEffect } from 'react';
import { fetchStudentDropdownOptions } from '@/context/firestoreUtils';
import { addStudentLogDB } from '@/context/firestoreUtils';

const PulldownMenu = () => {
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [otherValue, setOtherValue] = useState('');
    const [finalValue, setFinalValue] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchStudentDropdownOptions();
                setOptions(data);
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
                <input type="text" value={otherValue}
                    onChange={(e) => setOtherValue(e.target.value)}
                    placeholder="Tpye in student name" />
            )}
            <button id="final-select" value={finalValue} onClick={setStudentName}>Set Student Name</button>
        </div>
    );
};

export default PulldownMenu;