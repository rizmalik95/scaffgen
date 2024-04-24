import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

import callOpenAI from "~/utils/callOpenAI";
import loadYamlFile from "~/utils/loadYamlFile";
import sendWebhookResponse from "~/utils/sendWebhookResponse";

type ResponseData = {
  activity?: string;
  title?: string;
  summary?: string;
  tags?: string;
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

  const { lessonObjectives, lessonStandards, scaffoldType, webhookUrl } = req.body;

  if (!lessonObjectives || !webhookUrl) {
    res.status(400).json({ error: "Please provide both lesson objectives and webhook URL" });
    return;
  }
  // Respond immediately to acknowledge receipt
  res.status(202).json({ message: 'Request received. The result will be sent to the specified webhook URL.' });


  try {
    let resData: ResponseData = {};

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
      default:
        sendWebhookResponse(webhookUrl, { error: "Invalid scaffoldType provided." });
        break;
    }

    sendWebhookResponse(webhookUrl, resData);
  } catch (error) {
    console.error("Scaffold generation error:", error);
    sendWebhookResponse(webhookUrl, {
      error: "Failed to generate activity due to an internal error: " + error,
    });
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

async function backgroundKnowledge(lessonObjectives: string, lessonStandards: string): Promise<ResponseData> {
  //Prompt 1
  let template: TemplateValues = {
    lessonObjectives: lessonObjectives,
  };
  const systemPrompt = prompts.backgroundKnowledge.promptOne.system;
  const userPrompt = fillTemplate(
    prompts.backgroundKnowledge.promptOne.user,
    template,
  );

  const prerequisiteTopics = await callOpenAI(systemPrompt, userPrompt, 512);
  if (!prerequisiteTopics) {
    throw new Error(`Failed to generate backgroundKnowledge activity due to an OpenAI Error.`);
  }

  //Prompt 2
  template = {
    lessonObjectives: lessonObjectives,
    prerequisiteTopics: prerequisiteTopics,
  };
  const promptTwo = fillTemplate(
    prompts.backgroundKnowledge.promptTwo.system,
    template,
  );

  const warmupTask = await callOpenAI(promptTwo, undefined, 512);
  if (!warmupTask) {
    throw new Error(`Failed to generate backgroundKnowledge activity due to an OpenAI Error.`);
  }

  return {
    activity: warmupTask,
    title: "Background Knowledge Quiz",
    summary:
      "This task provides five questions that review and activate relevant knowledge and skills for the lesson.", // summary
    tags: "Activate Background Knowledge,Addressing Misconceptions",
  };
}

async function mathLanguage(lessonObjectives: string,  lessonStandards: string): Promise<ResponseData> {
  let template: TemplateValues = {
    lessonObjectives: lessonObjectives,
  };
  const systemPrompt = prompts.mathLanguage.system;
  const userPrompt = fillTemplate(prompts.mathLanguage.user, template);

  const mathLanguageResponse = await callOpenAI(
    systemPrompt,
    userPrompt,
    1024,
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

async function problemPairs(lessonObjectives: string, lessonStandards: string): Promise<ResponseData> {
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

async function exitTicket(lessonObjectives: string, lessonStandards: string): Promise<ResponseData> {
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