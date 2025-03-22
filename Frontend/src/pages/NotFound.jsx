import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404 - Not Found</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! The page you are looking for does not exist.
        </p>
        <p className="text-lg text-gray-500 mb-6">
          The requested URL <code className="font-medium text-indigo-600">{location.pathname}</code> was not found on this server.
        </p>
        <Link to="/"
          className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;