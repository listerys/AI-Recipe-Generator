// components/Layout.js
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
  return (
    <>
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeButton={false}
        toastClassName="!bg-white !border !border-gray-200 !rounded-xl !shadow-sm !text-gray-700"
      />
      <main className="min-h-screen flex flex-col bg-gray-50">
        {children}
      </main>
    </>
  );
}