import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import UserContext from '../../Context/UserContext'
import './Login.css'
import { Navigate, useNavigate } from 'react-router-dom'


export default function Login({ url }) {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true)

    const navigate = useNavigate();

   /* const handleClick = () => {
        navigate('/reset-password')
    }*/
    async function authentication(event) {
        event.preventDefault();

        try {
            const response = await axios.post(`${url}/users/login`, {
                email: email,
                password: password
            });

            const data = response.data;

            console.log(data);

            if (data.accessToken) {

                localStorage.setItem('token', data.accessToken)

                setUser({ access: localStorage.getItem('token')})

                toast.success("Thank you for logging in");
            } else if (data.message === "User doesn't exist") {
                toast.error("User not found");
            } else if (data.message === "Invalid credentials") {
                toast.error("Invalid credentials");
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            toast.error("Server Error");
            console.error(error);
        }

        setEmail('');
        setPassword('');
    }




    return (
        
        (user.access !== null)
        ?
            <Navigate to="/" />
        :
        <div className='login-popup-1'>
            <form onSubmit={(event) => authentication(event)} className="login-popup-container-1">
                <div className='logo-container'>

                    <img className='logo' src={assets.belisitas_logo} alt="" />
                </div>
                <div className="login-popup-title-1">
                    <h2>Admin Login</h2>

                </div>
                <div className="login-popup-inputs-1">
                    <div className="input-group">
                        <i className="ri-user-3-fill"></i>
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required />
                    </div>
                    <div className="input-group">
                        <i className="ri-lock-fill"></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required />
                    </div>

                </div>
                <button type='submit'>Login</button>{/*
                <div className="login-popup-condition-1">
                    <p>Forgot Password?</p>
                    <a onClick={handleClick}>Click here</a>
                </div>*/}
            </form>
        </div>
    )
}
