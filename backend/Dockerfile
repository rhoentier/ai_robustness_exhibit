FROM python:3.13.3-alpine

WORKDIR /app

COPY requirements.txt .

RUN apk add --no-cache libgl && \
    pip install --no-cache-dir -r requirements.txt

COPY . .
COPY ../frontend/build/ ./build/

EXPOSE 9000

CMD ["python", "app.py"]