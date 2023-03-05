import os

import cv2
import numpy as np
import torch

from traffic_sign_ai.config.config import train_dir, test_dir
from traffic_sign_ai.smooth_grad import smooth_grad, get_heatmap_from_grads


def generate_heatmap(model_list, original_image, target_label, percentile: float):
    heatmaps = []

    for model in model_list:
        network = model.model.net
        network.eval()
        image = original_image

        # normalize and transform image
        if np.max(image) > 1:
            image = image.astype(np.float32) / 255
        if image.shape[1] != model.image_size:
            image = cv2.resize(image, (model.image_size, model.image_size),
                               interpolation=cv2.INTER_LANCZOS4)
        image = torch.Tensor(image)
        image = image.transpose(2, 1).transpose(1, 0).unsqueeze(0)

        # generate grads
        image = image.to(model.model.device)
        grads = smooth_grad(network, image, target_label, sample_size=16, percent_noise=10)
        heatmap = get_heatmap_from_grads(grads)
        heatmaps.append(heatmap)

    mean_heatmap = None
    for heatmap in heatmaps:
        if mean_heatmap is None:
            mean_heatmap = heatmap
        else:
            mean_heatmap += heatmap

    # normalize heatmap values
    mean_heatmap = mean_heatmap / np.max(mean_heatmap)
    # filter values within given percentile
    mean_heatmap_sorted = np.sort(np.reshape(mean_heatmap, (-1)))
    index_p = int(percentile * mean_heatmap_sorted.shape[0])
    threshold = mean_heatmap_sorted[index_p]
    heatmap_threshold = mean_heatmap > threshold
    # generate green heatmap
    colored_heatmap = np.zeros(heatmap_threshold.shape)
    # expand green heatmap to shape (x,x,3)
    colored_heatmap = np.repeat(np.expand_dims(
        colored_heatmap, axis=-1), 3, axis=-1)
    # coloring heatmap in green
    colored_heatmap[:, :, 1] = heatmap_threshold

    # resize to original_image shape
    colored_heatmap = cv2.resize(colored_heatmap, dsize=(original_image.shape[0], original_image.shape[1]),
                                 interpolation=cv2.INTER_NEAREST)

    index = np.where(colored_heatmap == 1)
    image_with_heatmap = np.copy(original_image)
    image_with_heatmap[index] = 255

    return image_with_heatmap

def test_attack(image, model, source_label, target_label) -> bool:
    model.creating_data(
        train_dir=train_dir, test_dir=test_dir, batch_size=1)

    network = model.model.net
    network.eval()

    if image.shape[1] != model.image_size:
        image = cv2.resize(image, (model.image_size, model.image_size),
                           interpolation=cv2.INTER_LANCZOS4)

    image = np.array(image).astype('float32')
    if np.max(image) > 1:
        image = image / 255.

    image = torch.Tensor(image)
    image = image.transpose(2, 1).transpose(1, 0).unsqueeze(0)
    output_original = network(image.to(model.model.device))
    predicted_label = np.argmax(output_original.detach().cpu().numpy())

    if source_label != target_label:
        correct_result = predicted_label == target_label
    else:
        correct_result = predicted_label != target_label

    return correct_result
