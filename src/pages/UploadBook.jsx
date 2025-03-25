import React, { useState } from 'react';

function UploadBook() {
  const [book, setBook] = useState({ title: '', description: '', image: '', chapters: [] });
  const [chapter, setChapter] = useState({ title: '', content: '' });

  const handleBookChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (e) => {
    setChapter({ ...chapter, [e.target.name]: e.target.value });
  };

  const addChapter = () => {
    setBook({ ...book, chapters: [...book.chapters, chapter] });
    setChapter({ title: '', content: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send book data to the server
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
      .then(response => response.json())
      .then(data => {
        // Redirect or give feedback
        console.log('Book uploaded successfully:', data);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload a New Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input type="text" name="title" value={book.title} onChange={handleBookChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea name="description" value={book.description} onChange={handleBookChange} className="w-full p-2 border rounded"></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Image URL</label>
          <input type="text" name="image" value={book.image} onChange={handleBookChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Add Chapters</h2>
          <input type="text" name="title" value={chapter.title} onChange={handleChapterChange} placeholder="Chapter Title" className="w-full p-2 mb-2 border rounded" />
          <textarea name="content" value={chapter.content} onChange={handleChapterChange} placeholder="Chapter Content" className="w-full p-2 border rounded"></textarea>
          <button type="button" onClick={addChapter} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Add Chapter</button>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Upload Book</button>
      </form>
    </div>
  );
}

export default UploadBook;
