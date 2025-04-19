import numpy as np
import torch
from torch.autograd import Variable


def smooth_grad(net, tensor_input, label, sample_size=10, percent_noise=10):
    final_grad = torch.zeros((1, 3, tensor_input.shape[-1], tensor_input.shape[-1])).to('mps')

    for i in range(sample_size):
        temp_input = tensor_input

        noise = torch.from_numpy(
            np.random.normal(loc=0, scale=(
                    percent_noise * (tensor_input.cpu().detach().max() - tensor_input.cpu().detach().min()) / 100),
                             size=temp_input.shape)).type(torch.float32).to("mps")

        temp_input = (temp_input + noise)
        temp_input = Variable(temp_input, requires_grad=True)

        output = net.forward(temp_input)
        output[0][label].backward()
        final_grad += temp_input.grad.data

    grads = final_grad / sample_size
    grads = grads.clamp(min=0)
    grads.squeeze_()
    grads.transpose_(0, 1)
    grads.transpose_(1, 2)
    grads = np.amax(grads.cpu().numpy(), axis=2)

    return grads


def get_heatmap_from_grads(grads):
    image = grads
    if type(image) == torch.Tensor:
        # Tensor objects can't be handled by plt.
        image = image.permute(1, 2, 0).cpu().detach()
    return image
