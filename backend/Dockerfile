FROM python:3.10

COPY ./requirements.txt /app/requirements.txt

WORKDIR /app
RUN apt update
RUN apt install -y libgl1

RUN pip3 install torch torchvision
RUN pip3 install -r requirements.txt

COPY . /app
EXPOSE 9000

ENTRYPOINT ["python"]

CMD ["app.py"]