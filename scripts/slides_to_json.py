import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from dotenv import load_dotenv
import os
from tqdm.rich import tqdm
import json
import webbrowser
from pprint import pprint

from color_utils import hex_to_rgb, rgb_to_hex

PRESENTATION_URL = "https://docs.google.com/presentation/d/1go_IsaDCznJK25m49VsacXAD60gTDkTxVNrU-j6V2ic/edit#slide=id.pag9sTMc86"
SCOPES = ["https://www.googleapis.com/auth/presentations.readonly"]

chrome_path = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s"
webbrowser.register("chrome", None, webbrowser.BackgroundBrowser(chrome_path))


def get_credentials():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("googleauth/token.json"):
        creds = Credentials.from_authorized_user_file("googleauth/token.json",
                                                      SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "googleauth/credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open("googleauth/token.json", "w") as token:
                token.write(creds.to_json())

    return creds


def get_presentation_id(url):
    """
    url: https://docs.google.com/presentation/d/1swn9Uyf2aBHNrTEDPiHsfSYffIQAhxPDYjC2hlyCdWs/edit
    return: 1swn9Uyf2aBHNrTEDPiHsfSYffIQAhxPDYjC2hlyCdWs
    """

    return url.split("/")[5]


def emu_to_pt(emu):
    return round(emu / 12700, 2)

def get_color(color):
    if 'themeColor' in color:
        return color['themeColor']
    else:
        rgb_color = color['rgbColor']
        return rgb_to_hex((rgb_color['red'], rgb_color['green'], rgb_color['blue']))


def main():
    creds = get_credentials()
    service = build("slides", "v1", credentials=creds)

    presentation_id = get_presentation_id(PRESENTATION_URL)

    presentation = service.presentations().get(
        presentationId=presentation_id).execute()
    slides = presentation.get('slides')

    slide = slides[1]

    elements = []

    for elem in slide.get('pageElements'):
        elem_dict = dict()
        if elem.get('shape'):
            if elem.get('shape').get('shapeType') == 'TEXT_BOX':
                elem_dict['type'] = 'text'
                elem_dict['text'] = elem.get('shape').get('text').get(
                    'textElements')[1].get('textRun').get('content')
                elem_dict['width'] = emu_to_pt(
                    elem.get('size').get('width').get('magnitude')) * elem.get(
                        'transform').get('scaleX')
                elem_dict['height'] = emu_to_pt(
                    elem.get('size').get('height').get(
                        'magnitude')) * elem.get('transform').get('scaleY')
                elem_dict['translateX'] = emu_to_pt(
                    elem.get('transform').get('translateX'))
                elem_dict['translateY'] = emu_to_pt(
                    elem.get('transform').get('translateY'))

                style = elem.get('shape').get('text').get(
                    'textElements')[1].get('textRun').get('style')
                elem_dict['textColor'] = get_color(style.get('foregroundColor').get('opaqueColor'))

                elem_dict['bold'] = style.get('bold')
                elem_dict['fontFamily'] = style.get('fontFamily')
                elem_dict['fontSize'] = style.get('fontSize').get('magnitude')

            else:
                elem_dict['type'] = 'shape'
                elem_dict['shapeType'] = elem.get('shape').get('shapeType')
                elem_dict['width'] = emu_to_pt(
                    elem.get('size').get('width').get('magnitude')) * elem.get(
                        'transform').get('scaleX')
                elem_dict['height'] = emu_to_pt(
                    elem.get('size').get('height').get(
                        'magnitude')) * elem.get('transform').get('scaleY')
                elem_dict['translateX'] = emu_to_pt(
                    elem.get('transform').get('translateX'))
                elem_dict['translateY'] = emu_to_pt(
                    elem.get('transform').get('translateY'))
                
                shapeBackgroundFill = elem.get('shape').get('shapeProperties').get('shapeBackgroundFill')

                elem_dict['backgroundColor'] = get_color(shapeBackgroundFill.get('solidFill').get('color'))

                outline = elem.get('shape').get('shapeProperties').get('outline')
                elem_dict['outlineColor'] = get_color(outline.get('outlineFill').get('solidFill').get('color'))
                elem_dict['outlineWeight'] = emu_to_pt(outline.get('weight').get('magnitude'))

        elements.append(elem_dict)

    json.dump(elements, open('elements.json', 'w'))


#     type: "shape",
#     shapeType: "RECTANGLE",
#     width: 500,
#     height: 2,
#     translateX: 50,
#     translateY: 140,
#     backgroundColor: "#eb9b34",
#     outlineColor: "#03a9fc",
#     outlineWeight: 5,

if __name__ == "__main__":
    main()
