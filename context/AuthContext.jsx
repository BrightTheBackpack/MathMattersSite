'use client'

import { auth } from "./firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchUserDoc } from '@/context/firestoreUtils';
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider(props) {
    const { children } = props
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    //const [userProfile, setUserProfile] = useState(false)
    const router = useRouter()

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password).onError((error) => {
            console.error("Error during login: ", error);
        });
    }

    function logout() {
        setCurrentUser(null)
        return signOut(auth)
    }

    // resetpasswordemail
    // sendPasswordResetEmail(auth, email)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setIsLoadingUser(true)
            try {
                setCurrentUser(user)
                if (!user) {
                    // guard clause which just means that if there is no user then the code stops here and we don't do any data fetching or anything
                    //setUser(null);
                    throw Error('No user found')
                }
                setCurrentUser(user);
                console.log(user)
                // if we find a user, then fetch their data
                const userDoc = await fetch("/api/user/getUserData", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${await user.getIdToken()}`
                    }
                }).then(res => res.json()); 
                if (userDoc.data) {
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        ...userDoc.data,
                    })
                    router.push('/actions')
                } else {
                    setCurrentUser(user);
                    alert("First time user, please set the user profile")
                    router.push('/profile')
                }
            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoadingUser(false)
            }
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        isLoadingUser,
        signup,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}