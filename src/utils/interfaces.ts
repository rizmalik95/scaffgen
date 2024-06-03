// interfaces.ts

export interface InputData {
    lessonObjectives: string;
    lessonStandards: string;
}

export interface UrlTabProps {
    onTabResult: (data: InputData) => void;
}
  
export interface StandardsTabProps {
    onTabResult: (data: InputData) => void;
}

export interface PdfTabProps {
    onTabResult: (data: InputData) => void;
}

// HumanUrlOrAIContent change to content
// image: ""
// title, summary, standard, tags, isAI

export interface ScaffoldProps {
    HumanURL_AIContent: string | string[];
    image: string;
    title: string;
    summary: string;
    standard: string;
    tags: string;
    isAI: boolean;
}
  