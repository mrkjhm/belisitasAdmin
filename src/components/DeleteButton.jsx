import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function DeleteButton({ id, name, url, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const [toastId, setToastId] = useState(null); // Track active toast for this product

    const confirmDelete = () => {
        if (toastId) toast.dismiss(toastId); // Close any existing confirmation toast for this item

        const newToastId = toast.warning(
            <div>
                <p className="confirm-title">
                    Are you sure you want to delete <b>{name}</b>?
                </p>
                <button
                    className="confirm-btn-yes"
                    onClick={() => removeProduct(id, newToastId)}
                    disabled={deleting}
                >
                    Yes
                </button>
                <button className="confirm-btn-no" onClick={() => toast.dismiss(newToastId)}>
                    No
                </button>
            </div>,
            {
                autoClose: 5000, // Prevents auto-closing
                closeOnClick: false,
            }
        );

        setToastId(newToastId); // Store the toast ID for this product
    };

    const removeProduct = async (id, newToastId) => {
        setDeleting(true);

        try {
            const response = await axios.delete(`${url}/products/remove/${id}`);
            if (response.data.success) {
                toast.success("Product removed");
                onDelete();
            } else {
                toast.error("Failed to remove product");
            }
        } catch (error) {
            toast.error("Server Error");
            console.error(error);
        } finally {
            setDeleting(false);
            toast.dismiss(newToastId); // Ensure the confirmation toast is dismissed
            setToastId(null); // Reset toast tracking
        }
    };

    return (
        <button className="bg-red-600 px-2 text-white rounded-md" onClick={confirmDelete} disabled={deleting}>
            <i className="ri-delete-bin-line"></i>
        </button>
    );
}
