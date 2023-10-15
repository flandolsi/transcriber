FROM python:3.10.12

COPY requirements.txt /opt/app/requirements.txt
COPY app.py /opt/app/app.py

WORKDIR /opt/app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD python app.py

