import React from 'react'
import {useNavigate} from "react-router-dom";

import {assets} from "../../assets/assets.js";


const ResetPassword = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    }
    return (
        <div className='login-popup-1'>
            <form onSubmit={(event) => authentication(event)} className="login-popup-container-1">
                <div className='logo-container'>

                    <img className='logo' src={assets.belisitas_logo} alt="" />
                </div>
                <div className="login-popup-title-1">
                    <h2>Reset Password</h2>

                </div>
                <div className="login-popup-inputs-1">
                    <div className="input-group">
                        <i className="ri-user-3-fill"></i>
                        <input
                            type="email"
                            placeholder="Your Email"
                            // value={email}
                            // onChange={(event) => setEmail(event.target.value)}
                            required />
                    </div>

                </div>
                <button type='submit'>Submit</button>
                <div className="login-popup-condition-1">
                    <p>Back to Login</p>
                    <a onClick={handleClick}>Click here</a>
                </div>
            </form>
        </div>
    )
}
export default ResetPassword
