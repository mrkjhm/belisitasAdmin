import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Search.css';

export default function Search({ searchTerm, setSearchTerm, setList, url }) {

    const fetchProduct = async () => {
        try {
            let response;

            if (!searchTerm) {
                // Fetch all products if no search term
                response = await axios.get(`${url}/products`);
            } else {
                // Fetch products by name or code
                response = await axios.get(`${url}/products/search`, {
                    params: { search: searchTerm }
                });
            }

            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching products");
            }
        } catch (error) {
            toast.error("Server Error");
            console.error(error);
        }
    };


    useEffect(() => {
        fetchProduct();
    }, [searchTerm]);

    const clearSearch = () => {
        setSearchTerm('');
    }

    return (
        <div className='search'>
            <div className='flex gap-2'>
                <i className="ri-search-line"></i>
                <input
                    type="text"
                    placeholder='Search Product/Code'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className='focus:outline-0'
                />
                { searchTerm && 
                    <i 
                        className="ri-close-line cursor-pointer"
                        onClick={clearSearch}
                    >
                    </i> 
                }
            </div>
        </div>
    );
}
