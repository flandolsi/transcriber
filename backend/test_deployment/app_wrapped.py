import shutil
from fastapi import FastAPI, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi import FastAPI
from tempfile import NamedTemporaryFile
import json
from faster_whisper import WhisperModel
import kserve
from typing import Dict


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

class Transcriber(kserve.Model):
    def __init__(self, model_name):
        self.name = model_name
        super().__init__(self.name)
        self.load()
    

    def load(self):
        model_size = "base.en"
        # model_size = "large-v2"
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        # model = WhisperModel(model_size, device="cuda", compute_type="float16")
        self.ready = True
        print("model is ready")


    def predict(self, file: UploadFile, headers: Dict[str, str] = None) -> Dict:
        
        # data = file.body()
        # data = file.file
        print(file)
        # temp = NamedTemporaryFile()

        with open("test", "wb") as f:         
            shutil.copyfileobj(file.file, f)

        # dest_file = open(temp.name, 'wb+')
        # dest_file.write(data)
        # dest_file.close()

        segments, info = self.model.transcribe("test", beam_size=5)

        # segments_list = ((c.name,c.value) for c in segments)
        # yield json.dumps(segments_list)


        def recurrent_transcribe():
            for segment in segments:
                
                response = {}
                response = {'id': segment.id , 'lang': info.language,  'start':segment.start, 'end': segment.end, 'text': segment.text}

                yield json.dumps(response)

        return StreamingResponse(recurrent_transcribe(), media_type='application/json')
        


transcriber = Transcriber("test")

@app.post("/")
def post_transcriber(file: UploadFile):
    return transcriber.predict(file)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0',port=5000)


# parser = argparse.ArgumentParser(parents=[model_server.parser])
# parser.add_argument(
#     "--model_name", help="The name that the model is served under.")
# args, _ = parser.parse_known_args()

# if __name__ == "__main__":
#     model = Transcriber(args.model_name)
#     ModelServer().start([model])