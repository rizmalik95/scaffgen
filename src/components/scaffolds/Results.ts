import { useEffect, useState } from 'react';
// import LessonInfo from '@/components/scaffolds/LessonInfo';
import BorderLinearProgress from '@/components/general/BorderLinearProgress';
import fetchAIScaffoldItem from '~/components/scaffolds/fetchAIScaffold';

import axios from 'axios';
import { set } from 'zod';

// InputData, ScaffoldProps Interface
import { InputData , ScaffoldProps } from '~/utils/interfaces';

const Results = async (lessonData: InputData): Promise<ScaffoldProps[]> => {
  // const [AIScaffolds, setAIScaffolds] = useState<ScaffoldProps[]>([]);
  // const [humanScaffolds, setHumanScaffolds] = useState<ScaffoldProps[]>([]);
  
  console.log("Fetching results for:", lessonData);

  const scaffoldTypes = ['backgroundKnowledge', 'mathLanguage', 'problemPairs', 'exitTicket'];

  // Fetch AI Scaffolds
  const fetchAIScaffolds = async () => {
    const promises = scaffoldTypes.map(async (scaffoldType) => {
      try {
        const scaffoldItem = await fetchAIScaffoldItem(lessonData, scaffoldType);
        return scaffoldItem;
      } catch (error) {
        console.error(`Error fetching scaffold for type ${scaffoldType}:`, error);
        return null;
      }
    });
    const newAIScaffolds = await Promise.all(promises);
    return newAIScaffolds.filter((item): item is ScaffoldProps => item !== null);
  };

  // Fetch Human Scaffolds
  const fetchHumanScaffolds = async () => {
    const payload = {
      objectives: lessonData.lessonObjectives,
      standards: lessonData.lessonStandards,
      k: 4
    };
    try {
      const response = await axios.post('/api/retrieval', payload);
      const scaffoldItems: ScaffoldProps[] = response.data.map((item: any) => ({
        HumanURL_AIContent: item.link_url,
        image: "",
        title: item.title,
        summary: item.pdf_summary,
        standard: item.standard,
        tags: item.type_tags,
        isAI: false,
      }));
      return scaffoldItems;
    } catch (error) {
      console.error('Error fetching human data:', error);
      return [];
    }
  };

  const newAIScaffolds = await fetchAIScaffolds();
  const newHumanScaffolds = await fetchHumanScaffolds();

  const allScaffoldsData = [...newHumanScaffolds, ...newAIScaffolds];
  console.log("All scaffolds combined:", allScaffoldsData);

  return allScaffoldsData;
};

export default Results;


// const Results = ({ lessonObjective, lessonStandard, submitCount }: { lessonObjective: string, lessonStandard: string, submitCount: number }) => {
  
//   const [LessonData, setLessonData] = useState<InputData>({ lessonObjectives: "", lessonStandards: "" });
//   const [lessonLoading, setLessonLoading] = useState(false);
//   // const [scaffold, setScaffold] = useState('' as string);
//   const [AIScaffoldLoading, setAIScaffoldLoading] = useState(false);
//   const [humanScaffoldLoading, setHumanScaffoldLoading] = useState(false);
//   const [AIScaffolds, setAIScaffolds] = useState<ScaffoldProps[]>([]);
//   const [humanScaffolds, setHumanScaffolds] = useState<ScaffoldProps[]>([]);

//   const [AIScaffoldPercentBuffered, setAIScaffoldPercentBuffered] = useState(0);
//   const [AIScaffoldPercentLoaded, setAIScaffoldPercentLoaded] = useState(0);

//   useEffect(() => {
//     const updateLessonData = async () => {
//       setLessonLoading(true);
//         setLessonData({
//           lessonObjectives: lessonObjective,
//           lessonStandards: lessonStandard
//         }
//         );
//       setLessonLoading(false);
//     }
//     updateLessonData();
//   }, [submitCount]);

//   useEffect(() => {
//     const fetchAIScaffolds = async () => {
//       if (LessonData.lessonObjectives && !AIScaffoldLoading) {
//         setAIScaffoldLoading(true);
//         setAIScaffoldPercentLoaded(0);
//         setAIScaffoldPercentBuffered(0);
//         setAIScaffolds([]);
//         // For loop through different Scaffold Types
//         const scaffoldTypes = ['backgroundKnowledge', 'mathLanguage', 'problemPairs', 'exitTicket']

