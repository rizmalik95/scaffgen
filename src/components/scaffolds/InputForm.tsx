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
    // return (
    //     <div className="flex flex-col items-center justify-start min-h-screen pt-20">
    //         <h1 className="text-2xl font-bold mb-10">Generate Scaffolds</h1>
    //         <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 relative w-full">
    //             <div className="relative w-11/12">
    //                 <input
    //                     type="text"
    //                     value={url}
    //                     onChange={(e) => setUrl(e.target.value)}
    //                     placeholder="Enter the URL"
    //                     className="input input-bordered w-full h-12 rounded-lg text-gray-700 pr-12 pl-4" // added pl-4 for padding
    //                     style={{backgroundColor: 'var(--input)', borderColor: 'var(--border)', borderWidth: '2px'}}
    //                 />
    //                 <button type="button" onClick={() => {/* logic to navigate to the next page */}} 
    //                         className="absolute right-0 inset-y-0 my-auto flex items-center px-4">
    //                     {/* SVG for the right arrow icon */}
    //                     {/* Replace this SVG with the SVG code for your specific arrow icon */}
    //                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    //                         <polyline points="9 18 15 12 9 6"></polyline>
    //                     </svg>
    //                 </button>
    //             </div>
    //             {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* moved error message */}
    //             <button type="submit" className="mt-2 p-2 rounded-full text-white"
    //                     style={{backgroundColor: 'var(--primary)', outlineColor: 'var(--ring)'}}
    //                     onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
    //                     onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}>
    //                 {/* SVG for the submission arrow, if needed */}
    //                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
    //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    //                 </svg>
    //             </button>
    //         </form>
    //     </div>
    // );

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter the URL"
                    className="input input-bordered w-full max-w-xs"
                />
                <button type="submit" className="block bg-gray-800 text-sm font-medium text-white hover:bg-gray-600 active:bg-gray-900 md:inline">Submit</button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default InputForm;