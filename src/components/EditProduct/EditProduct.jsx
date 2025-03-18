import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import './EditProduct.css';
import { assets } from "../../assets/assets";

export default function EditProduct({ url }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [],
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${url}/products/${id}`);
                if (response.data.success) {
                    setProduct(response.data.data);
                } else {
                    toast.error("Failed to fetch product data");
                }
            } catch (error) {
                toast.error("Server error");
                console.error(error);
            }
        };
        fetchProduct();
    }, [id, url]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle new image selection
    // Handle new image selection and preview
    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files);

        // Check total image count
        if (product.images.length + selectedImages.length + newImages.length > 5) {
            toast.error("You can only upload up to 5 images.");
            return;
        }

        // Add new images
        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveSelectedImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };





    // Handle deleting an existing image
    const handleDeleteImage = async (imageUrl) => {
        try {
            const response = await axios.delete(`${url}/products/deleteImage/${id}`, {
                data: { imageUrl },
            });

            if (response.data.success) {
                toast.success("Image deleted successfully");

                // Update state by filtering out the deleted image
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    images: prevProduct.images.filter((img) => img !== imageUrl),
                }));
            } else {
                toast.error("Failed to delete image");
            }
        } catch (error) {
            toast.error("Server error while deleting image");
            console.error(error);
        }
    };


    // Submit form
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const formData = new FormData();
    //         formData.append("name", product.name);
    //         formData.append("description", product.description);
    //         formData.append("price", product.price);
    //         formData.append("category", product.category);

    //         // Append new images if selected
    //         selectedImages.forEach((file) => formData.append("images", file));

    //         const response = await axios.put(`${url}/products/update/${id}`, formData, {
    //             headers: { "Content-Type": "multipart/form-data" },
    //         });

    //         if (response.data.success) {
    //             toast.success("Product updated successfully");
    //             navigate("/list");
    //         } else {
    //             toast.error("Update failed");
    //         }
    //     } catch (error) {
    //         toast.error("Server error");
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine existing images and new images
            const totalImages = product.images.length + selectedImages.length;

            if (totalImages > 5) {
                toast.error("You can only have up to 5 images.");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("name", product.name);
            formData.append("description", product.description);
            formData.append("price", product.price);
            formData.append("category", product.category);

            // Append existing image URLs so the backend knows to keep them
            product.images.forEach((image) => formData.append("existingImages", image));

            // Append new images (files)
            selectedImages.forEach((file) => formData.append("images", file));

            const response = await axios.put(`${url}/products/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Product updated successfully");
                navigate("/list");
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="edit-product-1">
            <p className='text-2xl font-bold mb-10'>Edit Product</p>
            <form className="flex-col" onSubmit={handleSubmit}>
                <div className="image-preview-1">
                    <p className="mb-3">Current Images:</p>
                    <div className="image-grid flex gap-2">
                        {/* Existing images from Cloudinary */}
                        {product.images.map((imageUrl, index) => (
                            <div key={index} className="image-container">
                                <img src={imageUrl} alt="product" className="product-image" />
                                <button
                                    type="button"
                                    className="delete-image-btn"
                                    onClick={() => handleDeleteImage(imageUrl, index)}
                                >
                                    <i className="ri-close-circle-fill"></i>
                                </button>
                            </div>
                        ))}


                        {/* New images preview */}
                        {images.map((imagePreview, index) => (
                            <div key={`preview-${index}`} className="image-container">
                                <img src={imagePreview} alt="preview" className="product-image" />
                            </div>
                        ))}
                    </div>
                </div>


                <div className="upload-container">
                    <p className="mb-3">Upload New Images:</p>
                    <div className="image-upload-grid flex gap-2">
                        {selectedImages.map((image, index) => (
                            <div key={index} className="image-container">
                                <img src={URL.createObjectURL(image)} alt="preview" className="image-preview mb-3" />
                                <button
                                    type="button"
                                    className="delete-image-btn"
                                    onClick={() => handleRemoveSelectedImage(index)}
                                >
                                    <i className="x-button ri-close-circle-fill"></i>
                                </button>
                            </div>
                        ))}

                    </div>
                        {selectedImages.length + product.images.length < 5 && (
                            <label className="upload-box">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} hidden />
                                <p className="bg-gray-400 px-2 py-1 w-46 flex justify-center rounded text-white">
                                    Click to Upload Image
                                </p>
                            </label>
                        )}
                </div>



                <div className="add-product-name flex-col">
                    <p>Product Name:</p>
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product Description:</p>
                    <textarea name="description" value={product.description} rows={6} onChange={handleChange} required />
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category:</p>
                        <select name="category" value={product.category} onChange={handleChange} required>
                            <option value="">Select a Category</option>
                            <option value="Chair">Chair</option>
                            <option value="Pendant Light">Pendant Light</option>
                            <option value="Basket">Basket</option>
                            <option value="Mirror">Mirror</option>
                            <option value="Table Lamp">Table Lamp</option>
                            <option value="Hamper">Hamper</option>
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Product Price:</p>
                        <input type="number" name="price" value={product.price} onChange={handleChange} required />
                    </div>
                </div>

                <div className="button-group-1">
                    <button className="add-btn-2" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Details"}
                    </button>
                    <button type="button" className="cancel-btn-1" onClick={() => navigate("/list")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
