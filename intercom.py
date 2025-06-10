import cv2
from pyzbar import pyzbar
'''
pip install qrcode[pil]
pip install opencv-python pyzbar
'''
RTSP_URL = "rtsp://admin:admin@192.168.165.90:554/live/ch00_0"

cap = cv2.VideoCapture(RTSP_URL)

if not cap.isOpened():
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=-50)

    codes = pyzbar.decode(frame)
    for code in codes:
        data = code.data.decode("utf-8")
        x, y, w, h = code.rect
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, data, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow("QR Detect", frame)
    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()
