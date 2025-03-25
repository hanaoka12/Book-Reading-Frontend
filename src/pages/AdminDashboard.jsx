import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link to="/edit-book" className="bg-yellow-500 text-white px-4 py-2 rounded">
          Edit Book
        </Link>
        <Link to="/delete-book" className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Book
        </Link>
        
      </div>
    </div>
  );
}

export default AdminDashboard;
