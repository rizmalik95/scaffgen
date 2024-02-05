// import { useState } from 'react';

// const InputForm = ({ onSubmitUrl }) => {
//     const [url, setUrl] = useState('');
//     const [error, setError] = useState('');

//     const validateUrl = (url) => {
//         const isValid = url.startsWith('https://curriculum.illustrativemathematics.org/');
//         setError(isValid ? '' : 'Please enter a valid Illustrative Mathematics URL.');
//         return isValid;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateUrl(url)) {
//             onSubmitUrl(url);
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                     placeholder="Enter the URL"
//                     className="input input-bordered w-full max-w-xs"
//                 />
//                 <button type="submit" className="btn btn-primary">Submit</button>
//             </form>
//             {error && <p className="text-red-500">{error}</p>}
//         </div>
//     );
// };

// export default InputForm;
