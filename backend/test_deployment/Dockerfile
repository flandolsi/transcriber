FROM python:3.10.12

WORKDIR /opt/app

COPY requirements.txt /opt/app/requirements.txt
COPY app.py /opt/app/app_fileobj.py

RUN pip3 install -r requirements.txt && \
    pip3 install -U "ray[default]" && \
    pip3 install azure-identity==1.12.0

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["python", "-m", "app"]