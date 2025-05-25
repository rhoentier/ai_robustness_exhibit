import warnings

from traffic_sign_ai.ts_ai import TSAI

warnings.simplefilter(action="ignore", category=UserWarning)

class TrafficSignMain:
    def __init__(self, model: TSAI, epochs, image_size=299, num_classes=43) -> None:
        super().__init__()
        self.model = model
        self.epochs = epochs
        self.image_size = image_size
        self.input_shape = (3, image_size, image_size)
        self.num_classes = num_classes

    # Function for using the AI.
    def loading_ai(self):
        self.model.load()
