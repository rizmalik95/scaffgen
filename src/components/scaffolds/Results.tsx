import { useEffect, useState } from 'react';
import AllScaffolds from '@/components/scaffolds/AllScaffolds';
import LessonInfo from '@/components/scaffolds/LessonInfo';
import BorderLinearProgress from '@/components/general/BorderLinearProgress';
import fetchAIScaffoldItem from '~/components/scaffolds/fetchAIScaffold';

import axios from 'axios';
import { set } from 'zod';

interface ResultItem {
  lessonObjectives: string;
  lessonStandards: string;
}

interface ScaffoldItem {
  pdfUrl: string;
  title: string;
  summary: string;
  standard: string;
  tags: string;
  isAI: boolean;
}

// TODO: make this import the same scaffoldProps from AllScaffolds.tsx
interface ScaffoldProps {
    pdfUrl: string;
    image: string;
    title: string;
    summary: string;
    standard: string;
    tags: string;
    isAI: boolean;
}

const Results = ({ lessonObjective, lessonStandard, submitCount }: { lessonObjective: string, lessonStandard: string, submitCount: number }) => {
  
  const [LessonData, setLessonData] = useState<ResultItem>({ lessonObjectives: "", lessonStandards: "" });
  const [lessonLoading, setLessonLoading] = useState(false);
  const [scaffold, setScaffold] = useState('' as string);
  const [AIScaffoldLoading, setAIScaffoldLoading] = useState(false);
  const [humanScaffoldLoading, setHumanScaffoldLoading] = useState(false);
  const [AIScaffolds, setAIScaffolds] = useState<ScaffoldItem[]>([]);
  const [humanScaffolds, setHumanScaffolds] = useState<ScaffoldItem[]>([]);

  const [AIScaffoldPercentBuffered, setAIScaffoldPercentBuffered] = useState(0);
  const [AIScaffoldPercentLoaded, setAIScaffoldPercentLoaded] = useState(0);

  useEffect(() => {
    const updateLessonData = async () => {
      setLessonLoading(true);
        setLessonData({
          lessonObjectives: lessonObjective,
          lessonStandards: lessonStandard
        }
        );
      setLessonLoading(false);
    }
    updateLessonData();
  }, [submitCount]);

  useEffect(() => {
    const fetchAIScaffolds = async () => {
      if (LessonData.lessonObjectives && !AIScaffoldLoading) {
        setAIScaffoldLoading(true);
        setAIScaffoldPercentLoaded(0);
        setAIScaffoldPercentBuffered(0);
        setAIScaffolds([]);
        // For loop through different Scaffold Types
        const scaffoldTypes = ['backgroundKnowledge', 'mathLanguage', 'problemPairs', 'exitTicket']

        try {
          const promises = scaffoldTypes.map(async (scaffoldType, i) => {
            try {
              // setAIScaffoldPercentBuffered((i + 1) / scaffoldTypes.length * 100);
              const scaffoldItem = await fetchAIScaffoldItem(LessonData, scaffoldType);
              setAIScaffoldPercentLoaded(prevPercent => prevPercent + 100 / scaffoldTypes.length);
              return scaffoldItem;
            } catch (error) {
              console.error(`Error fetching scaffold for type ${scaffoldType}:`, error);
              return null; // Return null or some error indication to handle later
            }
          });
          const newAIScaffolds = await Promise.all(promises);
          setAIScaffolds(newAIScaffolds.filter((item): item is ScaffoldItem => item !== null));
        } catch (error) {
          console.error('Error fetching AI Scaffold:', error);
        } finally {
          setAIScaffoldLoading(false);
        }
      }
      setAIScaffoldLoading(false);
    };
  fetchAIScaffolds();
}, [LessonData]);

  useEffect(() => {
    const fetchHumanScaffolds = async () => {
      if (LessonData.lessonObjectives) {
        setHumanScaffoldLoading(true);
        // Call retrieval api input Objectives and Standards
        // get back a list [(pdfurl, title, summary), (pdfurl, title, summary), ...]
        const payload = {
          objectives: LessonData.lessonObjectives,
          standards: LessonData.lessonStandards,
          k: 4
        };
        try {
          const response = await axios.post('/api/retrieval', payload);
          const scaffoldItems: ScaffoldItem[] = response.data.map((item: any) => ({
            pdfUrl: item.link_url,
            title: item.title,
            summary: item.pdf_summary,
            standard: item.standard,
            tags: item.type_tags,
            isAI: false,
          }));
          setHumanScaffolds(scaffoldItems);
          setHumanScaffoldLoading(false);
        } catch (error) {
          console.error('Error fetching human data:', error);
          // Handle error appropriately
        }
      }
    }
    fetchHumanScaffolds();
  }, [LessonData]);

  const convertToScaffoldProps = (scaffoldItems: ScaffoldItem[]): ScaffoldProps[] => {
    return scaffoldItems.map((item) => ({
      pdfUrl: item.pdfUrl,
      image: 'https://i.ytimg.com/vi/lChy_cN3of0/maxresdefault.jpg', // to change next
      title: item.title,
      summary: item.summary,
      standard: item.standard,
      tags: item.tags,
      isAI: item.isAI,
    }));
  };

  const render = (result: ResultItem) => {
    if (submitCount == 0) {
      return (
        <div></div>
      )
    }
    const elements: JSX.Element[] = [];
    if (lessonLoading) {
      // elements.push(<p key="lessonLoading">Loading lesson...</p>);
    } else if (result.lessonObjectives) {
      elements.push(
        <div key="lessonInfo" className="my-5 w-full md:w-10/12 lg:max-w-6xl mx-auto">
          <LessonInfo lessonObjectives={result.lessonObjectives} lessonStandards={result.lessonStandards} />
        </div>
      )
    }
    // Taking humanScaffolds and AIScaffolds generated from LessonData, add image + bar graph image
    if (humanScaffoldLoading || AIScaffoldLoading) {
      elements.push(
        <div key="scaffoldLoading" className="flex flex-col w-2/3 mx-auto">
          <p className="mx-auto text-xl font-bold text-slate-700 py-5">Loading scaffolds...</p>
          <BorderLinearProgress key="linearProgress" variant="buffer" value={AIScaffoldPercentLoaded} valueBuffer={AIScaffoldPercentBuffered} />
        </div>
      );
      elements.push()
    } else if (humanScaffolds.length > 0 || AIScaffolds.length > 0){
      const scaffoldsDataHuman = convertToScaffoldProps(humanScaffolds);
      const scaffoldsDataAI = convertToScaffoldProps(AIScaffolds);

      elements.push(<AllScaffolds key="scaffolds" scaffoldsData={scaffoldsDataHuman.concat(scaffoldsDataAI)} />)
    }
    return <div className="mb-30">{elements}</div>;
  };

  return (
    <div className="flex flex-col gap-8 items-center mb-40">
      {render(LessonData)}
    </div>
  );
};

export default Results;