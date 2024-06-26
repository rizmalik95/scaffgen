import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

import callOpenAI from "~/utils/callOpenAI";
import loadYamlFile from "~/utils/loadYamlFile";
import { createTaskId, setTaskStatus } from "~/utils/taskManager";


type ScaffoldData = {
  activity?: string;
  title?: string;
  summary?: string;
  tags?: string;
  message?: string;
  error?: string;
};

type ResponseData = {
  taskId?: string;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { lessonObjectives, lessonStandards, scaffoldType } = req.body;

  if (!lessonObjectives) {
    res.status(400).json({ error: "Please provide both lesson objectives" });
    return;
  }

  const taskId = createTaskId();
  
  setTaskStatus(taskId, { status: 'In progress' });

  // Move long-running task to async execution
  processScaffold(taskId, lessonObjectives, lessonStandards, scaffoldType);

  // Respond immediately with task ID
  res.status(202).json({ taskId, message: `Task ${taskId} started, check status using the task ID` });
}

async function processScaffold(taskId: string, lessonObjectives: any, lessonStandards: any, scaffoldType: string) {
  try {
    let resData: ScaffoldData = {};
    switch (scaffoldType) {
      case "backgroundKnowledge":
        resData = await backgroundKnowledge(lessonObjectives, lessonStandards);
        break;
      case "mathLanguage":
        resData = await mathLanguage(lessonObjectives, lessonStandards);
        break;
      case "problemPairs":
        resData = await problemPairs(lessonObjectives, lessonStandards);
        break;
      case "exitTicket":
        resData = await exitTicket(lessonObjectives, lessonStandards);
        break;
    }

    // Update task status to completed with data
    setTaskStatus(taskId, { status: 'Completed', data: resData });
  } catch (error) {
    console.error("Scaffold generation error:", error);
    setTaskStatus(taskId, { status: 'Failed', data: { error: `Failed to generate scaffold due to internal error: ${error}` } });
  }
}

// Load prompts from yaml file from src/prompts/pdfPrompts.yaml
const yamlPath = path.join(
  process.cwd(),
  "src",
  "prompts",
  "pdfPrompts.yaml",
);
const prompts = loadYamlFile(yamlPath);

interface TemplateValues {
  [key: string]: string;
}

function fillTemplate(template: string, values: TemplateValues): string {
  // Regex adjusted to match ${text} pattern
  return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key] || "");
}

async function backgroundKnowledge(lessonObjectives: string, lessonStandards: string): Promise<ScaffoldData> {
  //Prompt 1
  let template: TemplateValues = {
    lessonObjectives: lessonObjectives,
  };
  const systemPrompt = prompts.backgroundKnowledge.system;
  const userPrompt = fillTemplate(
    prompts.backgroundKnowledge.user,
    template,
  );

  const warmupTask = await callOpenAI(systemPrompt, userPrompt, undefined);
  if (!warmupTask) {
    throw new Error(`Failed to generate backgroundKnowledge activity due to an OpenAI Error.`);
  }

  return {
    activity: warmupTask,
    title: "Background Knowledge Warmup",
    summary:
      "This task provides five questions that review and activate relevant knowledge and skills for the lesson.", // summary
    tags: "Activate Background Knowledge,Addressing Misconceptions",
  };
}

async function mathLanguage(lessonObjectives: string,  lessonStandards: string): Promise<ScaffoldData> {
  let template: TemplateValues = {
    lessonObjectives: lessonObjectives,
  };
  const systemPrompt = prompts.mathLanguage.system;
  const userPrompt = fillTemplate(prompts.mathLanguage.user, template);

  const mathLanguageResponse = await callOpenAI(
    systemPrompt,
    userPrompt,
  );
  if (!mathLanguageResponse) {
    throw new Error(`Failed to generate mathLanguage activity due to an OpenAI Error.`);
  }

  return {
    activity: mathLanguageResponse,
    title: "Relevant Vocab & Sentence Stems",
    summary:
      "This resource contains a set of key words and sentence stems specific to this particular lesson.", // summary
    tags: "Building Math Language",
  };
}

async function problemPairs(lessonObjectives: string, lessonStandards: string): Promise<ScaffoldData> {
  let template: TemplateValues = {
    lessonObjectives: lessonObjectives,
    lessonStandards: lessonStandards,
  };
  const systemPrompt = fillTemplate(prompts.problemPairs.system, template);

  const problemPairsResponse = await callOpenAI(systemPrompt);
  if (!problemPairsResponse) {
    throw new Error(`Failed to generate problemPairs activity due to an OpenAI Error.`);
  }

  return {
    activity: problemPairsResponse,
    title: "Problem Pairs",
    summary:
      "This resource contains sets of two problems that are similar in structure but differ in content.", // summary
    tags: "Problem Solving,Extra Challenge",
  };
}

async function exitTicket(lessonObjectives: string, lessonStandards: string): Promise<ScaffoldData> {
  let template: TemplateValues = {
    lessonObjectives: lessonObjectives,
    lessonStandards: lessonStandards,
  };
  const systemPrompt = fillTemplate(prompts.exitTicket.system, template);

  const exitTicketResponse = await callOpenAI(systemPrompt);
  if (!exitTicketResponse) {
    throw new Error(`Failed to generate exitTicket activity due to an OpenAI Error.`);
  }

  return {
    activity: exitTicketResponse,
    title: "Exit Ticket",
    summary:
      "A short task that tests whether the students have understood the learning objectives.", // summary
    tags: "Assessment,Formative Assessment",
  };
}