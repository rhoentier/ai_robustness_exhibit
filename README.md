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
2. Install cuda-toolkit (if you use NVIDIA GPU)
3. Install nvidia-container-toolkit (if you use NVIDIA GPU)
4. Install git and git-lfs
5. Clone repository and pull models via `git lfs pull`

### Run Software

You can start the software via docker compose.

```
docker compose -f docker-compose.yml up -d
```

You can configure the camera settings in the docker-compose.yml file. The following environment variables can be adjusted:

- `START_Y`: Y-coordinate starting point for camera crop (default: 0)
- `START_X`: X-coordinate starting point for camera crop (default: 0)
- `ROTATION`: Camera image rotation in degrees (0, 90, 180, or 270)
- `IMAGE_SIZE`: Size of the captured image (default: 1080)
- `CAMERA_ID`: Camera device ID to use (default: 0)

Open `localhost:9000` in your web browser to view the application.

## Project Architecture

### Overview

The project consists of two main components:

1. **Backend**: A Flask application that handles webcam capture, image processing, and AI model inference
2. **Frontend**: A React application that displays the webcam feed and classification results

### Backend Components

- **Flask Server** (`backend/app.py`): Main entry point that sets up the Flask application and WebSocket communication
- **Webcam Module** (`backend/webcam/`): Handles camera capture and image processing
- **Classifier Module** (`backend/Classifier/`): Provides the framework for classification
- **Traffic Sign AI Module** (`backend/traffic_sign_ai/`): Contains the AI models and classification logic

### Frontend Components

- **React Application** (`frontend/src/`): Single-page application built with React and TypeScript
- **Home Page** (`frontend/src/pages/Home.tsx`): Main UI component that displays the webcam feed and classification results

### Communication Flow

1. The backend captures images from the webcam
2. Images are processed and classified by the AI models
3. Results are sent to the frontend via WebSocket
4. The frontend displays the results in real-time

## Development Guide

The software consists of a Flask backend server and a React frontend.

## Setting Up the Exhibit Environment

For a production exhibit environment, you should set up the system to automatically start the application on boot and display it in kiosk mode. This section explains how to configure this.

### Using the Service Files

The `services` folder contains systemd service files that can be used to automatically start the application:

1. `docker_server.service` - Starts the Docker containers for the application
2. `chromium.service` - Starts Chromium in kiosk mode to display the application

To use these service files:

1. Copy the service files to `/etc/systemd/system/`
2. Replace `[USER]` with your username in both files
3. Replace `[DIRECTORY]` with the full path to the project directory
4. Enable the services to start on boot:
   ```
   sudo systemctl reload-daemon
   sudo systemctl enable docker_server.service
   sudo systemctl enable chromium.service
   ```
5. Start the services:
   ```
   sudo systemctl start docker_server.service
   sudo systemctl start chromium.service
   ```

### Recommended Window Manager

For exhibit environments, it's recommended to use a minimal window manager like Openbox instead of a full desktop environment. This provides several advantages:

- Minimal resource usage
- Fewer background processes that could interfere with the exhibit
- Better control over the display and user interaction
- Prevents unwanted UI elements from appearing

Configure Openbox to start automatically on boot and set up autostart to ensure only the necessary applications run.

### Additional Exhibit Environment Tips

1. Disable screen blanking/screensaver
2. Configure automatic login
3. Hide the cursor if not needed for interaction
4. Consider disabling system notifications

## System Monitoring and Maintenance

### Monitoring systemd Services

The exhibit uses two systemd services: `docker_server.service` and `chromium.service`. Here's how to monitor them:

1. **Check service status**:
   ```
   sudo systemctl status docker_server.service
   sudo systemctl status chromium.service
   ```

2. **View service logs**:
   ```
   # View all logs for a service
   sudo journalctl -u docker_server.service
   sudo journalctl -u chromium.service
   
   # View only the most recent logs
   sudo journalctl -u docker_server.service -n 50
   
   # Follow logs in real-time
   sudo journalctl -u docker_server.service -f
   ```

3. **Restart services if needed**:
   ```
   sudo systemctl restart docker_server.service
   sudo systemctl restart chromium.service
   ```

### Monitoring System Resources

To monitor system resources in the terminal:

1. **CPU and Memory Usage**:
   ```
   # Real-time system resource monitoring
   htop
   ```

2. **Docker Resource Usage**:
   ```
   # View running containers
   docker ps
   
   # Check container resource usage
   docker stats
   
   # View container logs
   docker logs <container_id>
   ```

3. **GPU Usage** (for NVIDIA GPUs):
   ```
   # Check GPU usage
   nvidia-smi
   ```

### System Updates

#### Using Topgrade for System Updates

Topgrade is a tool that helps update everything on your system. To use it:

   ```
   topgrade
   ```
   This will update your system packages, firmware, and various package managers.

#### Updating Python Packages

To update the Python packages used in this project:

1. **Navigate to the backend directory**:
   ```
   cd backend
   ```

2. **Update all packages in requirements.txt**:
   ```
   pip-review --auto
   ```

3. **Update requirements.txt**:
   ```
   pip freeze > requirements.txt
   ```

#### Updating Node Packages

To update the Node.js packages used in the frontend:

1. **Navigate to the frontend directory**:
   ```
   cd frontend
   ```

2. **Update all packages**:
   ```
   npm update
   ```

## Extending the Software

### Modifying the Frontend

The frontend is built with React and TypeScript using Chakra UI for styling and Chart.js for visualization.

1. Navigate to the `frontend` directory
2. Install dependencies with `npm install`
3. Make your changes to the source files in `frontend/src/`
4. Test your changes with `npm start`
5. Build the production version with `npm run build`

Key files to modify:
- `frontend/src/pages/Home.tsx`: Main UI component
- `frontend/src/index.css`: Styling
- `frontend/public/images/`: Image assets

### Modifying the Backend

The backend is built with Flask and uses PyTorch for AI model inference.

1. Navigate to the `backend` directory
2. Install dependencies with `pip install -r requirements.txt`
3. Make your changes to the source files
4. Test your changes by running `python app.py`

Key modules to modify:
- `backend/app.py`: Main Flask application
- `backend/webcam/`: Webcam capture and processing
- `backend/Classifier/`: Classification framework
- `backend/traffic_sign_ai/`: AI models and inference

## Acknowledgements

The initial idea and parts of the software are developed as part of a bachelor thesis. The thesis is supported by the German Federal Office for Information Security: https://www.bsi.bund.de/DE/Service-Navi/Presse/Alle-Meldungen-News/Meldungen/KI-Sicherheit-im-Auto_230515.html

The paper and the source code of the thesis are open source: https://github.com/rhoentier/bachelor_thesis

The [German Museum Bonn](https://www.deutsches-museum.de/bonn) helped building the first exhibit and [imaginary](https://www.imaginary.org/de) helped building the second exhibit and this open source version.
