from flask import request  # type: ignore
from moviepy.editor import VideoFileClip, clips_array, ImageClip  # type: ignore
import os
import qrcode  # type: ignore
from io import BytesIO
import numpy as np  # type: ignore
from PIL import Image  # type: ignore

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"


def process_video(request):
    # Get uploaded video file and link from the request
    video_file = request.files.get("video")
    link = request.form.get("link")

    # Check if video file and link are provided
    if not video_file:
        return "No video file uploaded"
    if not link:
        return "No link provided"

    # Save the uploaded video file
    video_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(video_path)

    try:
        # Load the input video
        input_clip = VideoFileClip(video_path)
    except Exception as e:
        return f"Error loading video clip: {e}"

    # Generate colored QR code image from the provided link
    background_color = (255, 255, 255)  # White
    fill_color = (0, 0, 255)  # Blue
    qr_image_bytes = generate_colored_qr_code(
        link, background=background_color, fill_color=fill_color
    )

    # Merge video with QR code image
    final_clip = merge_video_with_qr_code(input_clip, qr_image_bytes)

    # Write the final video clip to a file
    output_path = os.path.join(OUTPUT_FOLDER, "output.mp4")
    final_clip.write_videofile(output_path, fps=input_clip.fps)

    # Remove the uploaded video file after processing
    # os.remove(video_path)

    output_filename = "output.mp4"

    return output_filename


def merge_video_with_qr_code(video_clip, qr_image_bytes):
    try:
        # Get the duration of the video clip
        duration = video_clip.duration
    except Exception as e:
        return f"Error loading video clip: {e}"

    # Calculate the duration of each part
    num_parts = 8
    part_duration = duration / num_parts

    # List to store the extracted video clips
    part_clips = []

    # Extract each part of the video
    for i in range(num_parts):
        start_time = i * part_duration
        end_time = (i + 1) * part_duration
        part_clip = video_clip.subclip(start_time, end_time)
        if i == 4:
            part_clips.append(None)
        part_clips.append(part_clip)

    # Reshape the list of clips to form a square pattern
    rows = 3
    cols = 3

    # Pad the list with None if the number of clips is less than rows * cols
    while len(part_clips) < rows * cols:
        part_clips.append(None)

    # Load the QR code image using PIL
    qr_image = Image.open(qr_image_bytes)

    # Convert the PIL image to a numpy array
    qr_image_np = np.array(qr_image)

    # Create an ImageClip object from the numpy array
    image_clip = ImageClip(qr_image_np, duration=part_duration)

    # Calculate the dimensions of the empty space
    empty_width = image_clip.size[0] * cols
    empty_height = image_clip.size[1] * rows

    # Calculate the position of the image clip in the empty space
    x_offset = (empty_width - image_clip.w) // 2
    y_offset = (empty_height - image_clip.h) // 2

    # Place the QR code image in the middle of the empty space
    image_position = (x_offset, y_offset)
    image_clip = image_clip.set_position(image_position)

    # Replace None values with the image clip in the list of clips
    for i in range(len(part_clips)):
        if part_clips[i] is None:
            part_clips[i] = image_clip

    # Create a single video where each part appears in its own designated space
    final_clip = clips_array(
        [[part_clips.pop(0) for _ in range(cols)] for _ in range(rows)]
    )

    return final_clip


def generate_colored_qr_code(link, background=(255, 255, 255), fill_color=(0, 0, 0)):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color=fill_color, back_color=background)
    qr_bytes = BytesIO()
    qr_img.save(qr_bytes, format="PNG")
    qr_bytes.seek(0)

    return qr_bytes
