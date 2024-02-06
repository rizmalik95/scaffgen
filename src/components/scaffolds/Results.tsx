import { useEffect, useState } from 'react';
import ResultCard from '@/components/scaffolds/ResultCard';
import axios from 'axios';

interface ResultItem {
  title: string;
  content: string;
}

const Results = ({ url, submitCount }: { url: string, submitCount: number }) => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (url) {
        setLoading(true);
        try {
          const response = await axios.get(`/api/curriculum?url=${encodeURIComponent(url)}`);
          setResults([
            { title: 'Lesson Objective', content: response.data.learningObjectives.join(', ') },
            { title: 'Teaching Standard', content: response.data.standards.join(', ') }
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error appropriately
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [url, submitCount]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2>Results</h2>
      {results.map((result, index) => (
        <ResultCard key={index} title={result.title} content={result.content} />
      ))}
    </div>
  );
};

export default Results;