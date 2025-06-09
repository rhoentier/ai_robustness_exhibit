FROM python:3.13.4-slim

WORKDIR /app

COPY requirements.txt .

RUN apt-get update && \
    apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 && \
    apt-get clean && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]