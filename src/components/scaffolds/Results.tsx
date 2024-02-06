import { useEffect, useState } from 'react';
import ResultCard from '@/components/scaffolds/ResultCard';
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

          return activity;
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
      elements.push(<ResultCard key="scaffold" title="Scaffold" content={scaffold} />)
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