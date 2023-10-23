FROM python:3.10.12

COPY requirements_diarization.txt /opt/app/requirements_diarization.txt
COPY app_wDiarization_local.py /opt/app/app_wDiarization_local.py
COPY cache_dir opt/app/cache_dir

WORKDIR /opt/app
RUN pip install -r requirements_diarization.txt
EXPOSE 5000
CMD python app_wDiarization_local.py

