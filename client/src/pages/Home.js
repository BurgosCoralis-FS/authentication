import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import authService from '../services/auth.service'

import '../App.css';

function Home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ signIn, setSignIn] = useState(true)

    const navigate = useNavigate()

    const handleSignUp = async (event) => {
        event.preventDefault()
        try{
            await authService.signup(email, password).then(
                response => {
                    navigate('/dashboard')
                }
            )
        } catch(err) {
            console.error(err)
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try{
            await authService.login(email, password).then(
                response => {
                    navigate('/dashboard')
                }
            )
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div className="Container">
        <h1>Movie Tracker App</h1>
        <h2> {signIn ? 'Sign Up' : 'Log In'} </h2>
        <section className="signIn">
            <form onSubmit={signIn ? handleSignUp : handleLogin}>
                <input
                type='text'
                placeholder='Your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='text-box'  />

                <input
                type='password'
                placeholder={signIn ? 'Create a password' : 'Password'}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className='text-box' />

                <button type='submit' className="submit-button"> {signIn ? 'Sign Up' : 'Log in'} </button>
            </form>
            <span>Already have an account?</span>
            <button onClick={() => setSignIn(!signIn)}>
                {signIn ? 'Switch to Log In' : 'Switch to Sign Up'}
            </button>
        </section>
        </div>
    );
}

export default Home;