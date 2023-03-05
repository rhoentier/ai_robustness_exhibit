import random
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
socketio = SocketIO(app, logger=True, engineio_logger=True, cors_allowed_origins="*")
rand_list = []

global webcam
global hil
global classification
global image
global heatmap


def run_image_loop():
    while True:
        global image
        time.sleep(0.1)
        image = webcam.get_image()


def run_heatmap_loop():
    while True:
        time.sleep(0.5)
        global heatmap
        if image is not None and classification is not None:
            heatmap = hil.run_heatmap_attack(image, classification[0])


def run_classification_loop():
    while True:
        global heatmap
        time.sleep(0.5)
        if image is not None:
            heatmap = hil.classify_image(image)


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
        emit(classification)


@socketio.on('message')
def get():
    emit("message", rand_list)


def run_rand_loop():
    while True:
        global rand_list
        rand_list = []
        for i in range(0, 5):
            n = random.randint(1, 30)
            rand_list.append(n)
        time.sleep(0.1)


if __name__ == "__main__":
    # hil = HilFramework()
    # webcam = Webcam()
    # image = webcam.get_image()
    # classification = hil.classify_image(image)

    # t_image = threading.Thread(target=run_image_loop)
    # t_image.start()

    # t_classification = threading.Thread(target=run_classification_loop)
    # t_classification.start()

    # t_heatmap = threading.Thread(target=run_heatmap_loop)
    # t_heatmap.start()

    t_rand = threading.Thread(target=run_rand_loop)
    t_rand.start()

    socketio.run(app, debug=True, port=9000, host="0.0.0.0")
