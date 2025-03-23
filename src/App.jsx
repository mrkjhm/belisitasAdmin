import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar/Navbar';
import Sidebar from "./components/Sidebar/Sidebar";
import AddProduct from './pages/AddProduct/AddProduct';
import ProductList from './pages/ProductList/ProductList';
import Orders from './pages/Orders/Orders';
import EditProduct from './components/EditProduct/EditProduct';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';

import { UserProvider } from './Context/UserContext';
import Home from './pages/Home/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";

function App() {
  // Get token from localStorage when component mounts
  const [user, setUser] = useState({
    access: localStorage.getItem('token')
  });

  // Function for clearing the localStorage on logout
  const unsetUser = () => {
    localStorage.clear();
    setUser({ access: null });
  };

  const url = import.meta.env.VITE_URL;

  return (
    <>
      <ToastContainer />
      <UserProvider value={{ user, setUser, unsetUser }}>

        {user.access && <Navbar />}

        {user.access && <hr />}
        <div className="app-content">
          {user.access && <Sidebar />}

          <Routes>
            {/* If user is not logged in, restrict access to other pages */}
            {!user.access ? (
              <>
                <Route path="/login" element={<Login url={url} />} />
                <Route path="/reset-password" element={<ResetPassword url={url} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                {/* If user is logged in, redirect /login to Home */}
                <Route path="/login" element={<Navigate to="/" />} />

                <Route path="/" element={<Home url={url} />} />
                <Route path="/logout" element={<Logout url={url} />} />
                <Route path="/add" element={<AddProduct url={url} />} />
                <Route path="/list" element={<ProductList url={url} />} />
                <Route path="/orders" element={<Orders url={url} />} />
                <Route path="/edit-product/:id" element={<EditProduct url={url} />} />
                <Route path="/product/:id" element={<ProductDetail url={url} />} />

                {/* Catch all other routes and redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>
      </UserProvider>
    </>
  );
}

export default App;
