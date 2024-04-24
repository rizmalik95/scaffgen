import React from 'react';
import UrlTab from './UrlTab';
import StandardsTab from './StandardsTab';
import PdfTab from './PdfTab';

const tabContentStyle = {
  width: '100%',
  borderTop: '1px solid #e0e0e0', // separates tabs from content
  paddingTop: '20px'
};

const InputForm = ({ activeTab, setActiveTab, onResultsInput } : { activeTab: any, setActiveTab: any, onResultsInput: (inputType: string, inputData: any) => void }) => {
  const handleTabSubmit = (inputType, inputData) => {
    console.log(`Data received from ${inputType}:`, inputData);
    onResultsInput(inputType, inputData);
  };


// const InputForm = ({ onResultsInput }: { onResultsInput: (inputType: string, inputData: any) => void }) => {
//   const [activeTab, setActiveTab] = useState('illustrativeMathematics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'illustrativeMathematics':
        return <UrlTab onTabResult={(data) => handleTabSubmit('url', data)} />;
      case 'byStandards':
        return <StandardsTab onTabResult={(data) => handleTabSubmit('standards', data)} />;
      case 'uploadPdf':
        return <PdfTab onTabResult={(data) => handleTabSubmit('pdf', data)} />;
      default:
        return null;
    }
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    textAlign: 'center',
    padding: '10px 0',
    cursor: 'pointer',
    backgroundColor: isActive ? '#e0e0e0' : 'transparent', // some color tint for active tab
    transition: 'background-color 0.3s ease-in-out'
  });

  return (
    <div className="w-full">
      <div className="tabs flex justify-between">
        <button onClick={() => setActiveTab('illustrativeMathematics')} style={tabStyle(activeTab === 'illustrativeMathematics')}>
          Illustrative Mathematics Link
        </button>
        <button onClick={() => setActiveTab('byStandards')} style={tabStyle(activeTab === 'byStandards')}>
          Common Core Standards
        </button>
        <button onClick={() => setActiveTab('uploadPdf')} style={tabStyle(activeTab === 'uploadPdf')}>
          Upload Existing PDF
        </button>
      </div>
      <div className="tab-content" style={{ width: '100%', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default InputForm;