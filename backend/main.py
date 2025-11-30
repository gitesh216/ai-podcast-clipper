from fastapi import Depends
import modal
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

class ProcessVideoRequest(BaseModel):
    s3_key: str

image = (modal.Image.from_registry(
    "nvidia/cuda:12.4.0-devel-ubuntu22.04", add_python="3.12")
    .apt_install(["ffmpeg", "libgl1-mesa-glx", "wget", "libcudnn8", "libcudnn8-dev"])
    .apt_install_from_requirements("requirements.txt")
    .run_commands(["mkdir -p /user/share/fonts/truetype/custom", 
                    "wget -O /user/share/fonts/truetype/custom/Anton-Regular.ttf https;//github.com/goggle/fonts/raw/main/ofl/anton/Anton-Regular.ttf",
                    "fc-cache -f -v"])
    .add_local_dir("asd", "/asd", copy=True))

app = modal.App("ai-podcast-clipper", image=image)

volume = modal.Volume.from_name(
    "ai-podcast-clipper-model-cache", create_if_missing=True
)
mount_path = "/root/.cache/torch"

auth_scheme = HTTPBearer()

@app.cls(gpu="L40S", timeout=900, retries=0, scaledown_window=20, secrets={modal.Secret.from_name("ai-podcast-clipper-secret")}, volumes={mount_path: volume})
class AiPodcastClipper:
    @modal.enter()
    def load_model(self):
        print("Loading models")
        pass

    @modal.fastapi_endpoint(method="POST")
    def process_video(self, request, token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
        print("Processing Video" + request.s3_key)
        pass

@app.local_entrypoint()
def main():
    import requests

    ai_podcast_cliper = AiPodcastClipper()

    url = ai_podcast_cliper.process_video.web_url

    payload = {
        "s3_key": "test1/mi65min.mp4"
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 123123"
    }

    response = requests.post(url, json=payload
                            , headers=headers)
    response.raise_for_status()
    result = response.json()
    print(result)