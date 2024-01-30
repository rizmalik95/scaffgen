const LLMOutput = ({ content }) => {
    return (
      <div className="p-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold">LLM-Generated Content</h2>
        <p className="mt-2 text-sm text-gray-700">{content}</p>
      </div>
    );
  };
  
  export default LLMOutput;
  