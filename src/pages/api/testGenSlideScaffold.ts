import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import loadYamlFile from "~/utils/loadYamlFile";
import callOpenAI from "~/utils/callOpenAI";

import { ScaffoldProps } from "~/utils/interfaces";

const content = `Imagine you are making a fruit salad. The recipe calls for 2 apples, 3 bananas, and 1 orange.

1. If you wanted to make a double batch of the fruit salad, how many apples, bananas, and oranges would you need?
2. If you wanted to make a triple batch of the fruit salad, how many apples, bananas, and oranges would you need?
3. Explain why doubling or tripling the recipe keeps the taste the same.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
    return;
  }

  const newScaffold: ScaffoldProps = await makeNewScaffold();
  res.status(200).json({ newScaffold });
}

function fillTemplate(template: string, values: TemplateValues): string {
  // Regex adjusted to match ${text} pattern
  return template.replace(/\$\{(\w+)\}/g, (_, key) => values[key] || "");
}

const yamlPath = path.join(process.cwd(), "src", "prompts", "pdfPrompts.yaml");
const prompts = loadYamlFile(yamlPath);

interface TemplateValues {
  [key: string]: string;
}

async function slidesFormatPrompt(template: TemplateValues): Promise<string> {
  const slidesFormatSystemPrompt = prompts.slidesFormat.system;
  const slidesFormatUserPrompt = fillTemplate(
    prompts.slidesFormat.user,
    template,
  );

  const formatted = await callOpenAI(
    slidesFormatSystemPrompt,
    slidesFormatUserPrompt,
  );
  if (!formatted) {
    throw new Error(
      "Failed to format AI scaffold activity to google slides format",
    );
  }
  return formatted;
}

const makeNewScaffold = async (): Promise<ScaffoldProps> => {
  const template: TemplateValues = {
    content: content,
  };

  const formattedText = await slidesFormatPrompt(template);

  const newScaffold = {
    HumanURL_AIContent: formattedText,
    image: "",
    title: "",
    summary: "",
    standard: "",
    tags: "",
    isAI: true,
  };

  return newScaffold;
};
