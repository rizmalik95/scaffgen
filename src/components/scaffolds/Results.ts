import { useEffect, useState } from 'react';
// import LessonInfo from '@/components/scaffolds/LessonInfo';
import fetchAIScaffoldItem from '~/components/scaffolds/fetchAIScaffold';

import axios from 'axios';
import { set } from 'zod';

// InputData, ScaffoldProps Interface
import { InputData , ScaffoldProps } from '~/utils/interfaces';

const Results = async (lessonData: InputData, setScaffoldPercentLoaded: React.Dispatch<React.SetStateAction<number>>): Promise<ScaffoldProps[]> => {
  // const [AIScaffolds, setAIScaffolds] = useState<ScaffoldProps[]>([]);
  // const [humanScaffolds, setHumanScaffolds] = useState<ScaffoldProps[]>([]);
  
  console.log("Fetching results for:", lessonData);

  const scaffoldTypes = ['backgroundKnowledge', 'mathLanguage', 'problemPairs', 'exitTicket'];

  // Fetch AI Scaffolds
  const fetchAIScaffolds = async () => {
    setScaffoldPercentLoaded(0.0);
    let currentPercent = 0.0;
    const promises = scaffoldTypes.map(async (scaffoldType) => {
      try {
        const scaffoldItem = await fetchAIScaffoldItem(lessonData, scaffoldType);
        currentPercent += 100 / scaffoldTypes.length;
        setScaffoldPercentLoaded(currentPercent);
        return scaffoldItem;
      } catch (error) {
        console.error(`Error fetching scaffold for type ${scaffoldType}:`, error);
        return null;
      }
    });
    const newAIScaffolds = await Promise.all(promises);
    return newAIScaffolds.filter((item): item is ScaffoldProps => item !== null);
  };

  // Fetch Human Scaffolds
  const fetchHumanScaffolds = async () => {
    const payload = {
      objectives: lessonData.lessonObjectives,
      standards: lessonData.lessonStandards,
      k: 4
    };
    try {
      const response = await axios.post('/api/retrieval', payload);
      const scaffoldItems: ScaffoldProps[] = response.data.map((item: any) => ({
        HumanURL_AIContent: item.link_url,
        image: "",
        title: item.title,
        summary: item.pdf_summary,
        standard: item.standard,
        tags: item.type_tags,
        isAI: false,
      }));
      return scaffoldItems;
    } catch (error) {
      console.error('Error fetching human data:', error);
      return [];
    }
  };

  console.log("Fetching scaffolds")
  const newAIScaffolds = await fetchAIScaffolds();
  console.log("Fetched AI")
  const newHumanScaffolds = await fetchHumanScaffolds();
  console.log("Fetched human")

  const allScaffoldsData = [...newHumanScaffolds, ...newAIScaffolds];
  console.log("All scaffolds combined:", allScaffoldsData);

  return allScaffoldsData;
};

export default Results;