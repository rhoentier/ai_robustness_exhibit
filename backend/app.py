import threading
import time
import os

import cv2
from flask import Flask, send_from_directory
from flask_socketio import emit, SocketIO
from werkzeug.middleware.proxy_fix import ProxyFix

from Classifier.hil_framework import HilFramework
from webcam.webcam import Webcam

app = Flask(__name__, static_folder="build")
app.wsgi_app = ProxyFix(app.wsgi_app, x_prefix=1)
socketio = SocketIO(app, cors_allowed_origins="*")
rand_list = []

image = None
classification = None


def start_background_thread():
    global webcam, hil
    hil = HilFramework()
    webcam = Webcam()

    t_image = threading.Thread(target=run_image_loop)
    t_image.daemon = True
    t_image.start()

    t_classification = threading.Thread(target=run_classification_loop)
    t_classification.daemon = True
    t_classification.start()


def run_image_loop():
    while True:
        global image
        time.sleep(0.05)
        try:
            image = webcam.get_image()
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


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    app.logger.debug(path)
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@socketio.on("image")
def get_image():
    if image is not None:
        ret, jpeg = cv2.imencode(".jpg", image)
        response_image = jpeg.tobytes()
        emit("image", response_image)


@socketio.on("classification")
def get_classification():
    if classification is not None:
        emit("classification", classification.tolist())


if __name__ == "__main__":
    start_background_thread()

    socketio.run(
        app,
        port=9000,
        host="0.0.0.0",
        debug=True,
        allow_unsafe_werkzeug=True,
        use_reloader=False,
    )
