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
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        code: "",
        images: [],
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${url}/products/${id}`);

            if (response.data.success) {
                const productData = response.data.data;

                // Ensure category is stored as the correct `_id` value
                setProduct({
                    ...productData,
                    category: productData.category._id // Assuming backend returns category as an object `{ _id, name }`
                });
            } else {
                toast.error("Failed to fetch product data");
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    };

    // Fetch product data
    useEffect(() => {
        fetchProduct();

        // Fetch categories from backend
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${url}/categories`);
                if (response.data.success) {
                    setCategories(response.data.categories); // Assuming response.data.data is an array of categories
                } else {
                    toast.error("Failed to fetch categories");
                }
            } catch (error) {
                toast.error("Error fetching categories");
                console.error(error);
            }
        };


        fetchCategories();
    }, [id, url])


    // Handle input changes
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle new image selection
    // Handle new image selection and preview
    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files);

        if (selectedImages.length + product.images.length + newImages.length > 5) {
            toast.error(`You can only upload up to 5 images.`);
            return;
        }

        // ✅ Dapat ilagay lang ito sa `selectedImages`, hindi sa `product.images`
        setSelectedImages((prev) => [...prev, ...newImages]);
    };




    const handleUploadImages = async () => {
        if (selectedImages.length === 0) {
            return;
        }

        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await axios.post(`${url}/products/add-image/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success("Images uploaded successfully!");

                // ✅ Fetch updated product data
                fetchProduct();
            } else {
                toast.error("Failed to upload images.");
            }
        } catch (error) {
            console.error("❌ Error uploading images:", error);
            toast.error("❌ Error uploading images. Please try again.");
        } finally {
            // ✅ Clear selected images AFTER upload
            setSelectedImages([]);
        }
    };



    const handleRemoveSelectedImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };



    // Handle deleting an existing image
    const handleDeleteImage = async (publicId) => {
        try {
            const response = await axios.delete(`${url}/products/deleteImage/${id}`, {
                data: { public_id: publicId }, // ✅ Send public_id in request body
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.success) {
                toast.success("Image deleted successfully!");

                // ✅ Update product state to remove deleted image
                setProduct((prev) => ({
                    ...prev,
                    images: prev.images.filter((img) => img.public_id !== publicId),
                }));
            } else {
                toast.error(`Failed to delete image: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Error deleting image. Please try again.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ Upload images first
            if (selectedImages.length > 0) {
                await handleUploadImages(); // ❗ Dapat may `await` para hintayin ang upload
            }

            // ✅ Update product details
            const productData = new URLSearchParams();
            productData.append("name", product.name);
            productData.append("description", product.description);
            productData.append("price", product.price);
            productData.append("category", product.category);
            productData.append("code", product.code);

            const response = await axios.put(`${url}/products/update/${id}`, productData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            if (response.data.success) {
                toast.success("Product updated successfully");

                // ✅ Clear selected images after update
                setSelectedImages([]);

                // ✅ Navigate after everything is updated
                navigate("/list");
            } else {
                toast.error("Update failed");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="edit-product-1">
            <p className='text-2xl font-bold mb-10'>Edit Product</p>
            <form className="flex-col" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="image-preview-1">
                    <p className="mb-3">Current Images:</p>
                    <div className="image-grid flex gap-2">
                        {product.images.map((image, index) => (
                            <div key={index} className="image-container">
                                <img src={image.url} alt="product" className="product-image" />
                                <button type="button" className="delete-image-btn" onClick={() => handleDeleteImage(image.public_id)}>
                                    <i className="ri-close-circle-fill"></i>
                                </button>
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
                                <button type="button" className="delete-image-btn" onClick={() => handleRemoveSelectedImage(index)}>
                                    <i className="ri-close-circle-fill"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    {selectedImages.length > 0 && (
                        <button type="button" className="upload-btn px-5 py-1 bg-gray-200 rounded mb-2" onClick={handleUploadImages}>
                            Upload Selected Images
                        </button>
                    )}

                    {selectedImages.length + product.images.length < 5 && (
                        <label className="upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                hidden
                            />
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
                        <select
                            name="category"
                            value={product.category} // ✅ Should be category._id, not category.name
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>


                    </div>

                    <div className="add-price flex-col">
                        <p>Product Price:</p>
                        <input type="number" name="price" value={product.price} onChange={handleChange} required />
                    </div>
                </div>
                <div className="add-category-price">

                    <div className="add-price flex-col">
                        <p>Code:</p>
                        <input type="text" name="code" value={product.code} onChange={handleChange} required />
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
