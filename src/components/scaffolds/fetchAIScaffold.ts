import axios from "axios";

interface ResultItem {
  lessonObjectives: string;
  lessonStandards: string;
}

interface ScaffoldItem {
  pdfUrl: string;
  title: string;
  summary: string;
  standard: string;
  tags: string;
  isAI: boolean;
}

export default async function fetchAIScaffoldItem(
  LessonData: ResultItem,
  scaffoldType: string,
): Promise<ScaffoldItem> {
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
    const checkStatus = async (): Promise<ScaffoldItem> => {
      return new Promise(async (resolve, reject) => {
        if (pollCount < 15) {
          const statusResponse = await axios.get(
            `/api/checkScaffoldGeneratorStatus?taskId=${taskId}`,
          );
          if (statusResponse.data.status === "Completed") {
            const scaffoldResponse = statusResponse.data.data;
            console.log(`got scaffold response for task id: ${taskId}`);
            const pdfGenResponse = await axios.post("/api/pdfGenerator", {
              scaffold_html: scaffoldResponse.activity,
            });
            console.log(`got pdf response for task id: ${taskId}`);
            console.log(pdfGenResponse.data.pdfUrl);
            const scaffoldItem: ScaffoldItem = {
              pdfUrl: pdfGenResponse.data.pdfUrl,
              title: scaffoldResponse.title,
              summary: scaffoldResponse.summary,
              standard: payload.lessonStandards,
              tags: scaffoldResponse.tags,
              isAI: true,
            };
            resolve(scaffoldItem);
          } else if (statusResponse.data.status === "In progress") {
            pollCount++;
            setTimeout(() => resolve(checkStatus()), 2000); // Retry after two seconds
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
