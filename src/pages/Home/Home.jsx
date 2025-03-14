import React from 'react'
import './Home.css'
import ProductCard from '../../components/ProductCard/ProductCard'
import { assets } from '../../assets/assets'

export default function Home() {
    return (
        <div className='home'>
            <div className='pb-100'>
            {/* <p className='text-2xl font-bold'>Home Page</p> */}
            <img src={assets.banner} alt="" />
            </div>
            
        </div>

    )
}
