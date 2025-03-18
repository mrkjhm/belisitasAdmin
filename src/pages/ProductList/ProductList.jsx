import React, { useEffect, useState } from 'react';
import './ProductList.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate, NavLink } from 'react-router-dom';

import DeleteButton from '../../components/DeleteButton';
import Search from '../../components/Search/Search';

export default function ProductList({ url }) {

    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [deleting, setDeleting] = useState({});

    const [selectedCategory, setSelectedCategory] = useState("all");


    const handleClick = (id) => {
        navigate(`/edit-product/${id}`)
    }

    const handleDelete = (id) => {
        // Remove the deleted product from the list immediately
        setList((prevList) => prevList.filter((item) => item._id !== id));
    };


    // Fetch product list
    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/products/`);
            console.log(response.data);

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

    const confirmDelete = (id, name) => {
        const toastId = toast.warning(
            <div>
                <p className='confirm-title'>Are you sure you want to delete <b>{name}</b>?</p>
                <button
                    className='confirm-btn-yes'
                    onClick={() => removeProduct(id, toastId)}
                    disabled={deleting[id]}
                >
                    {deleting[id] ? "Deleting..." : "Yes"}
                </button>
                <button className='confirm-btn-no' onClick={() => toast.dismiss(toastId)}>No</button>
            </div>,
            {
                autoClose: 5000, // Close the toast after 5 seconds
                closeOnClick: false,
            }
        );

        // Auto-dismiss logic after 5 seconds (optional, in case toast.dismiss doesn't work correctly)

    };

    const removeProduct = async (id, toastId) => {
        if (deleting[id]) return; // Prevent duplicate clicks

        setDeleting((prev) => ({ ...prev, [id]: true })); // Mark as deleting

        try {
            const response = await axios.delete(`${url}/products/remove/${id}`);
            if (response.data.success) {
                toast.success("Product removed");
                setList((prevList) => prevList.filter((item) => item._id !== id));
            } else {
                toast.error("Failed to remove product");
            }
        } catch (error) {
            toast.error("Server Error");
            console.error(error);
        } finally {
            setDeleting((prev) => ({ ...prev, [id]: false })); // Reset deleting state
            toast.dismiss(toastId); // Dismiss only the confirmation toast
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const filteredList = selectedCategory === "all"
        ? list
        : list.filter((item) => item.category === selectedCategory);



    return (
        <>

            {/* <div className='text-center py-5 my-10 xl:bg-red-500 lg:bg-orange-500 md:bg-yellow-500 sm:bg-green-500 bg-blue-500'>
                <p className='text-white hidden xl:block'>xl screen</p>
                <p className='text-white xl:hidden lg:block hidden'>lg screen</p>
                <p className='text-white lg:hidden md:block hidden'>md screen</p>
                <p className='text-white md:hidden sm:block hidden'>sm screen</p>
                <p className='text-white sm:hidden block'>xs screen</p>
            </div> */}

            <div className="list add flex-col">

                <p className='text-2xl font-bold'>Product List</p>
                <div className='md:flex  justify-between items-center'>


                    <div className='md:mb-0 mb-3'>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setList={setList} url={url} />

                        {/* <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
                    </div>
                    <div>
                        <select
                            className="category-filter"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {Array.from(new Set(list.map((item) => item.category))).map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className="list-table">
                    <div className="list-table-format title">
                        <b>Images</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Price</b>
                        <b>Action</b>
                    </div>
                </div>
                {filteredList.length > 0 ? (
                    filteredList.map((item, index) => (
                        <div key={index} className="image-gallery list-table-format hover:bg-[#ececec]">
                            {item.images?.length > 0 && (
                                <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="product-image"
                                    onError={(e) => (e.target.style.display = 'none')}
                                />
                            )}
                            <p className="cursor-pointer hover:font-semibold" onClick={() => navigate(`/product/${item._id}`)}>
                                {item.name}
                            </p>
                            <p>{item.category}</p>
                            <p><span className="sm:hidden flex">₱ </span> {item.price}</p>
                            <div className="flex gap-2 action-button lg:flex-row sm:flex-col xs:flex-row">
                                <button className="update-btn" onClick={() => navigate(`/edit-product/${item._id}`)}>
                                    <i className="ri-file-edit-fill"></i>
                                </button>
                                <button className="update-btn" onClick={() => navigate(`/product/${item._id}`)}>
                                    <i className="ri-file-search-line"></i>
                                </button>
                                <DeleteButton id={item._id} name={item.name} url={url} onDelete={() => handleDelete(item._id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    // ✅ Show message when no products are found
                    <div className="text-center text-gray-500 text-xl py-10">
                        No products found.
                    </div>
                )}



            </div>
        </>
    );
}
{/* <button
    className="delete-btn"
    onClick={() => removeProduct(item._id)}
>
    Delete
</button> */}
