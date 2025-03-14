import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import './AddProduct.css';
import { toast } from 'react-toastify';
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

export default function AddProduct({ url }) {


    const [forceUpdate, setForceUpdate] = useState(0);
    const [images, setImages] = useState([]);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Select a Category",
    });


    

    // Handle text inputs
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle multiple image selection
    const onImageChange = (event) => {
        const files = Array.from(event.target.files);
    
        if (files.length + images.length > 5) {
            toast.error("You can only upload up to 5 images!");
            return;
        }
    
        setImages((prevImages) => [...prevImages, ...files]);
    
        // Reset file input
        event.target.value = "";
    };
    
    

    // Remove an image
    
    const removeImage = (index) => {
        setImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            return [...updatedImages];
        });
    
        setForceUpdate((prev) => prev + 1); // Forces re-render
    };
    
    
    
    
    
    
    

    // Handle drag end event
    const onDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((img) => img.name === active.id);
                const newIndex = items.findIndex((img) => img.name === over.id);
                const newItems = [...items];
                newItems.splice(newIndex, 0, newItems.splice(oldIndex, 1)[0]);                
                return newItems;
            });
        }
    };
    

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
        formData.append("price", Number(data.price));
        formData.append("category", data.category);

        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await axios.post(`${url}/products/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
                        accept="image/*"
                        hidden
                    />

                    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                        <SortableContext items={images.map(img => img.name)} strategy={verticalListSortingStrategy}>

                            <div className="image-preview flex gap-5">
                            {images.map((img, index) => (
    <SortableItem key={`${img.name}-${index}-${img.lastModified}`} img={img} index={index} removeImage={removeImage} />
))}


                            </div>
                        </SortableContext>
                    </DndContext>
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

function SortableItem({ img, index, removeImage }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="image-container">
            <img src={URL.createObjectURL(img)} alt="preview" />
            
            {/* Prevent dragging when clicking delete */}
            <button 
                type="button" 
                className="remove-btn" 
                onClick={(event) => {
                    event.stopPropagation(); // Stop drag event from interfering
                    removeImage(index);
                }}
            >
                <i className="ri-close-circle-fill"></i>
            </button>
        </div>
    );
}

