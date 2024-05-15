import { idGenerator } from "@/utils/idGenerator";
import { pages } from "next/dist/build/templates/app-page";
import { RGB, hexToRgb } from "~/utils/colorUtils";

export interface Content {
  type: string;
  [key: string]: any;
}

interface Return {
  requests: any;
  slideId: string;
}

export function slidesFormatter(contentList: Content[]): Return {
  const slideId = idGenerator();
  const requests: any = [
    {
      createSlide: {
        objectId: slideId,
      },
    },
  ];
  contentList.forEach((content) => {
    switch (content.type) {
      case "text":
        const textboxId = idGenerator();
        requests.push({
          createShape: {
            objectId: textboxId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              pageObjectId: slideId,
              size: {
                width: { magnitude: content.width, unit: "PT" },
                height: { magnitude: content.height, unit: "PT" },
              },
              transform: {
                scaleX: content.scaleX,
                scaleY: content.scaleY,
                translateX: content.translateX,
                translateY: content.translateY,
                unit: "PT",
              },
            },
          },
        });
        requests.push({
          insertText: {
            objectId: textboxId,
            insertionIndex: 0,
            text: content.text,
          },
        });
        break;

      case "image":
        requests.push({
          insertImage: {
            url: content.url,
            insertionIndex: 0,
          },
        });
        break;

      case "shape":
        const rgb: RGB | null = content.backgroundColor
          ? hexToRgb(content.backgroundColor)
          : null;

        const shapeId = idGenerator();
        requests.push({
          createShape: {
            objectId: shapeId,
            shapeType: content.shapeType,
            elementProperties: {
              pageObjectId: slideId,
              size: {
                width: { magnitude: content.width, unit: "PT" },
                height: { magnitude: content.height, unit: "PT" },
              },
              transform: {
                scaleX: content.scaleX,
                scaleY: content.scaleY,
                translateX: content.translateX,
                translateY: content.translateY,
                unit: "PT",
              },
            },
          },
        });
        requests.push({
          updateShapeProperties: {
            objectId: shapeId,
            fields: "shapeBackgroundFill",
            shapeProperties: {
              ...(rgb && {
                shapeBackgroundFill: {
                  solidFill: {
                    color: {
                      rgbColor: { red: rgb.r, green: rgb.g, blue: rgb.b },
                    },
                    alpha: 1,
                  },
                },
              }),
            },
          },
        });
        break;
    }
  });

  return { requests, slideId };
}
