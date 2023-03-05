import json
import os


def read_json():
    config_file = open(f"{os.path.dirname(__file__)}/config.json")

    json_object = json.load(config_file)
    return json_object


def write_json(key, value):
    config_file = open(f"{os.path.dirname(__file__)}/config.json", "r")

    json_object = json.load(config_file)
    json_object[key] = value
    with open(f"{os.path.dirname(__file__)}/config.json", "w") as outfile:
        json.dump(json_object, outfile)
