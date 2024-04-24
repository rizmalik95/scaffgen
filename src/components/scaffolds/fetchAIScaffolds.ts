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

export default async function fetchAIScaffoldItem(LessonData: ResultItem, scaffoldType: string): Promise<ScaffoldItem> {
  const payload = {
    lessonObjectives: LessonData.lessonObjectives,
    lessonStandards: LessonData.lessonStandards,
    scaffoldType: scaffoldType
  };
  
  try {
    const startResponse = await axios.post('/api/scaffoldGenerator', payload);
    const taskId = startResponse.data.taskId;

    // Check status
    const checkStatus = async (): Promise<ScaffoldItem | undefined> => {
      const statusResponse = await axios.get(`/api/checkScaffoldGeneratorStatus?taskId=${taskId}`);
      if (statusResponse.data.status === 'Completed') {
        const scaffoldResponse = statusResponse.data.data;
        const pdfGenResponse = await axios.post('/api/pdfGenerator', { scaffold_html: scaffoldResponse.activity });
        const scaffoldItem: ScaffoldItem = {
        pdfUrl: pdfGenResponse.data.pdfUrl,
        title: scaffoldResponse.data.title,
        summary: scaffoldResponse.data.summary,
        standard: payload.lessonStandards,
        tags: scaffoldResponse.data.tags, 
        isAI: true,
        };
        return scaffoldItem;
      } else if (statusResponse.data.status === 'In progress') {
        setTimeout(checkStatus, 1000); // Check status every second
      } else {
        throw new Error(statusResponse.data.data.error || 'Error in generating scaffold');
      }
      return undefined;
    };
    
    const result = await checkStatus();
    if (result) {
      return result;
    } else {
      throw new Error('Error in generating AI scaffold');
    }
  }
  catch (error) {
    console.error('Error fetching AI Scaffold:', error);
    throw error;
  }
}
