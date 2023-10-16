from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.encoders import jsonable_encoder
from tempfile import NamedTemporaryFile
#import ffmpeg
import sys
import json
from faster_whisper import WhisperModel

model_size = "base.en"
# model_size = "large-v2"

# model = WhisperModel(model_size, device="cuda", compute_type="float16")
model = WhisperModel(model_size, device="cpu", compute_type="int8")


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

@app.post("/")
async def api_create_order(request: Request):
    # print(request.headers)

    data = await request.body()

    temp = NamedTemporaryFile()

    dest_file = open(temp.name, 'wb+')
    dest_file.write(data)
    dest_file.close()

    segments, info = model.transcribe(temp.name, beam_size=5)

    # print("Detected language '%s' with probability %f" % (info.language, info.language_probability))



    async def recurrent_transcribe():
        for segment in segments:
            # output = "(%s   -> %s,%s) %s" % (segment.id, segment.start, segment.end, segment.text)
            
            response = {}
            response = {'id': segment.id , 'lang': info.language,  'start':segment.start, 'end': segment.end, 'text': segment.text}

            yield json.dumps(response)

    return StreamingResponse(recurrent_transcribe(), media_type='application/json')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0',port=5000)
