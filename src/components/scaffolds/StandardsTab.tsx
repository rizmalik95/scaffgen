// Standards Tab
import React, { useState } from 'react';
import standardsData from './MS_math_standards.json';

// StandardsTabProps Interface
import { StandardsTabProps } from '~/utils/interfaces';

const StandardsTab = ({ onTabResult } : StandardsTabProps) => {
  const [grade, setGrade] = useState('');
  const [unit, setUnit] = useState('');
  const [selectedStandards, setSelectedStandards] = useState('');
  const [lessonObjectives, setLessonObjectives] = useState('');
  const [error, setError] = useState('');
  
  const uniqueGrades = [...new Set(standardsData.map(item => item.Grade))];
  const uniqueUnitsForGrade = [...new Set(standardsData.filter(item => item.Grade === grade).map(item => item.Unit))];
  const standardsForUnit = standardsData.filter(item => item.Grade === grade && item.Unit === unit);

  const gridContainerStyle : React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '15% 25% auto', // Columns size for grade, units and standards
    gridTemplateRows: 'auto 1fr', // Two rows
    gridColumnGap: '1rem', // Gap between columns
    gridRowGap: '1rem', // Gap between rows
    alignItems: 'start',
  };
  const headerStyle : React.CSSProperties = {
    textAlign: 'center', // Center align the headers
    width: '100%', // Make the headers take up the full width of their container
    marginBottom: '0.5rem', // Optional: adds some space below the header
  };  
  const gradesAndUnitsContainerStyle : React.CSSProperties= {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px', // Gap between rows
  };
    // For the text area and its label to take up the full space of two columns
  const textAreaContainerStyle = {
    gridColumnStart: 1, // Start from the first column
    gridColumnEnd: 3, // Span until before the third column
    gridRowStart: 2, // Start from the second row
  };
    // For the standards to take up the full space of two rows
  const standardsContainerStyle = {
    gridColumn: '3',
    gridRow: '1 / span 2', // Span across both rows
  };

  type ButtonCategory = keyof typeof buttonStyles;

    // Style for how individual buttons look
  const buttonStyle = {
    display: 'block', // Ensure the button spans the full width of its container
    width: '80%', // Set a fixed width for all buttons
    textAlign: 'center' as 'center', // Center the text inside the button
    backgroundColor: '#f0e1f5', // Replace with the pastel color you want
    border: 'none',
    borderRadius: '20px',
    padding: '15px', // Increase padding for a larger button
    margin: '10px auto', // Center the button with auto margins and add space between buttons
    cursor: 'pointer',
    color: '#333',
    fontSize: '1em',
  };
    // Changes button colors based on grade, unit, and standard
  const buttonStyles = {
    grade: {
      default: '#FFD599', // orange color for Grade buttons
      selected: '#FFB145' // darker orange for selected Grade button
    },
    unit: {
      default: '#BDE6C4', // green color for Unit buttons
      selected: '#63E27F' // darker green for selected Unit button
    },
    standard: {
      default: '#DAC1E5', // purple color for Standard buttons
      selected: '#CB90E4' // darker purple for selected Standard button
    }
  };

  const getButtonStyle = (category: ButtonCategory, isSelected: boolean): React.CSSProperties => {
    return {
      ...buttonStyle,
      backgroundColor: isSelected ? buttonStyles[category].selected : buttonStyles[category].default
    };
  };

  const handleStandardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedStandards(prevSelectedStandards => {
      const currentStandards = prevSelectedStandards ? prevSelectedStandards.split(', ') : [];
      if (checked) {
        // Add the standard ID to the currentStandards array
        currentStandards.push(value);
      } else {
        // Remove the standard ID from the currentStandards array
        const index = currentStandards.indexOf(value);
        if (index > -1) {
          currentStandards.splice(index, 1);
        }
      }
      // Return the updated standards as a string
      return currentStandards.join(', ');
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!lessonObjectives.trim() || !selectedStandards.trim()) {
      // Set an error message if either field is empty
      setError("Please ensure both lesson objectives and standards are selected.");
      return; // Stop the form submission if validation fails
    }

    setError('');
    onTabResult({ lessonObjectives, lessonStandards: selectedStandards });
  };

  // UI rendering
    return (
        <>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={gridContainerStyle}>
                <div style={{ ...gradesAndUnitsContainerStyle }}>
                <h2 style={headerStyle}>Grade Level</h2>
                {uniqueGrades.map(g => (
                    <button
                    key={g}
                    onClick={() => {
                        setGrade(g);
                        setUnit(''); // Reset unit selection
                        setSelectedStandards(''); // Reset selected standards
                    }}
                    style={getButtonStyle('grade', g === grade)}
                    >
                    {`Grade ${g}`}
                    </button>
                ))}
                </div>
                
                {grade && (
                <div style={{ ...gradesAndUnitsContainerStyle }}>
                    <h2 style={headerStyle}>Unit</h2>
                    {uniqueUnitsForGrade.map(u => (
                    <button
                        key={u}
                        onClick={() => {
                        setUnit(u);
                        setSelectedStandards(''); // Reset selected standards
                        }}
                        style={getButtonStyle('unit', u === unit)}
                    >
                        {u}
                    </button>
                    ))}
                </div>
                )}
                
                {unit && (
                <div style={standardsContainerStyle}>
                    <h2 style={headerStyle}>Standards</h2>
                    {standardsForUnit.map(s => (
                    <div key={s.StandardID} style={{ ...buttonStyle, textAlign: 'left', paddingLeft: '20px' }}>
                        <input
                        type="checkbox"
                        id={s.StandardID}
                        name={s.StandardID}
                        value={s.StandardID}
                        onChange={handleStandardChange}
                        checked={selectedStandards.split(', ').includes(s.StandardID)}
                        style={{ marginRight: '10px' }}
                        />
                        <label htmlFor={s.StandardID}>{`${s.StandardID} - ${s.StandardDescription}`}</label>
                    </div>
                    ))}
                </div>
                )}

                {selectedStandards && (
                <div style={textAreaContainerStyle}>
                    <label htmlFor="lessonObjectives">Please Briefly Explain your Lesson Objectives:</label>
                    <div className="relative w-full">
                      <textarea
                        id="lessonObjectives"
                        rows={4}
                        value={lessonObjectives} // Add the value binding
                        onChange={(e) => setLessonObjectives(e.target.value)} // Add the change handler
                        placeholder="Enter your lesson objectives here..."
                        className="outline-none w-full rounded-lg text-gray-700 p-4 border border-slate-300 focus:border-slate-400 shadow-md focus:shadow-md transition-colors duration-150 ease-in-out mt-2"
                      ></textarea>
                      <button type="submit" className="absolute bottom-2 mb-2 flex items-center px-4" style={{ right: '-0.35rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                </div>
                )}
              {/* Display an error message if the error state is not empty */}
              {/* {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}  */}
            </div>
          </form>
        </>
    );
};

export default StandardsTab;