//         try {
//           const promises = scaffoldTypes.map(async (scaffoldType) => {
//             try {
//               // setAIScaffoldPercentBuffered((i + 1) / scaffoldTypes.length * 100);
//               const scaffoldItem = await fetchAIScaffoldItem(LessonData, scaffoldType);
              
//               console.log('this is scaffold items output: ', scaffoldItem);

//               setAIScaffoldPercentLoaded(prevPercent => prevPercent + 100 / scaffoldTypes.length);
//               return scaffoldItem;
//             } catch (error) {
//               console.error(`Error fetching scaffold for type ${scaffoldType}:`, error);
//               return null; // Return null or some error indication to handle later
//             }
//           });
//           const newAIScaffolds = await Promise.all(promises);
//           setAIScaffolds(newAIScaffolds.filter((item): item is ScaffoldProps => item !== null));
//         } catch (error) {
//           console.error('Error fetching AI Scaffold:', error);
//         } finally {
//           setAIScaffoldLoading(false);
//         }
//       }
//       setAIScaffoldLoading(false);
//     };
//   fetchAIScaffolds();
//   }, [LessonData]);

//   useEffect(() => {
//     const fetchHumanScaffolds = async () => {
//       if (LessonData.lessonObjectives) {
//         setHumanScaffoldLoading(true);
//         // Call retrieval api input Objectives and Standards
//         // get back a list [(pdfurl, title, summary), (pdfurl, title, summary), ...]
//         const payload = {
//           objectives: LessonData.lessonObjectives,
//           standards: LessonData.lessonStandards,
//           k: 4
//         };
//         try {
//           const response = await axios.post('/api/retrieval', payload);
//           const scaffoldItems: ScaffoldProps[] = response.data.map((item: any) => ({
//             HumanURL_AIContent: item.link_url,
//             image: "",
//             title: item.title,
//             summary: item.pdf_summary,
//             standard: item.standard,
//             tags: item.type_tags,
//             isAI: false,
//           }));
//           setHumanScaffolds(scaffoldItems);
//           setHumanScaffoldLoading(false);
//         } catch (error) {
//           console.error('Error fetching human data:', error);
//           // Handle error appropriately
//         }
//       }
//     }
//     fetchHumanScaffolds();
//   }, [LessonData]);

//   const getResults = (): ScaffoldProps[] => {
//     return humanScaffolds.concat(AIScaffolds);
//   };
//   return getResults();

// };

// export default Results;


// -----------------------------------------------------

//   const render = (result: InputData) => {
//     if (submitCount == 0) {
//       return (
//         <div></div>
//       )
//     }
//     const elements: JSX.Element[] = [];
//     if (lessonLoading) {
//       // elements.push(<p key="lessonLoading">Loading lesson...</p>);
//     } else if (result.lessonObjectives) {
//       elements.push(
//         <div key="lessonInfo" className="my-5 w-full md:w-10/12 lg:max-w-6xl mx-auto">
//           <LessonInfo lessonObjectives={result.lessonObjectives} lessonStandards={result.lessonStandards} />
//         </div>
//       )
//     }
//     // Taking humanScaffolds and AIScaffolds generated from LessonData
//     if (humanScaffoldLoading || AIScaffoldLoading) {
//       elements.push(
//         <div key="scaffoldLoading" className="flex flex-col w-2/3 mx-auto">
//           <p className="mx-auto text-xl font-bold text-slate-700 py-5">Loading scaffolds...</p>
//           <BorderLinearProgress key="linearProgress" variant="buffer" value={AIScaffoldPercentLoaded} valueBuffer={AIScaffoldPercentBuffered} />
//         </div>
//       );
//       elements.push()
//     } else if (humanScaffolds.length > 0 || AIScaffolds.length > 0){

//       elements.push(<AllScaffolds key="scaffolds" scaffoldsData={humanScaffolds.concat(AIScaffolds)} />)
//     }
//     return <div className="mb-30">{elements}</div>;
//   };

//   return (
//     <div className="flex flex-col gap-8 items-center mb-40">
//       {render(LessonData)}
//     </div>
//   );
// };

// export default Results;