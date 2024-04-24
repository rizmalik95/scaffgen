interface ResultItem {
    lessonObjectives: string;
    lessonStandards: string;
  }

export default async function fetchAIScaffolds(lessonData: ResultItem, scaffoldTypes: string[]) )