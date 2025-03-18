import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../Context/UserContext";

export default function Logout() {
    const { unsetUser, setUser } = useContext(UserContext);

    useEffect(() => {
        unsetUser(); // ✅ Call unsetUser inside useEffect
        setUser({ access: null });
    }, [unsetUser, setUser]); // ✅ Add dependencies

    return <Navigate to="/login" />;
}
