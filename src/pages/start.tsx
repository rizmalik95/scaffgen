import React, { useState, useEffect } from 'react';
import InputForm from "@/components/scaffolds/InputForm";
import Results from "@/components/scaffolds/Results";
// import AllScaffolds from "@/components/scaffolds/AllScaffolds";

/* 
Start.tsx Outline

1. InputForm.tsx
  - input: one of the three tabs (string)
  - output: lesson standards and lesson objectives
  - Tab structure object thing
    1. UrlTab.tsx
     - curriculum.ts
    2. StandardsTab.tsx
    3. PdfTab.tsx
     - fake function for now
    all three of these should return lesson standards and objectives
  
2. Results 
  - input: lesson standards and lesson objectives (currently LessonData variable)
  - generate AI pdfs (all the original content)
  - display other pdfs (all the original content)

*/
interface InputData {
  lessonObjectives: string;
  lessonStandards: string;
}

export default function Start() {
  const [lessonData, setLessonData] = useState({ lessonObjective: '', lessonStandard: '' });
  const [submitCount, setSubmitCount] = useState(0);
  const [activeTab, setActiveTab] = useState('illustrativeMathematics'); 

  // const handleResultsInput = (inputType, inputData) => {
  //   console.log(`Handling results input: ${inputType}`, inputData); // Log for debugging
  //   if (inputType === 'url' || inputType === 'standards' || inputType === 'pdf') {
  //     setLessonData({
  //       lessonObjective: inputData.lessonObjectives,
  //       lessonStandard: inputData.lessonStandards,
  //     });
  //     setSubmitCount(prevCount => prevCount + 1);
  //   }
  // };

  const handleResultsInput = (inputType : string, inputData : InputData) => {
    console.log(`Handling results input: ${inputType}`, inputData); // Log for debugging
    setLessonData({ lessonObjective: inputData.lessonObjectives || '', lessonStandard: inputData.lessonStandards || '' });
    setSubmitCount(prevCount => prevCount + 1);
  };
  
  useEffect(() => {
    // Reset lessonData when the active tab changes
    setLessonData({ lessonObjective: '', lessonStandard: '' });
    setSubmitCount(0);
  }, [activeTab]);
  
  return (
    <div className="flex flex-col max-w-hh min-h-screen bg-slate-100 items-center mx-auto">
      <div className="container flex flex-col items-center gap-8 pt-10 min-w-96">
        <h1 className="text-4xl font-bold">Get Curriculum-Aligned Instructional Scaffolds</h1>
        <p className="text-md font-normal text-gray-600">To get started, provide the link of the Illustrative Mathematics lesson you're teaching</p>
        <InputForm activeTab={activeTab} setActiveTab={setActiveTab} onResultsInput={handleResultsInput} />
        <Results {...lessonData} submitCount={submitCount} />
      </div>
    </div>
  );
}