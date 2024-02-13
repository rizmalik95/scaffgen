import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

// scaffold props can be an array
// include standard in the visual
// make AllScaffolds take in the array with variables we can add in

interface ScaffoldProps {
    image: string;
    title: string;
    standard: string;
    summary: string;
    barGraph: string;
  }

// Individual Scaffold Component
const Scaffold = ({ image, title, standard, summary, barGraph }: ScaffoldProps) => {
    return (
      <div className="scaffold-container mx-4">
        <div className="scaffold-image relative">
          <img src={image} alt={title} className="w-full" />
          <div className="scaffold-title absolute inset-0 flex justify-center items-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity">
            <span className="text-white text-center">{title}</span>
          </div>
        </div>
        <p className="scaffold-summary mt-2">{summary}</p>
        <div className="scaffold-bar-graph mt-2">
          <img src={barGraph} alt="Bar Graph" className="w-full" />
        </div>
      </div>
    );
  };
  
// Main Component
const AllScaffolds = () => {
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

  // Data for the scaffolds
  const scaffoldsData = [
    {
      image: 'https://via.placeholder.com/300x200', // Filler image URL
      title: 'Scaffold 1',
      standard: '6.4.2.1',
      summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
      barGraph: 'https://via.placeholder.com/300x100', // Filler bar graph image URL
    },
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Scaffold 2',
      standard: '6.4.2.1',
      summary: 'Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis.',
      barGraph: 'https://via.placeholder.com/300x100',
    },
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Scaffold 3',
      standard: '6.4.2.1',
      summary: 'Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet.',
      barGraph: 'https://via.placeholder.com/300x100',
    },
    // Add more scaffolds as needed
  ];


  return (
    <div className="all-scaffolds">
      <h2 className="scaffolds-header text-center text-4xl font-bold my-8">Scaffolds</h2>
      <Slider {...settings}>
        {scaffoldsData.map((scaffold, index) => (
          <Scaffold
            key={index}
            image={scaffold.image}
            title={scaffold.title}
            standard={scaffold.standard}
            summary={scaffold.summary}
            barGraph={scaffold.barGraph}
          />
        ))}
      </Slider>
    </div>
  );
};

export default AllScaffolds;