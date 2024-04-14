import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

import callOpenAI from "~/utils/callOpenAI";
import loadYamlFile from "~/utils/loadYamlFile";

type ResponseData = {
  activity?: string;
  title?: string;
  summary?: string;
  tags?: string;
  error?: string;
};

interface TemplateValues {
  [key: string]: string;
}

function fillTemplate(template: string, values: TemplateValues): string {
  // Regex adjusted to match ${text} pattern
  return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key] || "");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "POST") {
    const { lessonObjectives, lessonStandards, scaffoldType } = req.body;

    if (!lessonObjectives) {
      res.status(400).json({ error: "Please provide both lesson objectives." });
      return;
    }
    // Load prompts from yaml file from src/prompts/pdfPrompts.yaml
    const yamlPath = path.join(
      process.cwd(),
      "src",
      "prompts",
      "pdfPrompts.yaml",
    );
    const prompts = loadYamlFile(yamlPath);

    try {
      let resData: ResponseData = {};

      if (scaffoldType === "backgroundKnowledge") {
        //Prompt 1
        let template: TemplateValues = {
          lessonObjectives: lessonObjectives,
        };
        const systemPrompt = prompts.backgroundKnowledge.promptOne.system;
        const userPrompt = fillTemplate(
          prompts.backgroundKnowledge.promptOne.user,
          template,
        );

        const prerequisiteTopics = await callOpenAI(
          systemPrompt,
          userPrompt,
          512,
        );
        if (!prerequisiteTopics) {
          res.status(500).json({
            error: `Failed to generate ${scaffoldType} activity due to an OpenAI Error.`,
          });
          return;
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
          res.status(500).json({
            error: `Failed to generate ${scaffoldType} activity due to an OpenAI Error.`,
          });
          return;
        }

        resData = {
          activity: warmupTask,
          title: "Background Knowledge Quiz",
          summary:
            "This task provides five questions that review and activate relevant knowledge and skills for the lesson.", // summary
          tags: "Activate Background Knowledge,Addressing Misconceptions",
        };
      } else if (scaffoldType === "mathLanguage") {
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
          res.status(500).json({
            error: `Failed to generate ${scaffoldType} activity due to an OpenAI Error.`,
          });
          return;
        }

        resData = {
          activity: mathLanguageResponse,
          title: "Relevant Vocab & Sentence Stems",
          summary:
            "This resource contains a set of key words and sentence stems specific to this particular lesson.", // summary
          tags: "Building Math Language",
        };
      
      } else if (scaffoldType === "problemPairs") {
        let template: TemplateValues = {
          lessonObjectives: lessonObjectives,
          lessonStandards: lessonStandards,
        };
        const systemPrompt = fillTemplate(prompts.problemPairs.system, template);

        const problemPairsResponse = await callOpenAI(systemPrompt);
        if (!problemPairsResponse) {
          res.status(500).json({
            error: `Failed to generate ${scaffoldType} activity due to an OpenAI Error.`,
          });
          return;
        }

        resData = {
          activity: problemPairsResponse,
          title: "Problem Pairs",
          summary:
            "This resource contains sets of two problems that are similar in structure but differ in content.", // summary
          tags: "Problem Solving,Extra Challenge",
        };
      
      } else if (scaffoldType === "exitTicket") {
        let template: TemplateValues = {
          lessonObjectives: lessonObjectives,
          lessonStandards: lessonStandards,
        };
        const systemPrompt = fillTemplate(prompts.exitTicket.system, template);

        const exitTicketResponse = await callOpenAI(systemPrompt);
        if (!exitTicketResponse) {
          res.status(500).json({
            error: `Failed to generate ${scaffoldType} activity due to an OpenAI Error.`,
          });
          return;
        }

        resData = {
          activity: exitTicketResponse,
          title: "Exit Ticket",
          summary:
            "A short task that tests whether the students have understood the learning objectives.", // summary
          tags: "Assessment,Formative Assessment",
        };
        
      } else {
        res.status(400).json({ error: "Invalid scaffoldType provided." });
      }

      res.status(200).json(resData);
    } catch (error) {
      console.error("Scaffold generation error:", error);
      res.status(500).json({
        error: "Failed to generate activity due to an internal error: " + error,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
