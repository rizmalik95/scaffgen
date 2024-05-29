// InputData Interface
import { InputData } from '~/utils/interfaces';


const LessonInfo = ({ lessonObjectives, lessonStandards }: InputData) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-10 mx-auto lg:w-15/16 p-4">
      <div className="flex flex-col w-full lg:w-2/3 text-left">
        <h2 className="text-xl font-bold mb-3">Lesson Objectives</h2>
        <p className="text-left">{lessonObjectives}</p>
      </div>
      <div className="flex flex-col w-full lg:w-1/3 text-right">
        <h2 className="text-xl font-bold mb-3">Lesson Standards</h2>
        <p>{lessonStandards}</p>
      </div>
    </div>
  );
};

export default LessonInfo;
