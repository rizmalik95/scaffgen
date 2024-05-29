import React from 'react';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

// ScaffoldProps Interface
import { ScaffoldProps } from '~/utils/interfaces';

const gradientClasses = [
  "bg-gradient-to-b from-orange-200 to-white",
  "bg-gradient-to-b from-blue-200 to-white",
  "bg-gradient-to-b from-pink-200 to-white",
  "bg-gradient-to-b from-purple-200 to-white",
  "bg-gradient-to-b from-yellow-200 to-white",
  "bg-gradient-to-b from-green-200 to-white"
];

const imageLinks = [
  "https://i.ytimg.com/vi/lChy_cN3of0/maxresdefault.jpg",
  "https://saleshood.com/wp-content/uploads/2014/05/learning-culture.gif",
  "https://cdn-res.keymedia.com/cms/images/us/036/0308_638042050063908337.jpg",
  "https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2019-10/stairs_lightbulb_0.jpg?itok=2kHP2JcT",
  "https://www.fordfoundation.org/wp-content/uploads/2023/07/learning-archive.png",
  "https://lemonlearning.com/wp-content/uploads/2023/01/learning-by-doing-1.jpg"
];

/// Individual Scaffold Component
const Scaffold = ({ HumanURL_AIContent: pdfUrl, image, title, summary, standard, tags = '', isAI, gradient, onSelect, isSelected}: ScaffoldProps & {gradient: string, onSelect: () => void, isSelected: boolean}) => {
  // const handleScaffoldClick = () => {
  //   window.open(pdfUrl, '_blank'); // Opens the PDF URL in a new tab
  // };
  
  const tagList = tags ? tags.split(',').map(tag => tag.trim()) : [];
  if (isAI) {tagList.push('AI Generated')};
  const hasTag = (tagName: string) => tagList.includes(tagName);

  return (
    <div
      className={`w-[29%] mx-4 my-4 rounded-2xl shadow overflow-hidden ${gradient} border ${isSelected ? 'selected-gradient' : ''} font-sans \
      hover:shadow-md hover:border-slate-300 cursor-pointer`}
      onClick={onSelect}
    >
    {/* <div className={`w-[29%] mx-4 my-4 rounded-2xl shadow overflow-hidden ${gradient} border border-gray-200 font-sans \
                    hover:shadow-md hover:border-slate-300 cursor-pointer`}
          onClick={handleScaffoldClick}>
        > */}
      {/* Image Section with rounded corners */}
      <div className="relative">
        <img src={image} alt={title} className="w-2/3 mx-auto mt-4 rounded-xl" />
        <button
          className="absolute inset-0 w-full h-full bg-transparent"
          aria-label="Open PDF"
          style={{ zIndex: 10 }}
        ></button>
      </div>

      {/* Title Section */}
      <div className="text-left px-4 pt-4">
        <h2 className="text-black text-2xl font-bold">{title}</h2>
      </div>

      {/* Standards line centered vertically between title and summary */}
      <div className="text-left py-2 px-4">
        <p className="text-sm italic text-gray-600">{`Relevant Standards: ${standard}`}</p>
      </div>

      {/* Summary Text */}
      <div className="px-4 pb-4 text-gray-600 text-base leading-normal">
        <p>{summary}</p>
      </div>

      {/* Tags or Badges */}
      <div className="flex flex-wrap justify-center gap-2 p-4">
        {hasTag('Building Math Language') && <div className="bg-red-200 rounded-full px-4 py-1 text-sm font-medium text-red-800">Building Math Language</div>}
        {hasTag('Developing Fluency') && <div className="bg-blue-200 rounded-full px-4 py-1 text-sm font-medium text-blue-800">Developing Fluency</div>}
        {hasTag('Activate Background Knowledge') && <div className="bg-pink-200 rounded-full px-4 py-1 text-sm font-medium text-pink-800">Activate Background Knowledge</div>}
        {hasTag('Misconceptions') && <div className="bg-yellow-200 rounded-full px-4 py-1 text-sm font-medium text-yellow-800">Misconceptions</div>}
        {hasTag('Recruiting Interest') && <div className="bg-indigo-200 rounded-full px-4 py-1 text-sm font-medium text-indigo-800">Recruiting Interest</div>}
        {hasTag('Extra Challenge') && <div className="bg-purple-200 rounded-full px-4 py-1 text-sm font-medium text-purple-800">Extra Challenge</div>}
        {hasTag('AI Generated') && <div className="bg-green-200 rounded-full px-4 py-1 text-sm font-medium text-green-800">✨ AI Generated</div>}
      </div>
    </div>
  );
};

  
// Main Component
const AllScaffolds = ({ scaffoldsData, onSelectScaffold, selectedScaffolds }: { scaffoldsData: ScaffoldProps[], onSelectScaffold: (scaffold: ScaffoldProps) => void, selectedScaffolds: ScaffoldProps[] }) => {
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
    <div className="all-scaffolds max-w-hh mt-20">
      <h2 className="scaffolds-header text-center text-4xl font-bold my-8">Retrieved and Generated Scaffolds</h2>
      <div className="flex flex-wrap justify-between">
        {scaffoldsData.map((scaffold, index) => (
          <Scaffold
            key={index}
            HumanURL_AIContent={scaffold.HumanURL_AIContent}
            image={imageLinks[index % imageLinks.length] || imageLinks[0] || ''}
            title={scaffold.title}
            summary={scaffold.summary}
            standard={scaffold.standard}
            tags={scaffold.tags}
            isAI={scaffold.isAI}
            gradient={gradientClasses[index % gradientClasses.length] || gradientClasses[0] || ''}
            onSelect={() => onSelectScaffold(scaffold)}
            isSelected={selectedScaffolds.includes(scaffold)}
          />
        ))}
      </div>
    </div>
  );
};

export default AllScaffolds;