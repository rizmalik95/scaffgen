const ResultCard = ({ title, content }: { title: string, content: string }) => {
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{content}</p>
            </div>
        </div>
    );
};
  
export default ResultCard;
