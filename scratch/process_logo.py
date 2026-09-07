from PIL import Image
import os

def process_image(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # If the pixel is very light (near white), make it transparent
        # Adjust threshold as needed. 240 is a good starting point.
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path}")

# Target paths
paths = [
    "F:/Trinay-AI/Home/Web_app/trinayai-web/src/assets/logo/Trinay-AI-Logo.jpeg",
    "F:/Trinay-AI/Home/Web_app/trinayai-admin/src/assets/logo/Trinay-AI-Logo.jpeg"
]

for p in paths:
    if os.path.exists(p):
        out = p.replace(".jpeg", ".png")
        process_image(p, out)
    else:
        print(f"Not found: {p}")
