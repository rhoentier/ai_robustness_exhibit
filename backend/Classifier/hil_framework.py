from enum import Enum

import cv2

from attack_generator.heatmap_generator import generate_heatmap
from traffic_sign_ai.models.model_loader import (
    load_self_trained_inception_net3,
    load_pretrained_resnext,
)
from webcam.webcam_classifier import classify


class Models(Enum):
    SELF_INCEPTION = 0
    SELF_INCEPTION_GRAY = 1
    PRE_MOBILE = 2
    PRE_INCEPTION3 = 3


class HilFramework:

    def __init__(self):
        self.classification_model = load_pretrained_resnext()
        self.heatmap_model = load_self_trained_inception_net3()

    def run_heatmap_attack(self, image, original_label):
        if image is None:
            return None
        attacked_sign = generate_heatmap(
            [self.heatmap_model], image, original_label, percentile=0.97
        )
        ret, jpeg = cv2.imencode(".jpg", attacked_sign)
        attacked_sign = jpeg.tobytes()
        return attacked_sign

    def classify_image(self, webcam_image):
        if webcam_image is None:
            return None
        result = classify(self.classification_model, webcam_image)
        return result
