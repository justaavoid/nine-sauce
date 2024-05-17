# flask --app app.py --debug run

from flask import Flask, render_template, request, send_file, redirect, url_for  # type: ignore
from video_process import process_video
from image_process import process_images
import os
from extract_image import process_extract_image

# import del_file

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

OUTPUT_FOLDER = "output"
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


def delete_file_in_folder(UPLOAD_FOLDER, OUTPUT_FOLDER):

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
    delete_file_in_folder(UPLOAD_FOLDER=UPLOAD_FOLDER, OUTPUT_FOLDER=OUTPUT_FOLDER)
    # del_file.delFile(UPLOAD_FOLDER, OUTPUT_FOLDER)
    return render_template("index.html")


@app.route("/video")
def video():
    return render_template("video_process.html")


@app.route("/process-video", methods=["POST"])
def process_video_route():
    output_filename = process_video(request)
    processed_video_path = os.path.join(app.config["OUTPUT_FOLDER"], output_filename)
    # Redirect to the download page with the filename as a parameter
    return redirect(url_for("download", filename=processed_video_path))


@app.route("/image")
def image():
    return render_template("image_process.html")


@app.route("/process-image", methods=["POST"])
def process_image_route():
    # Lấy các file ảnh từ request
    image_files = request.files.getlist("picture")
    # Lấy link từ input text
    link = request.form.get("image_link")
    image = request.files.get("image_file")
    # Thư mục đầu ra
    output_dir = OUTPUT_FOLDER
    # Gọi hàm xử lý ảnh
    output_path = process_images(image_files, link, output_dir, image)
    # Chuyển hướng đến trang download
    return redirect(url_for("download", filename=output_path))


@app.route("/extract-image")
def extract_image():
    return render_template("extract_image.html")

@app.route("/extract-image-process", methods=["POST"])
def process_extract_image_route():

    img_io = process_extract_image(request)
    if isinstance(img_io, tuple):
        return img_io  # This handles error messages from process_extract_image

    # Save the BytesIO image to a file if necessary
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], 'merged_image.jpg')
    with open(output_path, 'wb') as f:
        f.write(img_io.getbuffer())

    return redirect(url_for("download", filename=output_path))

@app.route("/download/<filename>")
def download(filename):
    return render_template("download.html", filename=filename)


# Add a new route for downloading the video or image file directly
@app.route("/download-file/<filename>")
def download_file(filename):
    try:
        return send_file(filename, as_attachment=True)
    except Exception as e:
        # Xử lý ngoại lệ nếu có
        print("An error occurred:", e)


if __name__ == "__main__":
    # Chỉ cần chạy ở chế độ debug nếu ở môi trường development
    if DEBUG_MODE:
        app.run(debug=True)
    else:
        app.run(host="0.0.0.0", port=8080)
