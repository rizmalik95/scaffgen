import { useState } from "react";
import InputForm from "@/components/scaffolds/InputForm";
import Results from "@/components/scaffolds/Results";
import AllScaffolds from "@/components/scaffolds/AllScaffolds";

export default function Start() {
  const [url, setUrl] = useState("");
  const [submitCount, setSubmitCount] = useState(0);

  const handleSubmit = (url: string) => {
    setUrl(url);
    setSubmitCount(submitCount + 1);
  };

  return (
    <div className="flex flex-col max-w-hh min-h-screen bg-slate-100 items-center mx-auto">
      <div className="container flex flex-col items-center gap-8 pt-10 min-w-96">
        <h1 className="text-4xl font-bold">Generate Scaffolds</h1>
        <InputForm onSubmitUrl={(url) => handleSubmit(url)} />
        <Results url={url} submitCount={submitCount} />
      </div>
    </div>
  );
}
