import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function DeleteButton({ id, name, url, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const [toastId, setToastId] = useState(null);

    const confirmDelete = () => {
        if (toastId) toast.dismiss(toastId);

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
            { autoClose: false, closeOnClick: false }
        );

        setToastId(newToastId);
    };

    const removeProduct = async (id, newToastId) => {
        if (deleting) return;

        setDeleting(true);
        console.log("🟡 Attempting to delete product with ID:", id);

        try {
            const response = await axios.delete(`${url}/products/remove/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log("🟢 Backend Response:", response.data);

            if (response.data.success) {
                toast.success("✅ Product and image removed from Cloudinary");
                onDelete(id); // ✅ Ensure we pass the ID to update the product list

                // ✅ Only dismiss confirmation toast after success
                toast.dismiss(newToastId);
            } else {
                toast.error(response.data.message || "❌ Failed to remove product");
            }
        } catch (error) {
            console.error("🔴 Error removing product:", error);
            toast.error(error.response?.data?.message || "❌ Server Error");
        } finally {
            setDeleting(false);
        }
    };





    return (
        <button className="bg-red-600 px-2 text-white rounded-md" onClick={confirmDelete} disabled={deleting}>
            <i className="ri-delete-bin-line"></i>
        </button>
    );
}
