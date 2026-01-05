import { collection, query, where, getDocs, setDoc, getDoc, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/context/firebase"





// in components/CheckList.jsx
export const fetchAttendanceOptions = async () => {
    const itemsRef = collection(db, "attendance");
    const q = query(itemsRef, where("Verified", "==", "false"))
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
    return fetchedUsers;
};
// in components/CheckList.jsx
export const updateAttendanceLogs = async (userID) => {
    if (!userID) {
        console.error("Error: User ID is missing.");
        return;
    }
    try {
        //console.log(userID)
        const logRef = doc(db, 'attendance', userID);
        await updateDoc(logRef, {
            Verified: "true"
        });
        // copy the attendance log to the tutor attendance subcollection
        const docSnap = await getDoc(logRef);
            if (docSnap.exists()) {
            const dataToCopy = docSnap.data();
            const subCollectionRef = doc(db, 'users', dataToCopy.tutorID, 'attendance', userID);            
            await setDoc(subCollectionRef, dataToCopy) 
        }               
        return true;
    } catch (error) {
        console.error("Error updating document: ", error);
        return false;
        // Log the error details to help diagnose security rule or non-existent document issues
    }
}

// in components/PulldownMenu.jsx
export const fetchStudentDropdownOptions = async () => {
    const itemsRef = collection(db, "student");
    //const q = query(itemsRef, where("userType", "==", "Student"));
    const q = query(itemsRef);
    const querySnapshot = await getDocs(q);
    const options = [];
    querySnapshot.forEach((doc) => {
        // Assuming each document has 'value' and 'label' fields
        options.push({
            id: doc.id,
            studentName: doc.data().studentName
            //firstName: doc.data().firstName,
            //lastName: doc.data().lastName
        });
    });
    console.log(options)
    return options;
};

// in components/PulldownMenu.jsx
export const addStudentLogDB = async (logData) => {
    try {
        const docRef = await addDoc(collection(db, 'student'), {
            studentName: logData
            // Add other fields as needed
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding student log: " + e);
        return false;
    }
};