#  Transcription comes from faster-whisper
# ---------------------------------------------------------------------
#  Diarization comes from pyannote speaker-diarization-3.0
#   (https://huggingface.co/pyannote/speaker-diarization-3.0)
#
# - Embeddings used in pyannote are hbredin/wespeaker-voxceleb-resnet34-LM
#   (https://huggingface.co/hbredin/wespeaker-voxceleb-resnet34-LM)
# - Segmentation model used is Segmentation 3.0 from pyannote 
#   (https://huggingface.co/pyannote/segmentation-3.0)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, JSONResponse
# from fastapi.encoders import jsonable_encoder
from tempfile import NamedTemporaryFile
#import ffmpeg
# import sys
# import json
from faster_whisper import WhisperModel
from pyannote.core import Segment
from pyannote.audio import Pipeline
# import torch
import os

model_size = "large-v2"

model = WhisperModel(model_size,# device="cuda",
                     compute_type="int8")

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.0@d8f7d289ef42a4575a83d28004bbb5cae9977e01", use_auth_token=False) # Diarization model
# send pipeline to GPU (when available)
# pipeline.to(torch.device("cuda"))


app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#### Define diarization functions
def get_text_with_timestamp(transcribe_res):
    timestamp_texts = []
    for i in transcribe_res:
        start = i.start
        end = i.end
        text = i.text
        timestamp_texts.append((Segment(round(start,2), round(end,2)), text))
    return timestamp_texts


def add_speaker_info_to_text(timestamp_texts, diarization):
    spk_text = []
    for seg, text in timestamp_texts:
        spk = diarization.crop(seg).argmax()
        spk_text.append((seg, spk, text))
    return spk_text


def merge_cache(text_cache):
    sentence = ''.join([item[-1] for item in text_cache])
    spk = text_cache[0][1]
    start = round(text_cache[0][0].start,2)
    end = round(text_cache[-1][0].end,2)
    return Segment(start, end), spk, sentence


PUNC_SENT_END = ['.', '?', '!']

def merge_sentence(spk_text):
    merged_spk_text = []
    pre_spk = None
    text_cache = []
    for seg, spk, text in spk_text:
        if spk != pre_spk and pre_spk is not None and len(text_cache) > 0:
            merged_spk_text.append(merge_cache(text_cache))
            text_cache = [(seg, spk, text)]
            pre_spk = spk

        elif text[-1] in PUNC_SENT_END:
            text_cache.append((seg, spk, text))
            merged_spk_text.append(merge_cache(text_cache))
            text_cache = []
            pre_spk = spk
        else:
            text_cache.append((seg, spk, text))
            pre_spk = spk
    if len(text_cache) > 0:
        merged_spk_text.append(merge_cache(text_cache))
    return merged_spk_text

def diarize_text(transcribe_res, diarization_result):
    timestamp_texts = get_text_with_timestamp(transcribe_res)
    spk_text = add_speaker_info_to_text(timestamp_texts, diarization_result)
    res_processed = merge_sentence(spk_text)
    return res_processed



@app.post("/")
async def api_create_order(request: Request):
    print(request.headers)

    data = await request.body()

    temp = NamedTemporaryFile()

    dest_file = open(temp.name, 'wb+')
    dest_file.write(data)
    dest_file.close()

    segments, info = model.transcribe(temp.name, beam_size=5)
    diarization = pipeline(temp.name, num_speakers=2)
    print("Finished diarization!")
    print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

    segments = list(segments) # Get transcription out of generator
    print("Finished transcription!")
    output = diarize_text(segments, diarization) # Get diarization
    print("Finished combining the two!")

    output_formatted = []
    for _, val in enumerate(output):
        # output_2[i][0] = str(output_2[i][0])
        segment_str = str(val[0])
        speaker = val[1]
        text = val[2]
        output_formatted.append((segment_str, speaker, text))
    print("Finished formatting!")

    response = {
    "lang": info.language,
    "text": output_formatted
    }

    # response = {'id': segment.id , 'lang': info.language,  'start':segment.start, 'end': segment.end, 'text': segment.text}

    return response


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
