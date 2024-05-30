import axios from "axios";

// InputData, ScaffoldProps Interface
import { InputData , ScaffoldProps } from '~/utils/interfaces';

export default async function fetchAIScaffoldItem(
  LessonData: InputData,
  scaffoldType: string,
): Promise<ScaffoldProps> {
  const payload = {
    lessonObjectives: LessonData.lessonObjectives,
    lessonStandards: LessonData.lessonStandards,
    scaffoldType: scaffoldType,
  };

  try {
    const startResponse = await axios.post("/api/scaffoldGenerator", payload);
    const taskId = startResponse.data.taskId;
    let pollCount = 0;

    // Check status
    const checkStatus = async (): Promise<ScaffoldProps> => {
      return new Promise(async (resolve, reject) => {
        if (pollCount < 18) { // pollCount times the setTimeout time is max time we'll wait
          const statusResponse = await axios.get(
            `/api/checkScaffoldGeneratorStatus?taskId=${taskId}`,
          );
          if (statusResponse.data.status === "Completed") {
            const scaffoldResponse = statusResponse.data.data;
            
            // THIS IS WHERE WE INTEGRATES GOOGLE SLIDES API INSTEAD
            // const pdfGenResponse = await axios.post("/api/pdfGenerator", {
            //   scaffold_html: scaffoldResponse.activity,
            // });
            // console.log(pdfGenResponse.data.pdfUrl);
            
            const scaffoldProps: ScaffoldProps = {
              HumanURL_AIContent: scaffoldResponse.activity,
              image: "",
              title: scaffoldResponse.title,
              summary: scaffoldResponse.summary,
              standard: payload.lessonStandards,
              tags: scaffoldResponse.tags,
              isAI: true,
            };
            resolve(scaffoldProps);
          } else if (statusResponse.data.status === "In progress") {
            pollCount++;
            setTimeout(() => resolve(checkStatus()), 5000); // Retry after five seconds
          } else {
            reject(
              new Error(
                statusResponse.data.error ||
                  `Error in generating scaffold from Task id: ${taskId} status: ${statusResponse.data.status}`,
              ),
            );
          }
        } else {
          reject(new Error(`Task id: ${taskId} took too long to complete`));
        }
      });
    };

    const result = await checkStatus();
    if (result) {
      return result;
    } else {
      throw new Error("Error in generating AI scaffold");
    }
  } catch (error) {
    console.error("Error fetching AI Scaffold:", error);
    throw error;
  }
}
