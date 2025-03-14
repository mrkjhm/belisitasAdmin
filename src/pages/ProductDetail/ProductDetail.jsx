import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteButton from '../../components/DeleteButton';
import './ProductDetail.css';
import EditProduct from '../../components/EditProduct/EditProduct';

export default function ProductDetails({ url }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // Track main image

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${url}/products/${id}`);
                if (response.data.success) {
                    setProduct(response.data.data);
                    setSelectedImage(`${url}/images/${response.data.data.images[0]}`); // Set first image as default
                } else {
                    toast.error("Product not found");
                }
            } catch (error) {
                toast.error("Server Error");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, url]);

    const handleDelete = () => {
        navigate('/list');
    };


    if (loading) return <p>Loading...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <>
        <div className="product-detail grid md:grid-cols-2  grid-cols-1 gap-10">
            <div>
                {/* Large Main Image */}
                <div className="main-image">
                    <img src={selectedImage} alt={product.name} className="large-image" />
                </div>

                {/* Small Thumbnail Images (Hide Active Image) */}
                <div className="thumbnail-gallery">
                    {product.images
                        .filter(image => `${url}/images/${image}` !== selectedImage) // Exclude active image
                        .map((image, index) => (
                            <img
                                key={index}
                                src={`${url}/images/${image}`}
                                alt={`Thumbnail ${index + 1}`}
                                className="thumbnail"
                                onClick={() => setSelectedImage(`${url}/images/${image}`)}
                            />
                        ))}
                </div>
            </div>

            

            <div className='text-detail space-y-3'>
                <h1 className='font-bold text-5xl'>{product.name}</h1>
                <p className='text-xl'>Description: {product.description}</p>
                <p className='font-bold text-2xl'>Price: ₱ {product.price}</p>
                <p>Category: {product.category}</p>

                {/* <button className='bg-blue-500 py-2 px-5 rounded-md text-white me-3'>Update</button> */}
                <DeleteButton id={product._id} name={product.name} url={url} onDelete={handleDelete} />
            </div>
        </div>
     
      
      </>
    );
}
