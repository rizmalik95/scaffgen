interface lessonInfoProps {
  lessonObjectives: string;
  lessonStandards: string;
}

const LessonInfo = ({ lessonObjectives, lessonStandards }: lessonInfoProps) => {
  return (
    <div className="flex flex-row md:justify-between gap-10 flex-wrap mx-auto w-full">
      <div className="flex flex-col md:text-left md:max-w-[66%]">
        <h2 className="text-xl font-bold mb-3">Lesson Objectives</h2>
        <p>{lessonObjectives}</p>
      </div>
      <div className="flex flex-col md:text-right">
        <h2 className="text-xl font-bold mb-3">Lesson Standards</h2>
        <p>{lessonStandards}</p>
      </div>
    </div>
  );
};

export default LessonInfo;
