import torch
from PIL import Image
from transformers import BlipProcessor, BlipForQuestionAnswering

print('loading model')
processor = BlipProcessor.from_pretrained("ybelkada/blip-vqa-base")
model = BlipForQuestionAnswering.from_pretrained("ybelkada/blip-vqa-base", torch_dtype=torch.float16).to("cuda")
print('loaded model')

def Proceed(image, question):
    """
    image: 이미지 파일 이름+확장자 (string)
    question: 질문 (string)

    return type: 답변 (string)
    """

    # 이 부분은 image가 저장될 폴더 경로로 수정해야 함
    image_url = r'C:\Users\hjh61\Documents\Programming\hackerthons\2023 티지톤\demo\images' + '\\'
    image_url += image

    print('target image:', image_url)
    raw_image = Image.open(image_url).convert('RGB')
    inputs = processor(raw_image, question, return_tensors="pt").to("cuda", torch.float16)
    out = model.generate(**inputs)
    res = processor.decode(out[0], skip_special_tokens=True)
    print('res', res)
    return res
