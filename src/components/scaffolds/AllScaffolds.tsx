import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

// scaffold props can be an array
// include standard in the visual
// make AllScaffolds take in the array with variables we can add in

interface ScaffoldProps {
    pdfUrl: string; // Ritika come back and create a button from the image + title that opens the pdf link
    image: string;
    title: string;
    summary: string;
    barGraph: string;
  }

/// Individual Scaffold Component
const Scaffold = ({ pdfUrl, image, title, summary }: ScaffoldProps) => {
  const handleImageClick = () => {
    window.open(pdfUrl, '_blank'); // Opens the PDF URL in a new tab
  };

  return (
    <div className="mx-4 my-4 bg-teal-50 rounded-lg shadow-lg overflow-hidden">
      <div className="title-section bg-purple-600 rounded-t-lg p-4 text-center">
        <h2 className="text-white text-xl font-bold">{title}</h2>
      </div>
      <div className="scaffold-image relative">
        <img src={image} alt={title} className="w-full max-w-md mx-auto" /> {/* Adjust the max-width as needed */}
        <button
          className="absolute inset-0 w-full h-full bg-transparent"
          onClick={handleImageClick} // clickable button for opening pdfUrl
          aria-label="Open PDF"
          style={{ zIndex: 10 }}
        ></button>
      </div>
      <div className="p-4">
        <p className="text-gray-700 text-base">{summary}</p>
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
    <div className="all-scaffolds">
      <h2 className="scaffolds-header text-center text-4xl font-bold my-8">Scaffolds</h2>
      <Slider {...settings}>
        {scaffoldsData.map((scaffold, index) => (
          <Scaffold
            key={index}
            pdfUrl={scaffold.pdfUrl}
            image={scaffold.image}
            title={scaffold.title}
            summary={scaffold.summary}
            barGraph={scaffold.barGraph}
          />
        ))}
      </Slider>
    </div>
  );
};

export default AllScaffolds;