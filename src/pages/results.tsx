// pages/results.tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResultCard from '../components/ResultCard';
import axios from 'axios';

const Results = () => {
    const router = useRouter();
    const { url } = router.query;
    const [results, setResults] = useState([]);
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
    }, [url]);

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <div>Loading...</div> // Simple loading indicator
            ) : (
                results.map((result, index) => (
                    <ResultCard key={index} title={result.title} content={result.content} />
                ))
            )}
        </div>
    );
};

export default Results;

  


































