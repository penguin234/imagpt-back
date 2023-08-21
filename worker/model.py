from transformers import BlipProcessor, BlipForQuestionAnswering

print('loading model')

processor = BlipProcessor.from_pretrained("JEILDLWLRMA/LHS-git-vqa-fine-tuned")
model = BlipForQuestionAnswering.from_pretrained("JEILDLWLRMA/LHS-git-vqa-fine-tuned")

print('loaded model')

import requests
from PIL import Image

def Proceed(image, question):
    """
    image: 이미지 파일 이름+확장자 (string)
    question: 질문 (string)

    return type: 답변 (string)
    """

    # 이 부분은 image가 저장될 폴더 경로로 수정해야 함
    image = Image.open(requests.get("http://3.113.1.111:8080/getimage/" + image, stream=True).raw)
    inputs = processor(images=image, text=question, return_tensors="pt")
    out = model.generate(**inputs)
    res = processor.decode(out[0], skip_special_tokens=True)
    print('res', res)
    return res
