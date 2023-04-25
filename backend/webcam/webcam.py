import queue
import threading

import cv2

import os


class Webcam:
    def __init__(self):
        self.que = queue.Queue()

        self.start_y = 100
        self.end_y = 220
        self.start_x = 420
        self.end_x = 540
        self.camera_id = 0

        if "START_Y" in os.environ:
            self.start_y = int(os.environ["START_Y"])
        if "END_Y" in os.environ:
            self.end_y = int(os.environ["END_Y"])
        if "START_X" in os.environ:
            self.start_x = int(os.environ["START_X"])
        if "END_X" in os.environ:
            self.end_x = int(os.environ["END_X"])
        if "CAMERA_ID" in os.environ:
            self.camera_id = int(os.environ["CAMERA_ID"])

        self.cap = cv2.VideoCapture(self.camera_id)
        t = threading.Thread(target=self._reader)
        t.daemon = True
        t.start()

    def _reader(self):
        while True:
            ret, frame = self.cap.read()
            if not ret:
                break
            if not self.que.empty():
                try:
                    self.que.get_nowait()
                except queue.Empty:
                    pass
            self.que.put(frame)

    def get_image(self):
        return self.que.get()[self.start_y:self.end_y, self.start_x:self.end_x]
