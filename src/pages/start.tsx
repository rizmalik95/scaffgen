import { useState } from 'react';
import InputForm from '@/components/scaffolds/InputForm';
import Results from '@/components/scaffolds/Results';
import AllScaffolds from '@/components/scaffolds/AllScaffolds';

export default function Start() {
  const [url, setUrl] = useState('');
  const [submitCount, setSubmitCount] = useState(0);

  const handleSubmit = (url: string) => {
    setUrl(url);
    setSubmitCount(submitCount + 1);
  }

  return (
    <div className="container mx-auto p-4">
      <h1>Generate Scaffolds</h1>
      <InputForm onSubmitUrl={(url) => handleSubmit(url)} />
      <Results url={url} submitCount={submitCount} />
      <AllScaffolds></AllScaffolds>
    </div>
  );
}