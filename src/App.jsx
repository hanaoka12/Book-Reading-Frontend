import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail'; // BookDetails component
import Chapter from './pages/Chapter'; 
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook'; 
import AdminDashboard from './pages/AdminDashboard';
import AddChapter from './pages/AddChapter';
import EditChapter from './pages/EditChapter';
import BookManagement from './pages/BookManagement';
import Profile from './pages/Profile';
import EditChaptersList from './pages/EditChaptersList';
import EditChapterContent from './pages/EditChapterContent';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import CategoryBooks from './pages/CategoryBooks';
import Favourite from './pages/Favourite'; // or wherever it's located

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1])); 
    return payload.role;
  }
  return null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  return isAuthenticated() && getUserRole() === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  const mysteryBooks = []; // Fetch or pass as props
  const fictionBooks = [];
  const fantasyBooks = [];

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/:bookId/chapter/:chapterNumber" element={<Chapter />} /> {/* Chapter route */}
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:categoryName" element={<CategoryBooks />} />
            {/* Private routes for general users */}
            <Route path="/add-book" element={<PrivateRoute><AddBook /></PrivateRoute>} />
            <Route path="/manage-books" element={<PrivateRoute><BookManagement /></PrivateRoute>} /> {/* Book management restricted */}
            <Route path="/add-chapter/:bookId" element={<PrivateRoute><AddChapter /></PrivateRoute>} /> {/* Add chapter restricted */}
            <Route path="/edit-chapter/:bookId" element={<PrivateRoute><EditChapter /></PrivateRoute>} /> {/* Edit chapter restricted */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/edit-chapters/:bookId" element={<PrivateRoute><EditChaptersList /></PrivateRoute>} />
            <Route path="/edit-chapter/:bookId/:chapterNumber" element={<PrivateRoute><EditChapterContent /></PrivateRoute>} />
            <Route path="/edit-book/:id" element={<PrivateRoute><EditBook /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favourite /></PrivateRoute>} />
            {/* Private route for admin */}
            <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </div>
        <Footer 
          isAuthenticated={isAuthenticated} 
          
        />
      </div>
    </Router>
  );
}

export default App;
