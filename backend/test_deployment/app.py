from fastapi import Request
from fastapi.responses import StreamingResponse
from tempfile import NamedTemporaryFile
import json
import argparse
from faster_whisper import WhisperModel
from kserve import Model, ModelServer, model_server
from typing import Dict


class Transcriber(Model):
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


    async def predict(self, request: Request, headers: Dict[str, str] = None) -> Dict:
        
        data = await request.body()
        temp = NamedTemporaryFile()

        dest_file = open(temp.name, 'wb+')
        dest_file.write(data)
        dest_file.close()

        segments, info = self.model.transcribe(temp.name, beam_size=5)

        # segments_list = list(segments)
        # return segments_list
        
        async def recurrent_transcribe():
            for segment in segments:
                
                response = {}
                response = {'id': segment.id , 'lang': info.language,  'start':segment.start, 'end': segment.end, 'text': segment.text}

                yield json.dumps(response)

        return StreamingResponse(recurrent_transcribe(), media_type='application/json')


parser = argparse.ArgumentParser(parents=[model_server.parser])
parser.add_argument(
    "--model_name", help="The name that the model is served under.")
args, _ = parser.parse_known_args()

if __name__ == "__main__":
    model = Transcriber(args.model_name)
    ModelServer().start([model])
