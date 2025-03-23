import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteButton from '../../components/DeleteButton';
import './ProductDetail.css';

export default function ProductDetail({ url }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${url}/products/${id}`);
                if (response.data.success) {
                    setProduct(response.data.data);

                    // ✅ Correctly access the first image URL
                    if (response.data.data.images?.length > 0) {
                        setSelectedImage(response.data.data.images[0].url);
                    }
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
        <div className="product-detail grid md:grid-cols-2 grid-cols-1 gap-10">
            <div>
                {/* ✅ Correctly check and display the main image */}
                <div className="main-image  border">
                    {selectedImage ? (
                        <img src={selectedImage} alt={product.name} className="large-image" />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>

                {/* ✅ Correctly display thumbnails */}
                <div className="thumbnail-gallery">
                    {product.images && product.images.length > 1 &&
                        product.images
                            .filter(img => img.url !== selectedImage) // Exclude active image
                            .map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url} // ✅ Access `url` properly
                                    alt={`Thumbnail ${index + 1}`}
                                    className="thumbnail  border"
                                    onClick={() => setSelectedImage(img.url)}
                                />
                            ))
                    }
                </div>
            </div>

            <div className='text-detail space-y-3'>
                <h1 className='font-bold text-5xl pb-3'>{product.name}</h1>
                <p className='font-bold text-2xl'> <span className="bg-[#6d6d6d] px-5  py-2 rounded text-white">₱ {product.price}</span></p>
                <p className='text-xl'><span className="text-sm">Details:</span> <br/> {product.description}</p>

                <p><span className="text-sm">Category:</span> <br/> {product.category?.name || "No Category"}</p>
                <p><span className="text-sm">Code:</span> <br/> <span className="font-bold">{product.code}</span></p>
                <div className="flex gap-2">
                    <button className="update-btn" onClick={() => navigate(`/edit-product/${product._id}`)}>
                        <i className="ri-file-edit-fill"></i>
                    </button>
                    <DeleteButton id={product._id} name={product.name} url={url} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
}
