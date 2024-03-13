import { useEffect, useState } from 'react';
import ResultCard from '@/components/scaffolds/ResultCard';
import AllScaffolds from '@/components/scaffolds/AllScaffolds';
// import ScaffoldProps from '@/components/scaffolds/AllScaffolds';
import axios from 'axios';

interface ResultItem {
  lessonObjectives: string;
  lessonStandards: string;
}

interface ScaffoldItem {
  pdfUrl: string;
  title: string;
  summary: string;
  standard: Array<string>;
  tags: Array<string>;
}

// TODO: make this import the same scaffoldProps from AllScaffolds.tsx
interface ScaffoldProps {
    pdfUrl: string;
    image: string;
    title: string;
    summary: string;
    standard: Array<string>;
    tags: Array<string>;
  }

const Results = ({ url, submitCount }: { url: string, submitCount: number }) => {
  const [LessonData, setLessonData] = useState<ResultItem>({ lessonObjectives: '', lessonStandards: '' });
  const [lessonLoading, setLessonLoading] = useState(false);
  const [scaffold, setScaffold] = useState('' as string);
  const [scaffoldLoading, setScaffoldLoading] = useState(false);
  const [AIScaffolds, setAIScaffolds] = useState<ScaffoldItem[]>([]);
  const [humanScaffolds, setHumanScaffolds] = useState<ScaffoldItem[]>([]);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (url) {
        setLessonLoading(true);
        try {
          const response = await axios.get(`/api/curriculum?url=${encodeURIComponent(url)}`);
          setLessonData({
            lessonObjectives: response.data.learningObjectives.join(', '),
            lessonStandards: response.data.standards.join(', ')
          }
          );
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error appropriately
        }
        setLessonLoading(false);
      }
    };

    fetchLessonData();
  }, [url, submitCount]);


  useEffect(() => {
    const fetchAIScaffolds = async () => {
      if (LessonData.lessonObjectives) {
        // For loop through different Scaffold Types
        const scaffoldTypes = ['backgroundKnowledge', 'mathLanguage']
        let newAIScaffolds = [];
        for (let i = 0; i < scaffoldTypes.length; i++) {
          const payload = {
            lessonObjectives: LessonData.lessonObjectives,
            lessonSttandards: LessonData.lessonStandards,
            scaffoldType: scaffoldTypes[i]
          };
          try {
            // Somewhere here we need to match scaffoldGenerator.ts API output to pdfUrl, title, summary for AllScaffolds.tsx 
            const response = await axios.post('/api/scaffoldGenerator', payload);
            const scaffoldItem = {
              pdfUrl: response.data.pdfUrl,
              title: response.data.title,
              summary: response.data.activity
            };
            newAIScaffolds.push(scaffoldItem);
          } catch (error) {
            console.error('Error fetching data:', error);
            }
          }
          // setAIScaffolds([...AIScaffolds, scaffoldItem]);
          setAIScaffolds(prevState => [...prevState, ...newAIScaffolds]);
          setScaffoldLoading(false);
          // console.log('scaffoldItem');
          // console.log(scaffoldItem);
          // console.log('AIScaffolds')
          // console.log(AIScaffolds) 
        }
        console.log('AIScaffolds')
        console.log(AIScaffolds)
      };
    fetchAIScaffolds();
  }, [LessonData]);

  useEffect(() => {
    const fetchHumanScaffolds = async () => {
      if (LessonData.lessonObjectives) {
        setScaffoldLoading(true);
        // Call retrieval api input Objectives and Standards
        // get back a list [(pdfurl, title, summary), (pdfurl, title, summary), ...]
        const payload = {
          objectives: LessonData.lessonObjectives,
          standards: LessonData.lessonStandards,
          k: 3
        };
        try {
          const response = await axios.post('/api/retrieval', payload);
          const scaffoldItems: ScaffoldItem[] = response.data.map((item: any) => ({
            pdfUrl: item.link_url,
            title: item.title,
            summary: item.pdf_summary,
            standard: item.standard,
            tags: item.type_tags
          }));
          setHumanScaffolds(scaffoldItems);
          console.log('scaffoldItems')
          console.log(scaffoldItems)
        } catch (error) {
          console.error('Error fetching data:', error);
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
    }));
  };

  const render = (result: ResultItem) => {
    const elements: JSX.Element[] = [];

    if (lessonLoading) {
      elements.push(<p key="loading">Loading lesson...</p>);
    } else {
      elements.push(<ResultCard key="lesson" title="Lesson Plan" content={result.lessonObjectives} />)
      elements.push(<ResultCard key="objective" title="Lesson Objective" content={result.lessonStandards} />)
    }
    // Taking humanScaffolds and AIScaffolds generated from LessonData, add image + bar graph image
    if (scaffoldLoading) {
      elements.push(<p key="loading">Loading scaffolds...</p>);
    } else {
      const scaffoldsDataHuman = convertToScaffoldProps(humanScaffolds);
      const scaffoldsDataAI = convertToScaffoldProps(AIScaffolds);
  
      elements.push(<AllScaffolds key="human" scaffoldsData={scaffoldsDataHuman} />)
      elements.push(<AllScaffolds key="ai" scaffoldsData={scaffoldsDataAI} />)
    }
    return <div>{elements}</div>;
  };

  return (
    <div className="container mx-auto p-4">
      <h2>Results</h2>
      {render(LessonData)}
    </div>
  );
};

export default Results;