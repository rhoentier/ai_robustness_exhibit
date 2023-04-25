import threading
import time

import cv2
from flask import Flask
from flask_socketio import emit, SocketIO
from werkzeug.middleware.proxy_fix import ProxyFix

from Classifier.hil_framework import HilFramework
from webcam.webcam import Webcam

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_prefix=1)
socketio = SocketIO(app, cors_allowed_origins="*")
rand_list = []

global webcam
global hil

image = None
classification = None
heatmap = None


def run_image_loop():
    while True:
        global image
        time.sleep(0.1)
        try:
            rotated_image = webcam.get_image()
            (h, w) = rotated_image.shape[:2]
            center = (w / 2, h / 2)
            M = cv2.getRotationMatrix2D(center, 180, 1.0)
            image = cv2.warpAffine(rotated_image, M, (w, h))
        finally:
            pass


def run_heatmap_loop():
    while True:
        time.sleep(0.5)
        global heatmap
        if image is not None and classification is not None:
            try:
                heatmap = hil.run_heatmap_attack(image, classification.argmax())
            except:
                pass
            finally:
                pass


def run_classification_loop():
    while True:
        global classification
        time.sleep(0.5)
        if image is not None:
            try:
                classification = hil.classify_image(image)
            finally:
                pass


@socketio.on("image")
def get_image():
    if image is not None:
        ret, jpeg = cv2.imencode('.jpg', image)
        response_image = jpeg.tobytes()
        emit("image", response_image)


@socketio.on("heatmap")
def get_heatmap():
    if heatmap is not None:
        emit("heatmap", heatmap)


@socketio.on('classification')
def get_classification():
    if classification is not None:
        emit("classification", classification.tolist())


if __name__ == "__main__":
    hil = HilFramework()
    webcam = Webcam()

    t_image = threading.Thread(target=run_image_loop)
    t_image.start()

    t_classification = threading.Thread(target=run_classification_loop)
    t_classification.start()

    t_heatmap = threading.Thread(target=run_heatmap_loop)
    t_heatmap.start()

    socketio.run(app, port=9000, host="0.0.0.0")
