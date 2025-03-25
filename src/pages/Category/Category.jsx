import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import './Category.css'

const Category = ({ url }) => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");
    const [activeToast, setActiveToast] = useState(null);
    const [toastIdMap, setToastIdMap] = useState({}); // 🔹 Store active toast IDs




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
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const response = await axios.post(`${url}/categories/add`, { name: categoryName });
            if (response.data.success) {
                toast.success("Category added");
                setCategoryName(""); // Clear input field
                fetchCategories(); // Refresh categories
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to add category");
            console.error(error);
        }
    };

    const handleDelete = async (id, name) => {
        // ✅ If toast is already active, dismiss and reopen it
        if (toastIdMap[id]) {
            toast.dismiss(toastIdMap[id]); // Close existing toast
        }

        // 🔹 Open a new toast warning
        const newToastId = toast.warning(
            <div>
                <p className="confirm-title">
                    Are you sure you want to delete the category <b>{name}</b>?
                </p>
                <div className="flex mt-2">
                    <button
                        className="confirm-btn-yes"
                        onClick={async () => {
                            try {
                                const response = await axios.delete(`${url}/categories/delete/${id}`);

                                if (response.data.success) {
                                    toast.dismiss(newToastId);
                                    setActiveToast(null);
                                    setToastIdMap(prev => ({ ...prev, [id]: null })); // Remove toast tracking
                                    toast.success(`Category "${name}" deleted`);
                                    fetchCategories(); // Refresh category list
                                } else {
                                    toast.error("Error deleting category");
                                }
                            } catch (error) {
                                toast.error("Failed to delete category");
                                console.error(error);
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="confirm-btn-no"
                        onClick={() => {
                            toast.dismiss(newToastId);
                            setActiveToast(null);
                            setToastIdMap(prev => ({ ...prev, [id]: null }));
                        }}
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                autoClose: true,
                closeOnClick: false,
                onClose: () => {
                    setActiveToast(null);
                    setToastIdMap(prev => ({ ...prev, [id]: null }));
                }
            }
        );

        // ✅ Track active toast ID for this category
        setActiveToast(id);
        setToastIdMap(prev => ({ ...prev, [id]: newToastId }));
    };



    const handleEditClick = (category) => {
        setEditingCategoryId(category._id);
        setEditedCategoryName(category.name);
    };

    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setEditedCategoryName("");
    };

    const handleUpdateCategory = async (id) => {
        if (!editedCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const response = await axios.put(`${url}/categories/update/${id}`, { name: editedCategoryName });
            if (response.data.success) {
                toast.success("Category updated");
                setEditingCategoryId(null); // Clear editing state
                setEditedCategoryName("");
                fetchCategories(); // Refresh categories
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to update category");
            console.error(error);
        }
    };

    return (

        <div className="list add flex-col">
            <div className="pb-5">
                <h2 className="text-2xl font-bold mb-5">Add Category</h2>
                <div className="flex gap-5">
                    <input
                        type="text"
                        className="border px-2 py-2 rounded"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                    <button className="px-5 py-2 rounded bg-gray-200 cursor-pointer" onClick={handleAddCategory}>
                        Add
                    </button>
                </div>
            </div>
            <div className="category-container">


            <h2 className="font-bold">Categories List</h2>
            <div className="list-table">
                <div className="list-table-format-category title">
                    <b>Name</b>
                    {/*<b>Category ID</b>*/}
                    <b>Action</b>
                </div>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category._id} className="list-table-format-category flex-wrap gap-5">
                            {/* Name Column - Show input if editing, else show text */}
                            {editingCategoryId === category._id ? (
                                <input
                                    type="text"
                                    className="border px-2 py-1"
                                    value={editedCategoryName}
                                    onChange={(e) => setEditedCategoryName(e.target.value)}
                                />
                            ) : (
                                <p>{category.name}</p>
                            )}

                            {/* Category ID Column - Always visible */}
                            {/*<p>{category._id}</p>*/}

                            {/* Action Column - Buttons only when editing */}
                            <div className="flex gap-4">
                                {editingCategoryId === category._id ? (
                                    <>
                                        <button
                                            className="px-3 py-1 update-btn-category text-white"
                                            onClick={() => handleUpdateCategory(category._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="px-3 py-1 delete-btn-category text-white"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="update-btn-category" onClick={() => handleEditClick(category)}>
                                            <i className="ri-file-edit-fill"></i>
                                        </button>
                                        <button className="px-3 py-1 delete-btn-category" onClick={() => handleDelete(category._id, category.name)}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No categories found.</p>
                )}
            </div>

            </div>
        </div>
    );
};

export default Category;
