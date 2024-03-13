import { useState } from 'react';

const InputForm = ({ onSubmitUrl }: { onSubmitUrl: (url: string) => void }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url: string) => {
    const isValid = url.startsWith('https://curriculum.illustrativemathematics.org/');
    setError(isValid ? '' : 'Please enter a valid Illustrative Mathematics URL.');
    return isValid;
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onSubmitUrl(url);
    }
  };

  // RITIKA -- BETTER UI BUT NOT CONNECTED
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center relative w-2/3">
      <div className="relative w-full">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL"
          className="outline-none w-full h-12 rounded-lg text-gray-700 pr-12 pl-4
          border border-slate-300 focus:border-slate-400 shadow-md focus:shadow-md p-2 transition-colors duration-150 ease-in-out" // added pl-4 for padding
        />
        <button type="submit"
          className="absolute right-0 inset-y-0 my-auto flex items-center px-4">
          {/* SVG for the right arrow icon */}
          {/* Replace this SVG with the SVG code for your specific arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* moved error message */}
    </form>
  );
};

export default InputForm;