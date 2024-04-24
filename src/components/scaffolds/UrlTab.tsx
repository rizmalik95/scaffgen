import React, { useState } from 'react';
import axios from 'axios';

function UrlTab({ onTabResult }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    const isValid = url.startsWith('https://curriculum.illustrativemathematics.org/');
    setError(isValid ? '' : 'Please enter a valid Illustrative Mathematics URL.');
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!validateUrl(url)) return;

    try {
      const response = await axios.get(`/api/curriculum?url=${encodeURIComponent(url)}`);
      onTabResult({
        lessonObjectives: response.data.learningObjectives.join(', '),
        lessonStandards: response.data.standards.join(', ')
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please check the URL and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center relative w-full">
      <div className="relative w-full">
        <input
          id="urlInput" // Adding a unique ID
          name="url" // Adding a name attribute
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL"
          className="outline-none w-full h-12 rounded-lg text-gray-700 pr-12 pl-4 border border-slate-300 focus:border-slate-400 shadow-md focus:shadow-md p-2 transition-colors duration-150 ease-in-out"
          autoComplete="url" // Adding autoComplete for better UX
        />
        <button type="submit" className="absolute right-0 inset-y-0 my-auto flex items-center px-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}

export default UrlTab;