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
        const textRgb: RGB | null = content.textColor
          ? hexToRgb(content.textColor)
          : null;
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
              ...(textRgb && {
                foregroundColor: { opaqueColor: { rgbColor: textRgb } },
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
          insertImage: {
            url: content.url,
            insertionIndex: 0,
          },
        });
        break;

      case "shape":
        const shapeRgb: RGB | null  = content.backgroundColor
          ? hexToRgb(content.backgroundColor)
          : null;
        const outlineRgb: RGB | null = content.outlineColor
          ? hexToRgb(content.outlineColor)
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
              ...(shapeRgb && {
                shapeBackgroundFill: {
                  solidFill: {
                    color: {
                      rgbColor: shapeRgb,
                    },
                    alpha: 1,
                  },
                },
              }),
              ...(outlineRgb && {
                outline: {
                  outlineFill: {
                    solidFill: {
                      color: {
                        rgbColor: outlineRgb,
                      },
                      alpha: 1,
                    },
                  },
                  ...(content.outlineWeight && {
                    weight: { magnitude: content.outlineWeight, unit: "PT" },
                  })
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
