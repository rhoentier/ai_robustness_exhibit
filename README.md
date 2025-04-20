# AI Robustness Exhibit

This repository contains the software for an exhibit that demonstrates the importance of robust AI model training. The exhibit is part of an AI exhibition and aims to illustrate how seemingly small changes in input data can lead to significant differences in AI model outputs.

The project uses image classification as an example to show how small perturbations in images can lead to misclassifications by AI models that are not robustly trained.

## Current and past exhibitions

This project is or was in two exhibitions:

- https://www.deutsches-museum.de/bonn/ausstellung/mission-ki
- https://www.autostadt.de/

Feel free to use this code within another exhibition. Please open an issue to link your exhibition to this list.

## Getting Started

### Prerequisites

1. Install Docker and follow Docker post installation steps
2. Install cuda-toolkit (if you use nivida gpu)
3. Install nvidia-container-toolkit (if you use nivida gpu)
4. Install git and git-lfs
5. Clone repository and pull models via `git lfs pull`

### Run Software

You can start the software via docker compose.

```
docker compose -f docker-compose.yml up  -d
```

You can configure the camera settings in the docker-compose files.

Open `localhost:9000` in your web browser.

### Develop Software

The software is an easy flask backend server and and react frontend.

## Acknowledgements

The initial idea and parts of the software are developed as part of a bachelor thesis. The thesis is supported by the German Federal Office for Information Security: https://www.bsi.bund.de/DE/Service-Navi/Presse/Alle-Meldungen-News/Meldungen/KI-Sicherheit-im-Auto_230515.html

The paper and the source code of the thesis are open source: https://github.com/rhoentier/bachelor_thesis

The [German Museum Bonn](https://www.deutsches-museum.de/bonn) helped building the first exhibit and [imaginary](https://www.imaginary.org/de) helped building the second exhibit and this open source version.
