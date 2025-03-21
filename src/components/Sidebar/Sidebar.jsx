import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import { assets } from '../../assets/assets'

export default function Sidebar() {
    return (
        <>

            <div className='sidebar'>
                <div className='sidebar-options'>


                    <NavLink to="/add" className='sidebar-option'>
                        <img src={assets.add_icon} alt="" />
                        <p className=''>Add Items</p>
                    </NavLink>
                    <NavLink to="/list" className='sidebar-option'>
                        <img src={assets.order_icon} alt="" />
                        <p className=''>List Items</p>
                    </NavLink>
                    <NavLink to="/orders" className='sidebar-option'>
                        <img className='' src={assets.order_icon} alt="" />
                        <p className=''>Orders</p>
                    </NavLink>

                </div>
            </div>


        </>
    )
}
