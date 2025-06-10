import qrcode
import os

def generate_qr_code(data, output_dir='static/qrcodes', filename=None):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    if not filename:
        filename = f"{data}.png"

    path = os.path.join(output_dir, filename)

    img = qrcode.make(data)
    img.save(path)

    return path  # You can return the relative URL path too