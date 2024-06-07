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

function getColor(color: any) {
  if (color && color.startsWith("#")) {
    return { rgbColor: hexToRgb(color) };
  } else if (color) {
    return { themeColor: color };
  }
  return null;
}

const validShapes = [
  "RECTANGLE",
  "ROUND_RECTANGLE",
  "ELLIPSE",
  "CLOUD",
  "DIAMOND",
];

export function slidesFormatter(contentList: Content[]): any {
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
        const textColor = getColor(content.textColor);
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
                scaleX: 1,
                scaleY: 1,
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
        requests.push({
          updateTextStyle: {
            objectId: textboxId,
            fields: "foregroundColor,bold,fontSize,fontFamily",
            style: {
              ...(textColor && {
                foregroundColor: { opaqueColor: textColor },
              }),
              ...(content.fontSize && {
                fontSize: { magnitude: content.fontSize, unit: "PT" },
              }),
              ...(content.fontFamily && { fontFamily: content.fontFamily }),
              ...(content.bold && { bold: content.bold }),
            },
          },
        });
        break;

      case "image":
        requests.push({
          createImage: {
            url: content.url,
            elementProperties: {
              pageObjectId: slideId,
              size: {
                width: { magnitude: content.width, unit: "PT" },
                height: { magnitude: content.height, unit: "PT" },
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: content.translateX,
                translateY: content.translateY,
                unit: "PT",
              },
            },
          },
        });
        break;

      case "shape":
        if (!validShapes.includes(content.shapeType)) {
          break;
        }
        const backgroundColor = getColor(content.backgroundColor);
        const outlineColor = getColor(content.outlineColor);

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
                scaleX: 1,
                scaleY: 1,
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
            fields: "shapeBackgroundFill,outline",
            shapeProperties: {
              ...(backgroundColor && {
                shapeBackgroundFill: {
                  solidFill: {
                    color: backgroundColor,
                    alpha: 1,
                  },
                },
              }),
              ...(outlineColor && {
                outline: {
                  outlineFill: {
                    solidFill: {
                      color: outlineColor,
                      alpha: 1,
                    },
                  },
                  ...(content.outlineWeight && {
                    weight: { magnitude: content.outlineWeight, unit: "PT" },
                  }),
                },
              }),
            },
          },
        });
        break;
    }
  });

  return requests;
}
