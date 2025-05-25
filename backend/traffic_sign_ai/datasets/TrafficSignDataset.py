from typing import Any, Callable, Optional

from torchvision.datasets import ImageFolder
from torchvision.datasets.folder import default_loader


class DatasetFolderClassFilter(ImageFolder):
    def __init__(
            self,
            root: str,
            transform: Optional[Callable] = None,
            target_transform: Optional[Callable] = None,
            loader: Callable[[str], Any] = default_loader,
            is_valid_file: Optional[Callable[[str], bool]] = None,
            target_class: int = 0
    ):
        super(DatasetFolderClassFilter, self).__init__(root, transform, target_transform,
                                                       loader,
                                                       is_valid_file)

        self.class_index = None
        self.all_samples = self.samples
        self.set_class(class_index=target_class)

    def set_class(self, class_index=0):
        self.class_index = class_index
        new_samples = []
        for path, target in self.samples:
            if target == class_index:
                new_samples.append([path, target])
        self.samples = new_samples
