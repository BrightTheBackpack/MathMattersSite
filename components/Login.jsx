'use client'
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    const { login, signup } = useAuth()

    const cantAuth = !email.includes('@') || password.length < 6

    async function handleAuthUser() {
        // check if email is legit and password is acceptable
        if (cantAuth) {
            return
        }
        setIsAuthenticating(true)

        try {
            if (isRegister) {
                // then we need to register a user
                await signup(email, password)
            } else {
                // otherwise they're wanting to login
                await login(email, password)
            }
            // so if we get here with no error, then we've authenticated
        } catch (err) {
            console.log(err.message)
            // challenge for you - add an error state that is conditionally rendered if there is an error and shows the error message
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <>
            <div className="login-container">
                <br></br>
                <h6>Please click on the 'Sign up' buttone to create an account if you have not yet!</h6>
                <p>Login if you have an account already.</p>
                <div className="full-line"></div>
                <h6>{isRegister ? 'Create an account' : 'Log in'}</h6>
                <div>
                    <p>Email</p>
                    <input value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} type="text" placeholder="Enter your email address" />
                </div>
                <div>
                    <p>Password</p>
                    <input value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }} type="password" placeholder="*******" />
                </div>
                <button onClick={handleAuthUser} disabled={cantAuth || isAuthenticating} className="submit-btn">
                    <h6>{isAuthenticating ? 'Submitting...' : 'Submit'}</h6>
                </button>
                <div className="secondary-btns-container">
                    <button onClick={() => {
                        setIsRegister(!isRegister)
                    }} className="card-button-secondary">
                        <small>{isRegister ? 'Log in' : 'Sign up'}</small>
                    </button>
                    <button className="card-button-secondary">
                        <small>Forgot password?</small>
                    </button>
                </div>
                <div className="full-line"></div>
            </div>
        </>
    )
}