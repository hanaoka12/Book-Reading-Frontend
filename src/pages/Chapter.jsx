import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Chapter = () => {
  const { bookId, chapterNumber } = useParams();
  const [chapterContent, setChapterContent] = useState('');
  const [totalChapters, setTotalChapters] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [lineHeight, setLineHeight] = useState('relaxed');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const fontSizes = { small: 'text-base', medium: 'text-lg', large: 'text-xl' };
  const lineHeights = { compact: 'leading-relaxed', relaxed: 'leading-loose', spacious: 'leading-[2.5]' };

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch book details
        const bookResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!bookResponse.ok) throw new Error('Failed to fetch book details');
        const bookData = await bookResponse.json();
        setTotalChapters(bookData.chapters.length);

        // Fetch specific chapter content
        const chapterResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${bookId}/chapter/${chapterNumber}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        if (!chapterResponse.ok) throw new Error('Failed to fetch chapter content');
        const chapterData = await chapterResponse.json();
        setChapterContent(chapterData.content);
        setIsLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchBookData();
  }, [bookId, chapterNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#e1dcc5] flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(chapterContent);

  // Convert sanitized HTML to plain text to avoid reading tags
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedContent, 'text/html');
  const plainText = doc.body.textContent || '';

  const handleSpeak = () => {
    if (!plainText || isSpeaking) return;
    setIsSpeaking(true);
    setIsPaused(false);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
    if (!isSpeaking) return;
    if (!isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const NavigationButtons = ({ chapterNumber, totalChapters, bookId }) => (
    <div className="flex justify-between items-center w-full -mb-8">
      {parseInt(chapterNumber) > 1 && (
        <Link
          to={`/books/${bookId}/chapter/${parseInt(chapterNumber) - 1}`}
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-md hover:shadow-lg transform hover:-translate-x-1 transition-all duration-200"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Chapter
        </Link>
      )}
      {parseInt(chapterNumber) < totalChapters && (
        <Link
          to={`/books/${bookId}/chapter/${parseInt(chapterNumber) + 1}`}
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-md hover:shadow-lg transform hover:translate-x-1 transition-all duration-200 ml-auto"
        >
          Next Chapter
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-[#e1dcc5]'}`}>
      {/* Settings + Speech Controls */}
      <div className="fixed top-20 left-4 flex flex-col gap-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-lg backdrop-blur-sm z-10">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="p-2 rounded-lg bg-transparent"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <select
          value={lineHeight}
          onChange={(e) => setLineHeight(e.target.value)}
          className="p-2 rounded-lg bg-transparent"
        >
          <option value="compact">Compact</option>
          <option value="relaxed">Relaxed</option>
          <option value="spacious">Spacious</option>
        </select>

        {!isSpeaking && (
          <button onClick={handleSpeak} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            ▶️ Read Aloud
          </button>
        )}
        {isSpeaking && (
          <div className="flex flex-col gap-2">
            <button onClick={handlePauseResume} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {isPaused ? '⏯ Resume' : '⏸ Pause'}
            </button>
            <button onClick={handleStop} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              ⏹ Stop
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto p-4 md:p-8 lg:p-12 max-w-4xl">
        <NavigationButtons 
          chapterNumber={chapterNumber} 
          totalChapters={totalChapters} 
          bookId={bookId} 
        />

        <div className={`
          ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}
          shadow-lg rounded-lg 
          p-6 md:p-10 
          transition-colors duration-200
          mt-12
        `}>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Chapter {chapterNumber}</h1>
          <div className={`
            space-y-6 
            ${fontSizes[fontSize]} 
            ${lineHeights[lineHeight]}
            max-w-prose 
            mx-auto
            ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}
          `}>
            {/* Render sanitised HTML in the UI */}
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </div>
        </div>

        <div className="mt-8">
          <NavigationButtons 
            chapterNumber={chapterNumber} 
            totalChapters={totalChapters} 
            bookId={bookId} 
          />
        </div>
      </div>
    </div>
  );
};

export default Chapter;