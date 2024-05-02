# flask --app app.py --debug run
# pip install google-api-python-client

from flask import Flask, render_template, request, send_file, redirect, url_for # type: ignore
from video_process import process_video
from image_process import process_images
from PIL import Image
import os

from googleapiclient.discovery import build # type: ignore
from google.oauth2 import service_account # type: ignore

SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'nine-sauce-e6063c4e3b75-key.json'
PARENT_FOLDER_ID = '1rbHxpiz1fle1mPd7rr5J1ndRYQlHhYst'

def authenticate():
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes = SCOPES)
    return creds

def upload_photo(file_path):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': "Pic-local",
        'parents': [PARENT_FOLDER_ID]
    }

    file = service.files().create(
        body = file_metadata,
        media_body=file_path
    ).execute()

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

OUTPUT_FOLDER = "static"
app.config["OUTPUT_FOLDER"] = OUTPUT_FOLDER

if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)

if os.environ.get("FLASK_ENV") == "development":
    DEBUG_MODE = True
else:
    DEBUG_MODE = False
# Không cần thiết lúc chạy ở chế độ production
if DEBUG_MODE:
    app.debug = True


def delFile():
    # Xóa toàn bộ nội dung trong thư mục uploads
    for file_name in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print("Failed to delete", file_path, ":", e)

    # Xóa toàn bộ nội dung trong thư mục output
    for file_name in os.listdir(OUTPUT_FOLDER):
        file_path = os.path.join(OUTPUT_FOLDER, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print("Failed to delete", file_path, ":", e)


@app.route("/")
def index():
    delFile()
    return render_template("index.html")


@app.route("/video")
def video():
    return render_template("video_process.html")


@app.route("/image")
def image():
    return render_template("image_process.html")


@app.route("/process-video", methods=["POST"])
def process_video_route():
    return process_video(request)


@app.route("/process-image", methods=["GET","POST"])
def process_image_route():
    # Get image files and link from the request
    image_files = [Image.open(file) for file in request.files.getlist("picture")]
    link = request.form.get("image_link")

    # Process images and get the in-memory output
    output_buffer = process_images(image_files, link)

    # Upload the processed image to Google Drive
    upload_photo(output_buffer)

    # Redirect to the download page
    return redirect(url_for("download"))



@app.route("/download")
def download():
    return render_template("download.html")

if __name__ == "__main__":
    # Chỉ cần chạy ở chế độ debug nếu ở môi trường development
    if DEBUG_MODE:
        app.run(debug=True)
    else:
        app.run(host="0.0.0.0", port=8080)
