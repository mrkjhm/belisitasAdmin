import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product, url, handleDelete, deleting }) {
    const navigate = useNavigate();

    return (
        <div className="product-card">
            {product.images.length > 0 && (
                <img src={`${url}/images/${product.images[0]}`} alt={product.name} />
            )}
            <p className="product-name" onClick={() => navigate(`/product/${product._id}`)}>
                {product.name}
            </p>
            <p className="product-category">{product.category}</p>
            <p className="product-price">${product.price}</p>

            <div className="product-actions">
                <button className="view-btn" onClick={() => navigate(`/product/${product._id}`)}>
                    View
                </button>

                {/* DELETE BUTTON PASSED AS PROP */}
                <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id, product.name)}
                    disabled={deleting[product._id]}
                >
                    {deleting[product._id] ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}
