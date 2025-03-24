import React, { useEffect, useState } from 'react';
import './ProductList.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate, NavLink } from 'react-router-dom';

import DeleteButton from '../../components/DeleteButton';
import Search from '../../components/Search/Search';

export default function ProductList({ url }) {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState('')
    const [deleting, setDeleting] = useState({});
    const [filteredProducts, setFilteredProducts] = useState([]);


    const navigate = useNavigate();




    const handleClick = (id) => {
        navigate(`/edit-product/${id}`)
    }

    const handleDelete = async (id) => {
        console.log(`🟠 Refreshing product list after deleting ID: ${id}`);

        await fetchProducts(); // ✅ Ensure fresh data from the backend

        // ✅ If no products left, navigate back to previous page (if pagination exists)
        if (products.length === 1) {
            navigate("/products");  // Change this path if you have pagination
        }
    };




    // Fetch product list
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${url}/products/`);
            if (response.data.success) {
                setProducts(response.data.data);
                setFilteredProducts(response.data.data);  // ✅ Ensure filteredProducts is updated
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
            const response = await axios.delete(`${url}/products/remove/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.success) {
                toast.success("✅ Product and images removed from Cloudinary");

                // ✅ Re-fetch products to update UI
                await fetchProducts();

                toast.dismiss(toastId);
            } else {
                toast.error(response.data.message || "❌ Failed to remove product");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "❌ Server Error");
        } finally {
            setDeleting((prev) => ({ ...prev, [id]: false })); // Reset deleting state
        }
    };



    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/categories`);
            if (response.data.success) {
                setCategories(response.data.categories);

            } else {
                toast.error("Error fetching categories");
            }
        } catch (error) {
            toast.error("Failed to load categories");
            console.error(error);
        }
    };


    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []); // ✅ Fetch data when component mounts

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]); // ✅ Update filtered list when `products` change


    const finalProducts = selectedCategory === "all"
        ? filteredProducts
        : filteredProducts.filter((product) => product.category?._id === selectedCategory);




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
                <div className='md:flex justify-between items-center'>

                    <div className="md:mb-0 mb-2">
                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setList={setFilteredProducts} url={url} />

                    </div>
                    <div>

                        <select
                            className="category-filter"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>


                    {/* ✅ Use categories from backend */}

                </div>
                <div className="list-table">
                    <div className="list-table-format title">
                        <b>Image</b>
                        <b>Product Name</b>
                        <b>Code</b>
                        <b>Price</b>
                        <b>Action</b>
                    </div>
                </div>
                {finalProducts.length > 0 ? (
                    finalProducts.map((item) => (
                        <div key={item.name} className="image-gallery list-table-format hover:bg-[#ececec]">
                            {item.images?.length > 0 && (
                                <img
                                    src={item.images[0]?.url} // ✅ Extract the 'url' field
                                    alt={item.name}
                                    className="product-image"
                                    onError={(e) => (e.target.style.display = 'none')} // Hide broken images
                                />
                            )}

                            <p className="cursor-pointer font-semibold hover:font-bold" onClick={() => navigate(`/product/${item.name}`)}>
                                {item.name}
                            </p>
                            <p>{item.code}</p>
                            <p><span className="sm:hidden flex">₱ </span> {item.price}</p>
                            <div className="flex gap-2 action-button lg:flex-row sm:flex-col xs:flex-row">
                                <button className="update-btn" onClick={() => navigate(`/edit-product/${item.name}`)}>
                                    <i className="ri-file-edit-fill"></i>
                                </button>
                                <button className="update-btn" onClick={() => navigate(`/product/${item.name}`)}>
                                    <i className="ri-file-search-line"></i>
                                </button>
                                <DeleteButton
                                    id={item._id}
                                    name={item.name}
                                    url={url}
                                    onDelete={() => fetchProducts()} // ✅ Ensure UI refresh after deletion
                                />

                            </div>
                        </div>
                    ))
                ) : (
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
