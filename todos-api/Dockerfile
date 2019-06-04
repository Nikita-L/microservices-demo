FROM python:3.7
ENV PYTHONUNBUFFERED 1

ADD ./requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

ADD ./src/ /src

CMD python /src/main.py