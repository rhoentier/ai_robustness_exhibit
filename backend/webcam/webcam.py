import cv2

import os

from config.parseConfig import read_json


class Webcam:
    def __init__(self):
        self.config = read_json()

        self.start_y = 0
        self.end_y = 200
        self.start_x = 0
        self.end_x = 200

        if "START_Y" in os.environ:
            self.start_y = os.environ["START_Y"]
        if "END_Y" in os.environ:
            self.end_y = os.environ["END_Y"]
        if "START_X" in os.environ:
            self.start_x = os.environ["START_X"]
        if "END_X" in os.environ:
            self.end_x = os.environ["END_X"]

    def get_image(self):
        cap = cv2.VideoCapture(0)
        if not (cap.isOpened()):
            return None
        ret, frame = cap.read()
        if ret is False:
            return None
        cap.release()
        return frame[self.start_y:self.end_y, self.start_x:self.end_x]
