import queue
import threading

import cv2

import os


class Webcam:
    def __init__(self):
        self.q = queue.Queue()

        self.start_y = 0
        self.end_y = 200
        self.start_x = 0
        self.end_x = 200
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
            if not self.q.empty():
                try:
                    self.q.get_nowait()
                except queue.Empty:
                    pass
            self.q.put(frame)

    def get_image(self):
        return self.q.get()[self.start_y:self.end_y, self.start_x:self.end_x]
