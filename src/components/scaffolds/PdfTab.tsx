// PDF Tab
import React, { useState } from 'react';

const PdfTab = ({ onTabResult }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      // Assuming you want to do something with the file at this point
      onTabResult({ file });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      // Assuming you want to do something with the file at this point
      onTabResult({ file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This could be where you handle the file upload/processing
    if (file) {
      // onUploadPdf(file); // Removed based on new structure
      onTabResult({ file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-52 flex justify-center items-center border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} rounded-lg cursor-pointer transition-all duration-300 ease-in-out`}
      >
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
        />
        <label htmlFor="file-upload" className="text-center">
          <p className="mb-3">Drop files here to upload</p>
          <p className="mb-3">or</p>
          <button
            type="button"
            className="px-4 py-2 mb-3 rounded bg-blue-500 text-white"
            onClick={() => document.getElementById('file-upload').click()}
          >
            Select Files
          </button>
        </label>
      </div>
    </form>
  );
};

export default PdfTab;
