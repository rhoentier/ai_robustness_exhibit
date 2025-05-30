import queue
import threading

import cv2

import os


class Webcam:
    def __init__(self):
        self.que = queue.Queue()

        self.start_y = 0
        self.start_x = 0
        self.image_size = 1024
        self.camera_id = 0
        self.rotation = 0

        if "START_Y" in os.environ:
            self.start_y = int(os.environ["START_Y"])
        if "START_X" in os.environ:
            self.start_x = int(os.environ["START_X"])
        if "IMAGE_SIZE" in os.environ:
            self.image_size = int(os.environ["IMAGE_SIZE"])
        if "CAMERA_ID" in os.environ:
            self.camera_id = int(os.environ["CAMERA_ID"])
        if "ROTATION" in os.environ:
            self.rotation = int(os.environ["ROTATION"])

        self.cap = cv2.VideoCapture(self.camera_id, cv2.CAP_V4L2)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 4096)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 2160)
        actual_width = self.cap.get(cv2.CAP_PROP_FRAME_WIDTH)
        actual_height = self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
        print(f"Requested: 4096x2160, Actual: {actual_width}x{actual_height}")
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
        image = self.que.get()[
            self.start_y : self.start_y + self.image_size,
            self.start_x : self.start_x + self.image_size,
        ]
        if self.rotation == 90:
            image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
        elif self.rotation == 180:
            image = cv2.rotate(image, cv2.ROTATE_180)
        elif self.rotation == 270:
            image = cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)

        return image
