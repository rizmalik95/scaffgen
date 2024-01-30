const FileLinks = ({ files }) => {
    return (
      <div className="p-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold">Related Files</h2>
        <ul className="mt-2 space-y-2">
          {files.map((file, index) => (
            <li key={index}>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-500">
                {file.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FileLinks;
  