// PDF Tab
// every line where there is onTabResult({ file }); needs to be changed to send back "data" = objectives and standards
import React, { useState } from 'react';

interface InputData {
    lessonObjectives: string;
    lessonStandards: string;
}
  
interface PdfTabProps {
    onTabResult: (data: InputData) => void;
}

const PdfTab = ({ onTabResult } : PdfTabProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
    //   setFile(file);

      // NEED TO CHANGE ONCE THIS IS WORKING
      onTabResult({
        lessonObjectives: '',
        lessonStandards: ''
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
    //   setFile(file);

      // NEED TO CHANGE ONCE THIS IS WORKING
      onTabResult({
        lessonObjectives: '',
        lessonStandards: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This could be where you handle the file upload/processing
    if (file) {
      // onUploadPdf(file); // Removed based on new structure
      
      // NEED TO CHANGE ONCE THIS IS WORKING
      onTabResult({
        lessonObjectives: '',
        lessonStandards: ''
      });
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
            onClick={() => {
                const inputElement = document.getElementById('file-upload') as HTMLInputElement;
                if (inputElement !== null) {
                    inputElement.click();
                }
            }}
          >
            Select Files
          </button>
        </label>
      </div>
    </form>
  );
};

export default PdfTab;
