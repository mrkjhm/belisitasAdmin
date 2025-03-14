import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets'
import UserContext from '../../Context/UserContext';
import './Navbar.css'

export default function Navbar({ setShowLogin }) {

    const { user } = useContext(UserContext);
    console.log(user);


    return (
        <div className='navbar'>
            <div className="logo-container">
                <NavLink to="/">
                    <img className="logo" src={assets.belisitas_logo} alt="Logo" />
                </NavLink>
            </div>

            
            <div className='buttons'>

                {/* <img className='user-icon' src={assets.user_icon} alt="" /> */}
                {/* <ul className='flex gap-10'>
                <li>Login</li>
                <li>Register</li>
            </ul> */}

                {(user.access !== null)
                    ?
                    <NavLink to='/logout'><button>Logout</button></NavLink>
                    :
                    <NavLink to='/login'><button>Sign in</button></NavLink>
                }

            </div>
        </div>
    )
}
