import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import './AddProduct.css';
import { toast } from 'react-toastify';


export default function AddProduct({ url }) {
    const [images, setImages] = useState([]);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Select a Category",
    });


    // Cloudinary Config
    const uploadPreset = "ml_default"; // Replace with Cloudinary upload preset

    // Handle text inputs
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("Requesting Cloudinary Signature from:", `${url}/products/cloudinary-signature`);

            const signatureResponse = await axios.post(`${url}/products/cloudinary-signature`);
            console.log("Backend Signature Response:", signatureResponse.data);

            const { timestamp, signature, uploadPreset } = signatureResponse.data;

            formData.append("timestamp", timestamp);
            formData.append("signature", signature);
            formData.append("upload_preset", uploadPreset); // Fix: Include upload preset
            formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

            // ✅ Upload to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );

            return response.data.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            toast.error("Failed to upload image.");
            return null;
        }
    };




    // Handle multiple image selection
    const onImageChange = async (event) => {
        const files = Array.from(event.target.files);

        const uploadedImages = await Promise.all(files.map(async (image) => {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", uploadPreset);

            try {
                // ✅ Get signed signature from backend
                const signatureResponse = await axios.post(`${url}/products/cloudinary-signature`);
                const { timestamp, signature } = signatureResponse.data;

                formData.append("timestamp", timestamp);
                formData.append("signature", signature);
                formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

                console.log("Cloudinary API Key:", import.meta.env.VITE_CLOUDINARY_API_KEY);

                // ✅ Upload to Cloudinary
                const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
                return response.data.secure_url;
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                toast.error("Failed to upload image.");
                return null;
            }
        }));

        const validImages = uploadedImages.filter(url => url !== null);
        setImages((prevImages) => [...prevImages, ...validImages]);
    };




    // Remove an image
    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Handle drag end event


    // Handle form submission
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }

        if (!data.category || data.category === "Select a Category") {
            toast.error("Please select a category.");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category", data.category);

        // Append images as files
        images.forEach((image, index) => {
            formData.append(`images`, image); // `images` must match the backend field name
        });

        console.log("Sending product data:", formData);

        try {
            const response = await axios.post(`${url}/products/add`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Select a Category",
                });
                setImages([]);
                toast.success(response.data.message);
            } else {
                toast.error("Failed to add product");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("An error occurred while uploading.");
        }
    };


    return (
        <div className="add">
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p className='text-2xl font-bold'>Add Product</p>
                    <p>Upload images (max 5)</p>

                    {images.length < 5 && (
                        <label htmlFor="image" className='upload-label'>
                            <img src={assets.upload_area} alt="Upload Preview" />
                        </label>
                    )}

                    <input
                        onChange={onImageChange}
                        type="file"
                        id="image"
                        multiple
                        accept="image/!*"
                        hidden
                    />


                    <div className="image-preview flex gap-5">
                        {images.map((img, index) => (
                            <div key={img} className="image-container">
                                <img src={img} alt="preview" />
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeImage(index)}
                                >
                                    <i className="ri-close-circle-fill"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                </div>

                <div className="add-product-name flex-col">
                    <p>Product Name:</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type Here" required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product Description:</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows={6}
                        placeholder="Write content here"
                        required
                    />
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category:</p>
                        <select onChange={onChangeHandler} value={data.category} name="category">
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
                        <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="Php: 100" required />
                    </div>
                </div>

                <button className="add-btn" type="submit">Add</button>
            </form>
        </div>
    );
}

