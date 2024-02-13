import { useEffect, useState } from 'react';
import ResultCard from '@/components/scaffolds/ResultCard';
import AllScaffolds from '@/components/scaffolds/AllScaffolds';
import axios from 'axios';

interface ResultItem {
  lessonPlan: string;
  lessonObjective: string;
}

const Results = ({ url, submitCount }: { url: string, submitCount: number }) => {
  const [result, setResult] = useState<ResultItem>({ lessonPlan: '', lessonObjective: '' });
  const [lessonLoading, setLessonLoading] = useState(false);
  const [scaffold, setScaffold] = useState('' as string);
  const [scaffoldLoading, setScaffoldLoading] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (url) {
        setLessonLoading(true);
        try {
          const response = await axios.get(`/api/curriculum?url=${encodeURIComponent(url)}`);
          setResult({
            lessonPlan: response.data.learningObjectives.join(', '),
            lessonObjective: response.data.standards.join(', ')
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
    const fetchScaffoldGen = async () => {
      if (result) {
        setScaffoldLoading(true);

        const payload = {
          lessonPlan: result.lessonPlan,
          lessonObjective: result.lessonObjective
        };

        try {
          const response = await axios.post('/api/scaffoldGenerator', payload);
          const activity = response.data.activity;
          setScaffold(activity);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error appropriately
        }
        setScaffoldLoading(false);
      }
    }
    fetchScaffoldGen();
  }, [result]);

  const render = (result: ResultItem) => {
    const elements: JSX.Element[] = [];

    if (lessonLoading) {
      elements.push(<p key="loading">Loading lesson...</p>);
    } else {
      elements.push(<ResultCard key="lesson" title="Lesson Plan" content={result.lessonPlan} />)
      elements.push(<ResultCard key="objective" title="Lesson Objective" content={result.lessonObjective} />)
    }
    if (scaffoldLoading) {
      elements.push(<p key="loading">Loading scaffold...</p>);
    } else {
      // TEMPORARY manual scaffold fill, replace with scaffolds from database
      const scaffoldsData = [
        {
          image: 'https://via.placeholder.com/300x200', // Filler image URL
          title: 'Scaffold 1',
          standard: result.lessonObjective,
          summary: scaffold,
          barGraph: 'https://via.placeholder.com/300x100', // Filler bar graph image URL
        },
        {
          image: 'https://via.placeholder.com/300x200', // Filler image URL
          title: 'Scaffold 2',
          standard: result.lessonObjective,
          summary: scaffold,
          barGraph: 'https://via.placeholder.com/300x100', // Filler bar graph image URL
        },
      ]
      elements.push(<AllScaffolds key="scaffolds" scaffoldsData={scaffoldsData} />)
    }

    return <div>{elements}</div>;
  };


  return (
    <div className="container mx-auto p-4">
      <h2>Results</h2>
      {render(result)}
    </div>
  );
};

export default Results;