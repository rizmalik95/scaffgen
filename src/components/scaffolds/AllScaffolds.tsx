import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

// scaffold props can be an array
// include standard in the visual
// make AllScaffolds take in the array with variables we can add in

interface ScaffoldProps {
  pdfUrl: string;
  image: string;
  title: string;
  summary: string;
  standard: Array<string>;
  tags: Array<string>;
}

/// Individual Scaffold Component
// const Scaffold = ({ pdfUrl, image, title, summary }: ScaffoldProps) => {
//   const handleImageClick = () => {
//     window.open(pdfUrl, '_blank'); // Opens the PDF URL in a new tab
//   };

//   return (
//     <div className="mx-4 my-4 bg-teal-50 rounded-lg shadow-lg overflow-hidden">
//       <div className="title-section bg-purple-600 rounded-t-lg p-4 text-center">
//         <h2 className="text-white text-xl font-bold">{title}</h2>
//       </div>
//       <div className="scaffold-image relative">
//         <img src={image} alt={title} className="w-full max-w-md mx-auto" /> {/* Adjust the max-width as needed */}
//         <button
//           className="absolute inset-0 w-full h-full bg-transparent"
//           onClick={handleImageClick} // clickable button for opening pdfUrl
//           aria-label="Open PDF"
//           style={{ zIndex: 10 }}
//         ></button>
//       </div>
//       <div className="p-4">
//         <p className="text-gray-700 text-base">{summary}</p>
//       </div>
//     </div>
//   );
// };

// Individual Scaffold Component
const Scaffold = ({ pdfUrl, image, title, summary }: ScaffoldProps) => {
  const handleImageClick = () => {
    window.open(pdfUrl, '_blank'); // Opens the PDF URL in a new tab
  };

  return (
    <div className="w-[29%] mx-4 my-4 rounded-2xl shadow overflow-hidden bg-gradient-to-b from-purple-200 to-white border border-gray-200 font-sans">
      {/* Image Section with rounded corners */}
      <div className="relative">
        <img src={image} alt={title} className="w-2/3 mx-auto mt-4 rounded-xl" />
        <button
          className="absolute inset-0 w-full h-full bg-transparent"
          onClick={handleImageClick}
          aria-label="Open PDF"
          style={{ zIndex: 10 }}
        ></button>
      </div>

      {/* Left-aligned Title Section with transparent background */}
      <div className="p-4 text-left">
        <h2 className="text-black text-2xl font-bold">{title}</h2>
      </div>

      {/* Summary Text */}
      <div className="px-4 py-2 text-gray-600 text-base leading-normal">
        <p>{summary}</p>
      </div>

      {/* Tags or Badges */}
      <div className="flex flex-wrap justify-center gap-2 p-4">
        <div className="bg-red-200 rounded-full px-4 py-1 text-sm font-medium text-red-800">Building Math Language</div>
        <div className="bg-blue-200 rounded-full px-4 py-1 text-sm font-medium text-blue-800">Developing Fluency</div>
        <div className="bg-green-200 rounded-full px-4 py-1 text-sm font-medium text-green-800">Activate Background Knowledge</div>
        <div className="bg-yellow-200 rounded-full px-4 py-1 text-sm font-medium text-yellow-800">Misconceptions</div>
        <div className="bg-indigo-200 rounded-full px-4 py-1 text-sm font-medium text-indigo-800">Recruiting Interest</div>
        <div className="bg-purple-200 rounded-full px-4 py-1 text-sm font-medium text-purple-800">Extra Challenge</div>
      </div>
    </div>
  );
};


  
// Main Component
const AllScaffolds = ({ scaffoldsData }: { scaffoldsData: ScaffoldProps[] }) => {
  // Settings for the slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjust how many scaffolds to show at once
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    // other settings...
  };

  return (
    <div className="all-scaffolds max-w-hh">
      <h2 className="scaffolds-header text-center text-4xl font-bold my-8">Scaffolds</h2>
      <div className="flex flex-wrap justify-between">
        {scaffoldsData.map((scaffold, index) => (
          <Scaffold
            key={index}
            pdfUrl={scaffold.pdfUrl}
            image={scaffold.image}
            title={scaffold.title}
            summary={scaffold.summary}
            standard={scaffold.standard}
            tags={scaffold.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default AllScaffolds;