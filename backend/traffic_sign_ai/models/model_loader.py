import torchvision
from torch import nn

from traffic_sign_ai.config.config import train_dir, valid_dir, test_dir
from traffic_sign_ai.models.models import InceptionNet3
from traffic_sign_ai.traffic_sign_main import TrafficSignMain
from traffic_sign_ai.ts_ai import TSAI


def set_resnext_module():
    module = torchvision.models.resnext50_32x4d(pretrained=True)
    num_features = module.fc.in_features
    module.fc = nn.Linear(num_features, 43)
    return module


def load_pretrained_resnext():
    ai = TSAI("PreTrained_ResNext", net=set_resnext_module())
    main = TrafficSignMain(model=ai, epochs=15, image_size=224)
    main.loading_ai()
    return main


def load_self_trained_inception_net3():
    ai = TSAI("SelfTrained_Model", net=InceptionNet3())
    main = TrafficSignMain(model=ai, epochs=15, image_size=32)
    main.loading_ai()
    return main
