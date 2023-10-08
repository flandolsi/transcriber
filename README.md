# Local whisper server with frontend/backend to transcribe/translate mp3


Note: This is v 0.0.1 alpha still under dev + new features area planned


## frontend adapted from
https://github.com/mckaywrigley/chatbot-ui.git

## Bcakend uses fastapi / streaming response
```
python backend/app.py
```
Backend assumes Cuda. If not uncomment CPU line in app.py (and comment the GPU whisper model load)

