import React, { useState, useEffect } from "react";
import InputForm from "@/components/scaffolds/InputForm";
import LessonInfo from '@/components/scaffolds/LessonInfo';
import Results from "@/components/scaffolds/Results";
import AllScaffolds from '@/components/scaffolds/AllScaffolds';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

import axios from "axios";

import { InputData, ScaffoldProps } from '~/utils/interfaces';

/* 
Start.tsx Outline

1. InputForm.tsx
  - input: one of the three tabs (string)
  - output: InputData --> LessonObjectives, LessonStandards

  a. UrlTab.tsx
    - curriculum.ts
  b. StandardsTab.tsx
  c. PdfTab.tsx
    - fake function for now

2. LessonInfo.tsx
  - input: InputData
  - output: LessonInfo card that displays LessonObjectives, LessonStandards

3. Results.ts
  - input: InputData
  - output: list of ScaffoldProps interface for each scaffold

  a. Retrieve human PDF scaffolds as ScaffoldProps
  b. Generate AI scaffolds content as ScaffoldProps
    i. call openAI api to generate slides format
    ii. use the format to create into presentation
  c. Images/previews?

4. AllScaffolds.tsx
  - input: list of ScaffoldProps interface for each scaffold
  - output: display all scaffold cards AND return a list of ScaffoldProps for selected scaffolds

5. createPresentation.ts
  - input: session.accessToken
  - output: response (which has presentationID - personal URL for google slides presentation)

6. updatePresentation.ts
  - input: session.accessToken, presentationId (personal URL), list of ScaffoldProps for selected scaffolds
  - output: final presentation link
*/

export default function Start() {
  const [lessonData, setLessonData] = useState<InputData>({
    lessonObjectives: "",
    lessonStandards: "",
  });
  const [submitCount, setSubmitCount] = useState(0);
  const [activeTab, setActiveTab] = useState("illustrativeMathematics");
  const [scaffolds, setScaffolds] = useState<ScaffoldProps[]>([]);
  const [selectedScaffolds, setSelectedScaffolds] = useState<ScaffoldProps[]>([]);

  const [presentationLink, setPresentationLink] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleResultsInput = (inputType: string, inputData: InputData) => {
    console.log(`Handling results input: ${inputType}`, inputData); // Log for debugging
    setLessonData({
      lessonObjectives: inputData.lessonObjectives || "",
      lessonStandards: inputData.lessonStandards || "",
    });
    setSubmitCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    // Reset lessonData when the active tab changes
    setLessonData({ lessonObjectives: "", lessonStandards: "" });
    setSubmitCount(0);
  }, [activeTab]);

  useEffect(() => {
    if (lessonData.lessonObjectives && lessonData.lessonStandards) {
      const fetchAndSetResults = async () => {
        const resultScaffolds = await Results(lessonData);
        setScaffolds(resultScaffolds);
      };
      fetchAndSetResults();
    }
  }, [lessonData, submitCount]);

  const handleSelectScaffold = (scaffold: ScaffoldProps) => {
    setSelectedScaffolds(prevSelectedScaffolds => {
      if (prevSelectedScaffolds.includes(scaffold)) {
        return prevSelectedScaffolds.filter(item => item !== scaffold);
      } else {
        return [...prevSelectedScaffolds, scaffold];
      }
    });
  };

  const handleCreatePresentation = async () => {
    if (session) {
      const accessToken = session.accessToken as string;
      const response = await axios.post("/api/createPresentation", { accessToken });
      const newPresentationId = response.data.presentationId;

      await axios.post("/api/updatePresentation", {
        accessToken,
        presentationId: newPresentationId,
        scaffolds: selectedScaffolds,
      });

      setPresentationLink(`https://docs.google.com/presentation/d/${newPresentationId}/edit`);
    }
  };

  return (
    <div className="max-w-hh mx-auto flex min-h-screen flex-col items-center bg-slate-100">
      <div className="container flex min-w-96 flex-col items-center gap-8 pt-10">
        <h1 className="text-4xl font-bold">
          Get Curriculum-Aligned Instructional Scaffolds
        </h1>
        <p className="text-md font-normal text-gray-600">
          To get started, provide the link of the Illustrative Mathematics
          lesson you're teaching
        </p>
        <InputForm
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResultsInput={handleResultsInput}
        />
        {lessonData.lessonObjectives && lessonData.lessonStandards && (
          <div key="lessonInfo" className="my-5 w-full md:w-10/12 lg:max-w-6xl mx-auto">
            <LessonInfo lessonObjectives={lessonData.lessonObjectives} lessonStandards={lessonData.lessonStandards} />
          </div>
        )}
        {scaffolds.length > 0 && (
          <AllScaffolds
            scaffoldsData={scaffolds}
            onSelectScaffold={handleSelectScaffold}
            selectedScaffolds={selectedScaffolds}
          />
        )}
        <div className="mt-4 flex flex-col gap-8">
          {selectedScaffolds.length > 0 && (
            <button className="rounded-lg bg-rose-400 px-4 py-2.5 font-semibold text-white hover:bg-rose-300 active:bg-rose-500" onClick={handleCreatePresentation}>
              Create presentation
            </button>
          )}
          {presentationLink && (
            <a href={presentationLink} target="_blank" className="text-blue-500 underline">
              Open your presentation
            </a>
          )}
        </div>
      </div>
    </div>
  );
}